"use strict";

require("core-js/modules/es.array.concat.js");

require("core-js/modules/es.array.includes.js");

require("core-js/modules/es.array.map.js");

require("core-js/modules/es.array.reduce.js");

require("core-js/modules/es.number.constructor.js");

require("core-js/modules/es.number.parse-int.js");

require("core-js/modules/es.object.keys.js");

require("core-js/modules/es.string.includes.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AssetPool = void 0;

var _assetSorter = require("./assetSorter");

var _assetFilters = require("./assetFilters");

var _utils = require("./utils");

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// add new fields to assets after they have been downloaded from the API to be used by rest of the mixing code
// also rewrite .wav as .mp3
var assetDecorationMapper = function assetDecorationMapper(timedAssets) {
  var timedAssetLookup = timedAssets.reduce(function (lookupTable, timedAsset) {
    return _objectSpread(_objectSpread({}, lookupTable), {}, _defineProperty({}, timedAsset.asset_id, timedAsset));
  }, {});
  return function (asset) {
    var _asset$start_time = asset.start_time,
        activeRegionLowerBound = _asset$start_time === void 0 ? 0 : _asset$start_time,
        _asset$end_time = asset.end_time,
        activeRegionUpperBound = _asset$end_time === void 0 ? 0 : _asset$end_time,
        assetUrl = asset.file;
    var activeRegionLength = activeRegionUpperBound - activeRegionLowerBound; // per Halsey we should always use mp3s; also we avoid specifying http/https to avoid mixed-content warnings

    if (!assetUrl) throw new Error("assetUrl was undefined!");
    var mp3Url = (0, _utils.cleanAudioURL)(assetUrl);

    var decoratedAsset = _objectSpread(_objectSpread({
      locationPoint: (0, _utils.coordsToPoints)({
        latitude: asset.latitude || 1,
        longitude: asset.longitude || 1
      }),
      playCount: 0,
      activeRegionLength: activeRegionLength,
      activeRegionUpperBound: activeRegionUpperBound,
      activeRegionLowerBound: activeRegionLowerBound
    }, asset), {}, {
      created: asset.created ? new Date(asset.created) : undefined,
      file: mp3Url
    });

    var timedAsset = timedAssetLookup[asset.id];

    if (timedAsset) {
      decoratedAsset.timedAssetStart = timedAsset.start;
      decoratedAsset.timedAssetEnd = timedAsset.end;
    }

    return decoratedAsset;
  };
};

var AssetPool = /*#__PURE__*/function () {
  function AssetPool(_ref) {
    var _ref$assets = _ref.assets,
        assets = _ref$assets === void 0 ? [] : _ref$assets,
        _ref$timedAssets = _ref.timedAssets,
        timedAssets = _ref$timedAssets === void 0 ? [] : _ref$timedAssets,
        _ref$filterChain = _ref.filterChain,
        filterChain = _ref$filterChain === void 0 ? _assetFilters.roundwareDefaultFilterChain : _ref$filterChain,
        _ref$sortMethods = _ref.sortMethods,
        sortMethods = _ref$sortMethods === void 0 ? [] : _ref$sortMethods,
        _ref$mixParams = _ref.mixParams,
        mixParams = _ref$mixParams === void 0 ? {} : _ref$mixParams;

    _classCallCheck(this, AssetPool);

    this.assets = assets;
    this.updateAssets(assets, timedAssets);
    if (typeof mixParams.ordering !== "string") throw new Error("Please pass ordering in mixParams");
    this.assetSorter = new _assetSorter.AssetSorter({
      sortMethods: sortMethods,
      ordering: mixParams.ordering
    });
    this.playingTracks = {};
    this.mixParams = mixParams;
    this.filterChain = filterChain;
    this.sortAssets();
  }

  _createClass(AssetPool, [{
    key: "updateAssets",
    value: function updateAssets() {
      var assets = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var timedAssets = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      this.assets = assets.map(assetDecorationMapper(timedAssets));
    }
  }, {
    key: "nextForTrack",
    value: function nextForTrack(track, _ref2) {
      var _this = this;

      var number = _ref2.elapsedSeconds,
          _ref2$filterOutAssets = _ref2.filterOutAssets,
          filterOutAssets = _ref2$filterOutAssets === void 0 ? [] : _ref2$filterOutAssets,
          stateParams = _objectWithoutProperties(_ref2, ["elapsedSeconds", "filterOutAssets"]);

      var mixParams = _objectSpread(_objectSpread(_objectSpread({}, this.mixParams), track.mixParams), stateParams);

      console.log("picking asset for ".concat(track, " from ").concat(this.assets.length, ", params = ").concat(JSON.stringify(mixParams)));
      var rankedAssets = this.assets.reduce(function (rankings, asset) {
        if (filterOutAssets.includes(asset)) return rankings;

        var rank = _this.filterChain(asset, mixParams);

        if (rank) {
          // @ts-ignore
          rankings[rank] = rankings[rank] || []; // @ts-ignore

          rankings[rank].push(asset);
        }

        return rankings;
      }, {});
      var rankingGroups = Object.keys(rankedAssets).map(function (a) {
        return Number.parseInt(a);
      });

      if (rankingGroups === []) {
        console.warn("All assets filtered out");
        return;
      }

      var topPriorityRanking = rankingGroups.sort()[0]; // play least-recently played assets first
      // @ts-ignore

      var priorityAssets = rankedAssets[topPriorityRanking] || []; // @ts-ignore not sure why sort is used on type object

      priorityAssets.sort(function (a, b) {
        return b.playCount - a.playCount;
      }); // @ts-ignore

      var nextAsset = priorityAssets.pop();
      if (nextAsset) nextAsset.playCount++;
      return nextAsset;
    }
  }, {
    key: "sortAssets",
    value: function sortAssets() {
      this.assetSorter.sort(this.assets);
    }
  }, {
    key: "add",
    value: function add(asset) {
      this.assets.push(asset);
      this.sortAssets();
    }
  }]);

  return AssetPool;
}();

exports.AssetPool = AssetPool;