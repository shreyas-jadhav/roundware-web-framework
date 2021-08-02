"use strict";

require("core-js/modules/es.array.filter.js");

require("core-js/modules/es.array.for-each.js");

require("core-js/modules/es.array.map.js");

require("core-js/modules/es.number.constructor.js");

require("core-js/modules/es.object.freeze.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.regexp.to-string.js");

require("core-js/modules/web.dom-collections.for-each.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Mixer = exports.GeoListenMode = void 0;

var _assetPool = require("./assetPool");

var _playlist = require("./playlist");

var _speaker_track = require("./speaker_track");

var _utils = require("./utils");

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var GeoListenMode = Object.freeze({
  DISABLED: 0,
  MANUAL: 1,
  AUTOMATIC: 2
});
exports.GeoListenMode = GeoListenMode;

var Mixer = /*#__PURE__*/function () {
  function Mixer(_ref) {
    var client = _ref.client,
        windowScope = _ref.windowScope,
        listenerLocation = _ref.listenerLocation,
        prefetchSpeakerAudio = _ref.prefetchSpeakerAudio,
        _ref$filters = _ref.filters,
        filters = _ref$filters === void 0 ? [] : _ref$filters,
        _ref$sortMethods = _ref.sortMethods,
        sortMethods = _ref$sortMethods === void 0 ? [] : _ref$sortMethods,
        _ref$mixParams = _ref.mixParams,
        mixParams = _ref$mixParams === void 0 ? {} : _ref$mixParams;

    _classCallCheck(this, Mixer);

    _defineProperty(this, "speakerTracks", []);

    this.playing = false;
    this._windowScope = windowScope;
    this._client = client;
    this._prefetchSpeakerAudio = prefetchSpeakerAudio;
    var assets = client.assets();
    var timedAssets = client.timedAssets();
    this.mixParams = _objectSpread({
      listenerPoint: (0, _utils.coordsToPoints)({
        latitude: listenerLocation.latitude,
        longitude: listenerLocation.longitude
      })
    }, mixParams);
    this.assetPool = new _assetPool.AssetPool({
      assets: assets,
      timedAssets: timedAssets,
      // @ts-ignore here it asks for a function
      filters: filters,
      sortMethods: sortMethods,
      mixParams: this.mixParams
    });
  }

  _createClass(Mixer, [{
    key: "updateParams",
    value: function updateParams(_ref2) {
      var listenerLocation = _ref2.listenerLocation,
          params = _objectWithoutProperties(_ref2, ["listenerLocation"]);

      if (listenerLocation) {
        params.listenerPoint = (0, _utils.coordsToPoints)({
          latitude: listenerLocation.latitude,
          longitude: listenerLocation.longitude
        });
      }

      this.mixParams = _objectSpread(_objectSpread({}, this.mixParams), params);

      if (this.playlist) {
        this.playlist.updateParams(params);
      }

      if (this.speakerTracks) {
        var _iterator = _createForOfIteratorHelper(this.speakerTracks),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var t = _step.value;
            //@ts-ignore
            t.updateParams(this.playing, params);
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }
    }
    /**
     * @param  {number} trackId
     */

  }, {
    key: "skipTrack",
    value: function skipTrack(trackId) {
      if (this.playlist) this.playlist.skip(trackId);
    }
  }, {
    key: "skip",
    value: function skip() {}
    /**
     * @param  {number} trackId
     */

  }, {
    key: "replayTrack",
    value: function replayTrack(trackId) {
      if (this.playlist) this.playlist.replay(trackId);
    }
    /**
     * @returns string
     */

  }, {
    key: "toString",
    value: function toString() {
      return "Roundware Mixer";
    }
  }, {
    key: "initContext",
    value: function initContext() {
      var _this = this;

      if (!this.playlist) {
        var audioContext = (0, _utils.buildAudioContext)(this._windowScope);
        if (!this.mixParams.listenerPoint) throw new Error("listenerPoint was missing from mixParams!");
        var listenerPoint = this.mixParams.listenerPoint;

        var speakers = this._client.speakers();

        var selectTrackId = (0, _utils.getUrlParam)(this._windowScope.location.toString(), "rwfSelectTrackId");

        var audioTracks = this._client.audiotracks();

        if (selectTrackId) {
          selectTrackId = Number(selectTrackId);
          audioTracks = audioTracks.filter(function (t) {
            return t.id === selectTrackId;
          });
          console.info("isolating track #".concat(selectTrackId));
        }

        this.playlist = new _playlist.Playlist({
          client: this._client,
          audioTracks: audioTracks,
          listenerPoint: listenerPoint,
          assetPool: this.assetPool,
          audioContext: audioContext,
          windowScope: this._windowScope
        });
        this.speakerTracks = speakers.map(function (speakerData) {
          return new _speaker_track.SpeakerTrack({
            audioContext: audioContext,
            listenerPoint: listenerPoint,
            prefetchAudio: _this._prefetchSpeakerAudio,
            data: speakerData
          });
        });
        this.updateParams(this.mixParams);
      }
    }
    /**
     * @returns boolean - playing
     */

  }, {
    key: "toggle",
    value: function toggle() {
      // Build the audio context and playlist if it doesn't exist yet.
      this.initContext();

      if (this.playing) {
        this.playing = false;
        if (this.playlist) this.playlist.pause();
        this.speakerTracks.forEach(function (s) {
          return s.pause();
        });
      } else {
        this.playing = true;
        if (this.playlist) this.playlist.play();
        this.speakerTracks.forEach(function (s) {
          return s.play();
        });
      }

      return this.playing;
    }
  }]);

  return Mixer;
}();

exports.Mixer = Mixer;