"use strict";

require("core-js/modules/es.array.find.js");

require("core-js/modules/es.array.includes.js");

require("core-js/modules/es.object.assign.js");

require("core-js/modules/es.object.freeze.js");

require("core-js/modules/es.string.includes.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.allAssetFilter = allAssetFilter;
exports.anyTagsFilter = anyTagsFilter;
exports.timedAssetFilter = timedAssetFilter;
exports.assetShapeFilter = assetShapeFilter;
exports.roundwareDefaultFilterChain = exports.dateRangeFilter = exports.timedRepeatFilter = exports.distanceRangesFilter = exports.distanceFixedFilter = exports.ASSET_PRIORITIES = void 0;

var _distance = _interopRequireDefault(require("@turf/distance"));

var _booleanPointInPolygon = _interopRequireDefault(require("@turf/boolean-point-in-polygon"));

var _utils = require("./utils");

var _mixer = require("./mixer");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var ASSET_PRIORITIES = Object.freeze({
  DISCARD: false,
  NEUTRAL: 0,
  LOWEST: 1,
  NORMAL: 100,
  HIGHEST: 999
});
exports.ASSET_PRIORITIES = ASSET_PRIORITIES;

var alwaysLowest = function alwaysLowest() {
  return ASSET_PRIORITIES.LOWEST;
};

var alwaysNeutral = function alwaysNeutral() {
  return ASSET_PRIORITIES.NEUTRAL;
}; // eslint-disable-line no-unused-vars
// Accept an asset if any one of the provided filters passes, returns the first
// non-discarded and non-neutral rank


function anyAssetFilter() {
  var filters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

  var _ref = arguments.length > 1 ? arguments[1] : undefined,
      mixParams = Object.assign({}, _ref);

  if ((0, _utils.isEmpty)(filters)) return alwaysLowest;
  return function (asset, _ref2) {
    var stateParams = Object.assign({}, _ref2);

    var _iterator = _createForOfIteratorHelper(filters),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var filter = _step.value;
        var rank = filter(asset, _objectSpread(_objectSpread({}, mixParams), stateParams));

        if (rank !== ASSET_PRIORITIES.DISCARD && rank !== ASSET_PRIORITIES.NEUTRAL) {
          return rank;
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    return ASSET_PRIORITIES.DISCARD;
  };
}
/** Filter composed of multiple inner filters that accepts assets which pass every inner filter. */


function allAssetFilter() {
  var filters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

  var _ref3 = arguments.length > 1 ? arguments[1] : undefined,
      mixParams = Object.assign({}, _ref3);

  if ((0, _utils.isEmpty)(filters)) return alwaysLowest;
  return function (asset, _ref4) {
    var stateParams = Object.assign({}, _ref4);
    var ranks = [];

    var _iterator2 = _createForOfIteratorHelper(filters),
        _step2;

    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var filter = _step2.value;
        var rank = filter(asset, _objectSpread(_objectSpread({}, mixParams), stateParams));
        if (rank === ASSET_PRIORITIES.DISCARD) return rank; // can skip remaining filters

        ranks.push(rank);
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }

    var finalRank = ranks.find(function (r) {
      return r !== ASSET_PRIORITIES.NEUTRAL;
    }) || ranks[0];
    return finalRank;
  };
} // a "pre-filter" used by geo-enabled filters to make sure if we are missing data, or geoListenMode is DISABLED,
// we always return a neutral ranking


function rankForGeofilteringEligibility(asset, _ref5) {
  var listenerPoint = _ref5.listenerPoint,
      geoListenMode = _ref5.geoListenMode;
  return geoListenMode !== _mixer.GeoListenMode.DISABLED && listenerPoint && asset;
}

var calculateDistanceInMeters = function calculateDistanceInMeters(loc1, loc2) {
  return (0, _distance.default)(loc1, loc2, {
    units: "meters"
  });
};
/** Only accepts an asset if the user is within the project-configured recording radius  */


var distanceFixedFilter = function distanceFixedFilter() {
  return function (asset, options) {
    if (options.geoListenMode === _mixer.GeoListenMode.DISABLED) {
      return ASSET_PRIORITIES.LOWEST;
    }

    if (!rankForGeofilteringEligibility(asset, options)) return ASSET_PRIORITIES.NEUTRAL;
    var assetLocationPoint = asset.locationPoint;
    var listenerPoint = options.listenerPoint,
        recordingRadius = options.recordingRadius;
    if (!assetLocationPoint) throw new Error("assetLocationPoint is undefined!");
    var distance = calculateDistanceInMeters(listenerPoint, assetLocationPoint);

    if (distance < recordingRadius) {
      return ASSET_PRIORITIES.NORMAL;
    } else {
      return ASSET_PRIORITIES.DISCARD;
    }
  };
};
/**
 Accepts an asset if the user is within range of it based on the current dynamic distance range.
 */


exports.distanceFixedFilter = distanceFixedFilter;

var distanceRangesFilter = function distanceRangesFilter(asset, options) {
  if (options.getListenMode === _mixer.GeoListenMode.DISABLED) {
    return ASSET_PRIORITIES.LOWEST;
  }

  if (!rankForGeofilteringEligibility(asset, {
    geoListenMode: options.getListenMode,
    listenerPoint: options.listenerPoint
  })) {
    return ASSET_PRIORITIES.NEUTRAL;
  }

  var listenerPoint = options.listenerPoint,
      minDist = options.minDist,
      maxDist = options.maxDist;

  if (minDist === undefined || maxDist === undefined) {
    return ASSET_PRIORITIES.NEUTRAL;
  }

  var locationPoint = asset.locationPoint;
  if (!locationPoint) throw new Error("locationPoint is undefined!");
  var distance = calculateDistanceInMeters(listenerPoint, locationPoint);

  if (distance >= minDist && distance <= maxDist) {
    return ASSET_PRIORITIES.NORMAL;
  } else {
    return ASSET_PRIORITIES.DISCARD;
  }
}; // Rank the asset if it is tagged with one of the currently-enabled tag IDs


exports.distanceRangesFilter = distanceRangesFilter;

function anyTagsFilter() {
  return function (asset, _ref6) {
    var listenTagIds = _ref6.listenTagIds;
    if ((0, _utils.isEmpty)(listenTagIds)) return ASSET_PRIORITIES.LOWEST;
    var _asset$tag_ids = asset.tag_ids,
        IAssetDataagIds = _asset$tag_ids === void 0 ? [] : _asset$tag_ids;

    var _iterator3 = _createForOfIteratorHelper(IAssetDataagIds),
        _step3;

    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var tagId = _step3.value;
        if (listenTagIds.includes(tagId)) return ASSET_PRIORITIES.LOWEST; // matching only by tag should be the least-important filter
      }
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }

    return ASSET_PRIORITIES.DISCARD;
  };
} // keep assets that are slated to start now or in the past few minutes AND haven't been played before


function timedAssetFilter() {
  return function (asset, _ref7) {
    var _ref7$elapsedSeconds = _ref7.elapsedSeconds,
        elapsedSeconds = _ref7$elapsedSeconds === void 0 ? 0 : _ref7$elapsedSeconds,
        _ref7$timedAssetPrior = _ref7.timedAssetPriority,
        timedAssetPriority = _ref7$timedAssetPrior === void 0 ? "normal" : _ref7$timedAssetPrior;
    var timedAssetStart = asset.timedAssetStart,
        timedAssetEnd = asset.timedAssetEnd,
        playCount = asset.playCount;
    if (!timedAssetStart || !timedAssetEnd) return ASSET_PRIORITIES.DISCARD;
    if (timedAssetStart >= elapsedSeconds || timedAssetEnd <= elapsedSeconds || playCount && playCount > 0) return ASSET_PRIORITIES.DISCARD;
    var priorityEnumStr = timedAssetPriority.toUpperCase(); // "highest", "lowest", "normal", etc.

    return ASSET_PRIORITIES[priorityEnumStr] || ASSET_PRIORITIES.NEUTRAL;
  };
} // Accept an asset if the user is currently within its defined shape


function assetShapeFilter() {
  return function (asset, options) {
    var shape = asset.shape;
    if (!(shape && rankForGeofilteringEligibility(asset, options))) return ASSET_PRIORITIES.NEUTRAL;
    var listenerPoint = options.listenerPoint;

    if ((0, _booleanPointInPolygon.default)(listenerPoint, shape)) {
      return ASSET_PRIORITIES.NORMAL;
    } else {
      return ASSET_PRIORITIES.DISCARD;
    }
  };
} // Prevents assets from repeating until a certain time threshold has passed


var timedRepeatFilter = function timedRepeatFilter() {
  return function (asset, _ref8) {
    var _ref8$bannedDuration = _ref8.bannedDuration,
        bannedDuration = _ref8$bannedDuration === void 0 ? 600 : _ref8$bannedDuration;
    var lastListenTime = asset.lastListenTime;
    if (!lastListenTime) return ASSET_PRIORITIES.NORMAL; // e.g. asset has never been heard before

    var durationSinceLastListen = (new Date().getTime() - (typeof lastListenTime == "number" ? lastListenTime : lastListenTime.getTime())) / 1000;

    if (durationSinceLastListen <= bannedDuration) {
      return ASSET_PRIORITIES.DISCARD;
    } else {
      return ASSET_PRIORITIES.LOWEST;
    }
  };
};

exports.timedRepeatFilter = timedRepeatFilter;

var dateRangeFilter = function dateRangeFilter() {
  return function (asset, _ref9) {
    var startDate = _ref9.startDate,
        endDate = _ref9.endDate;

    if (startDate || endDate) {
      return (!startDate || asset.created >= startDate) && (!endDate || asset.created <= endDate) ? ASSET_PRIORITIES.NORMAL : ASSET_PRIORITIES.DISCARD;
    } else {
      return ASSET_PRIORITIES.LOWEST;
    }
  };
}; // @ts-ignore


exports.dateRangeFilter = dateRangeFilter;
var roundwareDefaultFilterChain = allAssetFilter([// @ts-ignore
anyAssetFilter([timedAssetFilter(), // if an asset is scheduled to play right now, or
assetShapeFilter(), // if an asset has a shape and we AREN'T in it, reject entirely, or
// @ts-ignore
allAssetFilter([distanceFixedFilter(), // if it has no shape, consider a fixed distance from it, or
// @ts-ignore
distanceRangesFilter() //angleFilter() // if the listener is within a user-configured distance or angle range
])]), timedRepeatFilter(), // only repeat assets if there's no other choice
//blockedAssetsFilter(), // skip blocked assets and users
anyTagsFilter(), // all the tags on an asset must be in our list of tags to listen for
dateRangeFilter() //trackTagsFilter(),     // if any track-level tag filters exist, apply them
//dynamicTagFilter("_ten_most_recent_days",mostRecentFilter({ days: 10 })) // Only pass assets created within the most recent 10 days
]);
exports.roundwareDefaultFilterChain = roundwareDefaultFilterChain;