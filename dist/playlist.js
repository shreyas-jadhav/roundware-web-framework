"use strict";

require("core-js/modules/es.array.for-each.js");

require("core-js/modules/es.array.iterator.js");

require("core-js/modules/es.array.map.js");

require("core-js/modules/es.map.js");

require("core-js/modules/es.number.constructor.js");

require("core-js/modules/es.number.to-fixed.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.regexp.to-string.js");

require("core-js/modules/es.string.iterator.js");

require("core-js/modules/web.dom-collections.for-each.js");

require("core-js/modules/web.dom-collections.iterator.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Playlist = void 0;

var _playlistAudioTrack = require("./playlistAudioTrack");

var _utils = require("./utils");

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Playlist = /*#__PURE__*/function () {
  function Playlist(_ref) {
    var _this = this;

    var client = _ref.client,
        _ref$audioTracks = _ref.audioTracks,
        audioTracks = _ref$audioTracks === void 0 ? [] : _ref$audioTracks,
        listenerPoint = _ref.listenerPoint,
        windowScope = _ref.windowScope,
        assetPool = _ref.assetPool,
        playlistTrackOptions = _objectWithoutProperties(_ref, ["client", "audioTracks", "listenerPoint", "windowScope", "assetPool"]);

    _classCallCheck(this, Playlist);

    this.listenerPoint = listenerPoint;
    this.playingTracks = [];
    this.assetPool = assetPool;
    this.playing = false;
    this.listenTagIds = [];
    this._client = client;
    var elapsedTimeMs = 0;
    var timerSecs = (0, _utils.getUrlParam)(windowScope.location.toString(), "rwfTimerSeconds");

    if (timerSecs) {
      var elapsedSecs = Number(timerSecs);
      elapsedTimeMs = elapsedSecs * 1000;
      console.log("Setting playlist timer to ".concat(elapsedSecs.toFixed(1), "s"));
    }

    this._elapsedTimeMs = elapsedTimeMs;
    var trackIdMap = {};
    var trackMap = new Map();
    audioTracks.forEach(function (audioData) {
      // @ts-ignore
      var track = new _playlistAudioTrack.PlaylistAudiotrack(_objectSpread(_objectSpread({
        audioData: audioData
      }, playlistTrackOptions), {}, {
        windowScope: windowScope,
        playlist: _this
      })); // @ts-ignore

      trackIdMap[track.trackId] = track;
      trackMap.set(track, null);
    }, {});
    this.trackMap = trackMap;
    this.trackIdMap = trackIdMap;
  }

  _createClass(Playlist, [{
    key: "updateParams",
    value: function updateParams(_ref2) {
      var listenerPoint = _ref2.listenerPoint,
          listenTagIds = _ref2.listenTagIds,
          params = _objectWithoutProperties(_ref2, ["listenerPoint", "listenTagIds"]);

      if (listenerPoint) this.listenerPoint = listenerPoint;

      if (listenTagIds) {
        this.listenTagIds = listenTagIds.map(function (t) {
          return Number(t);
        });
      }

      this.tracks.forEach(function (t) {
        return t.updateParams(params);
      });
    }
  }, {
    key: "play",
    value: function play() {
      this.tracks.forEach(function (t) {
        return t.play();
      });
      this.playlistLastStartedAt = new Date();
      this.playing = true;
    }
  }, {
    key: "skip",
    value: function skip(trackId) {
      if (typeof trackId == "undefined") return; // @ts-ignore

      var track = this.trackIdMap[Number(trackId)];
      if (track) track.skip();
    }
  }, {
    key: "replay",
    value: function replay(trackId) {
      // @ts-ignore
      var track = this.trackIdMap[Number(trackId)];
      if (track) track.replay();
    }
  }, {
    key: "pause",
    value: function pause() {
      this.tracks.forEach(function (t) {
        return t.pause();
      });

      if (this.playlistLastStartedAt) {
        this._elapsedTimeMs = this._elapsedTimeMs + (new Date().getMilliseconds() - this.playlistLastStartedAt.getMilliseconds());
        delete this.playlistLastStartedAt;
      }

      this.playing = false;
    }
  }, {
    key: "next",
    value: function next(forTrack) {
      var assetPool = this.assetPool,
          filterOutAssets = this.currentlyPlayingAssets,
          elapsedTimeMs = this.elapsedTimeMs,
          listenTagIds = this.listenTagIds;
      var elapsedSeconds = elapsedTimeMs / 1000;
      var nextAsset = assetPool.nextForTrack(forTrack, {
        filterOutAssets: filterOutAssets,
        elapsedSeconds: elapsedSeconds,
        listenerPoint: this.listenerPoint,
        listenTagIds: listenTagIds
      });
      this.trackMap.set(forTrack, nextAsset);

      this._client._triggerOnPlayAssets();

      return nextAsset;
    }
  }, {
    key: "tracks",
    get: function get() {
      // @ts-ignore
      return _toConsumableArray(this.trackMap.keys());
    }
  }, {
    key: "currentlyPlayingAssets",
    get: function get() {
      var assets = []; // @ts-ignore

      var _iterator = _createForOfIteratorHelper(this.trackMap.values()),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var a = _step.value;

          if (a) {
            assets.push(a);
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      return assets;
    }
  }, {
    key: "elapsedTimeMs",
    get: function get() {
      var now = new Date();
      var lastStartedAt = this.playlistLastStartedAt ? this.playlistLastStartedAt : now;
      var elapsedSinceLastStartMs = now.getMilliseconds() - lastStartedAt.getMilliseconds();
      return this._elapsedTimeMs + elapsedSinceLastStartMs;
    }
  }]);

  return Playlist;
}();

exports.Playlist = Playlist;