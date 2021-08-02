"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

require("core-js/modules/es.array.concat.js");

require("core-js/modules/es.number.to-fixed.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeInitialTrackState = exports.WaitingForAssetState = exports.FadingOutState = exports.PlayingState = exports.FadingInState = exports.DeadAirState = exports.TimedTrackState = exports.LoadingState = void 0;

var _AssetEnvelope = require("./mixer/AssetEnvelope");

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 Common sequence of states:
 Silence => FadingIn => PlayingAsset => FadingOut => Silence
 */
var LoadingState = /*#__PURE__*/function () {
  function LoadingState(track, trackOptions) {
    _classCallCheck(this, LoadingState);

    this.track = track;
    this.trackOptions = trackOptions;
    this.asset = null;
  }

  _createClass(LoadingState, [{
    key: "play",
    value: function play() {
      var track = this.track,
          trackOptions = this.trackOptions;
      var asset = track.loadNextAsset();
      var newState;

      if (asset) {
        var assetEnvelope = new _AssetEnvelope.AssetEnvelope(trackOptions, asset);
        newState = new FadingInState(track, trackOptions, {
          assetEnvelope: assetEnvelope
        });
      } else {
        newState = new WaitingForAssetState(track, trackOptions);
      }

      this.track.transition(newState);
    }
  }, {
    key: "pause",
    value: function pause() {}
  }, {
    key: "finish",
    value: function finish() {}
  }, {
    key: "skip",
    value: function skip() {}
  }, {
    key: "replay",
    value: function replay() {}
  }, {
    key: "updateParams",
    value: function updateParams() {}
  }, {
    key: "toString",
    value: function toString() {
      return "Loading";
    }
  }]);

  return LoadingState;
}();

exports.LoadingState = LoadingState;

var TimedTrackState = /*#__PURE__*/function () {
  function TimedTrackState(track, trackOptions) {
    _classCallCheck(this, TimedTrackState);

    this.track = track;
    this.windowScope = track.windowScope;
    this.trackOptions = trackOptions;
    this.timerId = null;
  }
  /**
   * @param  {number=0} nextStateSecs
   * @returns number
   */


  _createClass(TimedTrackState, [{
    key: "play",
    value: function play() {
      var nextStateSecs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var timerId = this.timerId,
          timeRemainingMs = this.timeRemainingMs,
          trackId = this.track.trackId;
      if (timerId) return; // state is already active/playing

      if (timeRemainingMs) {
        var timeRemainingSecs = timeRemainingMs / 1000;
        console.log("\t[Resuming track #".concat(trackId, " timer: next state in ").concat(timeRemainingSecs.toFixed(1), "s]"));
        this.setNextStateTimer(timeRemainingMs);
        return timeRemainingSecs;
      } //console.log(`Playing track state ${this}: ${nextStateSecs}s`);


      var nextStateMs = nextStateSecs * 1000;
      this.setNextStateTimer(nextStateMs);
      return nextStateSecs;
    }
    /**
     */

  }, {
    key: "pause",
    value: function pause() {
      this.timeRemainingMs = this.clearTimer();
      console.log("\t[Pausing track #".concat(this.track.trackId, " timer: next state in ").concat((this.timeRemainingMs / 1000).toFixed(1), "s"));
    }
  }, {
    key: "clearTimer",
    value: function clearTimer() {
      var now = new Date();
      var timerId = this.timerId,
          _this$timerApproximat = this.timerApproximateEndingAtMs,
          timerApproximateEndingAtMs = _this$timerApproximat === void 0 ? now.getTime() : _this$timerApproximat,
          windowScope = this.windowScope;

      if (timerId) {
        windowScope.clearTimeout(timerId);
        delete this.timerApproximateEndingAtMs; // @ts-ignore

        var timeRemainingMs = Math.max(timerApproximateEndingAtMs - now.getTime(), 0);
        return timeRemainingMs;
      }

      return 0;
    }
  }, {
    key: "finish",
    value: function finish() {
      this.clearTimer();
      delete this.timeRemainingMs;
    }
  }, {
    key: "setNextStateTimer",
    value: function setNextStateTimer(timeMs) {
      var _this = this;

      this.timerId = this.windowScope.setTimeout(function () {
        return _this.setNextState();
      }, timeMs);
      this.timerApproximateEndingAtMs = new Date().getTime() + timeMs;
    }
  }, {
    key: "setNextState",
    value: function setNextState() {
      console.warn("Track state '".concat(this, "' does not implement a next state"));
    }
  }, {
    key: "skip",
    value: function skip() {
      this.finish();
      this.setNextState();
    }
  }, {
    key: "replay",
    value: function replay() {
      console.log("replay() not implemented yet");
    }
  }, {
    key: "setLoadingState",
    value: function setLoadingState() {
      var track = this.track,
          trackOptions = this.trackOptions;
      var loadingState = new LoadingState(track, trackOptions);
      track.transition(loadingState);
    } //@ts-ignore

  }, {
    key: "updateParams",
    value: function updateParams(params) {}
  }]);

  return TimedTrackState;
}();

exports.TimedTrackState = TimedTrackState;

var DeadAirState = /*#__PURE__*/function (_TimedTrackState) {
  _inherits(DeadAirState, _TimedTrackState);

  var _super = _createSuper(DeadAirState);

  function DeadAirState(track, trackOptions) {
    var _this2;

    _classCallCheck(this, DeadAirState);

    _this2 = _super.call(this, track, trackOptions);
    _this2.deadAirSeconds = _this2.trackOptions.randomDeadAir;
    return _this2;
  }

  _createClass(DeadAirState, [{
    key: "play",
    value: function play() {
      _get(_getPrototypeOf(DeadAirState.prototype), "play", this).call(this, this.deadAirSeconds);
    }
  }, {
    key: "setNextState",
    value: function setNextState() {
      this.setLoadingState();
    }
  }, {
    key: "toString",
    value: function toString() {
      return "DeadAir (".concat(this.deadAirSeconds.toFixed(1), "s)");
    }
  }, {
    key: "updateParams",
    value: function updateParams() {}
  }]);

  return DeadAirState;
}(TimedTrackState);

exports.DeadAirState = DeadAirState;

var FadingInState = /*#__PURE__*/function (_TimedTrackState2) {
  _inherits(FadingInState, _TimedTrackState2);

  var _super2 = _createSuper(FadingInState);

  function FadingInState(track, trackOptions, _ref) {
    var _this3;

    var assetEnvelope = _ref.assetEnvelope;

    _classCallCheck(this, FadingInState);

    _this3 = _super2.call(this, track, trackOptions);
    _this3.assetEnvelope = assetEnvelope;
    return _this3;
  }

  _createClass(FadingInState, [{
    key: "play",
    value: function play() {
      var track = this.track,
          fadeInDuration = this.assetEnvelope.fadeInDuration;

      var fadeInSecondsRemaining = _get(_getPrototypeOf(FadingInState.prototype), "play", this).call(this, fadeInDuration);

      if (!fadeInSecondsRemaining) return;
      var success = track.fadeIn(fadeInSecondsRemaining);
      if (!success) this.setLoadingState();
    }
  }, {
    key: "pause",
    value: function pause() {
      _get(_getPrototypeOf(FadingInState.prototype), "pause", this).call(this);

      this.track.pauseAudio();
    }
  }, {
    key: "setNextState",
    value: function setNextState() {
      var track = this.track,
          trackOptions = this.trackOptions,
          assetEnvelope = this.assetEnvelope;
      track.transition(new PlayingState(track, trackOptions, {
        assetEnvelope: assetEnvelope
      }));
    }
  }, {
    key: "toString",
    value: function toString() {
      var _this$assetEnvelope = this.assetEnvelope,
          fadeInDuration = _this$assetEnvelope.fadeInDuration,
          assetId = _this$assetEnvelope.assetId;
      return "FadingIn Asset #".concat(assetId, " (").concat(fadeInDuration.toFixed(1), "s)");
    }
  }]);

  return FadingInState;
}(TimedTrackState);

exports.FadingInState = FadingInState;

var PlayingState = /*#__PURE__*/function (_TimedTrackState3) {
  _inherits(PlayingState, _TimedTrackState3);

  var _super3 = _createSuper(PlayingState);

  function PlayingState(track, trackOptions, _ref2) {
    var _this4;

    var assetEnvelope = _ref2.assetEnvelope;

    _classCallCheck(this, PlayingState);

    _this4 = _super3.call(this, track, trackOptions);
    _this4.assetEnvelope = assetEnvelope;
    return _this4;
  }

  _createClass(PlayingState, [{
    key: "play",
    value: function play() {
      var track = this.track,
          startFadingOutSecs = this.assetEnvelope.startFadingOutSecs;

      _get(_getPrototypeOf(PlayingState.prototype), "play", this).call(this, startFadingOutSecs);

      track.playAudio(); //console.log(`Playing asset #${assetId} (start fading out: ${remainingSeconds.toFixed(1)}s)`);
    }
  }, {
    key: "pause",
    value: function pause() {
      _get(_getPrototypeOf(PlayingState.prototype), "pause", this).call(this);

      this.track.pauseAudio();
    }
  }, {
    key: "toString",
    value: function toString() {
      var _this$assetEnvelope2 = this.assetEnvelope,
          assetId = _this$assetEnvelope2.assetId,
          startFadingOutSecs = _this$assetEnvelope2.startFadingOutSecs;
      return "Playing asset #".concat(assetId, " (").concat(startFadingOutSecs.toFixed(1), "s)");
    }
  }, {
    key: "setNextState",
    value: function setNextState() {
      var track = this.track,
          trackOptions = this.trackOptions,
          assetEnvelope = this.assetEnvelope;
      track.transition(new FadingOutState(track, trackOptions, {
        assetEnvelope: assetEnvelope
      }));
    }
  }]);

  return PlayingState;
}(TimedTrackState);

exports.PlayingState = PlayingState;

var FadingOutState = /*#__PURE__*/function (_TimedTrackState4) {
  _inherits(FadingOutState, _TimedTrackState4);

  var _super4 = _createSuper(FadingOutState);

  function FadingOutState(track, trackOptions, _ref3) {
    var _this5;

    var assetEnvelope = _ref3.assetEnvelope;

    _classCallCheck(this, FadingOutState);

    _this5 = _super4.call(this, track, trackOptions);
    _this5.assetEnvelope = assetEnvelope;
    return _this5;
  }

  _createClass(FadingOutState, [{
    key: "play",
    value: function play() {
      var track = this.track,
          fadeOutDuration = this.assetEnvelope.fadeOutDuration;

      var remainingSeconds = _get(_getPrototypeOf(FadingOutState.prototype), "play", this).call(this, fadeOutDuration);

      if (!remainingSeconds) return;

      if (track.fadeOut(remainingSeconds)) {
        track.playAudio();
      } else {
        this.setLoadingState();
      }
    }
  }, {
    key: "pause",
    value: function pause() {
      _get(_getPrototypeOf(FadingOutState.prototype), "pause", this).call(this);

      this.track.pauseAudio();
    }
  }, {
    key: "setNextState",
    value: function setNextState() {
      this.track.transition(new DeadAirState(this.track, this.trackOptions));
    }
  }, {
    key: "toString",
    value: function toString() {
      var _this$assetEnvelope3 = this.assetEnvelope,
          assetId = _this$assetEnvelope3.assetId,
          fadeOutDuration = _this$assetEnvelope3.fadeOutDuration;
      return "FadingOut asset #".concat(assetId, " (").concat(fadeOutDuration.toFixed(1), "s)");
    }
  }]);

  return FadingOutState;
}(TimedTrackState);

exports.FadingOutState = FadingOutState;
var DEFAULT_WAITING_FOR_ASSET_INTERVAL_SECONDS = 10;

var WaitingForAssetState = /*#__PURE__*/function (_TimedTrackState5) {
  _inherits(WaitingForAssetState, _TimedTrackState5);

  var _super5 = _createSuper(WaitingForAssetState);

  function WaitingForAssetState(track, trackOptions) {
    _classCallCheck(this, WaitingForAssetState);

    return _super5.call(this, track, trackOptions);
  }

  _createClass(WaitingForAssetState, [{
    key: "play",
    value: function play() {
      _get(_getPrototypeOf(WaitingForAssetState.prototype), "play", this).call(this, DEFAULT_WAITING_FOR_ASSET_INTERVAL_SECONDS);
    }
  }, {
    key: "updateParams",
    value: function updateParams() {
      var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _get(_getPrototypeOf(WaitingForAssetState.prototype), "updateParams", this).call(this, params);

      this.finish(); // move to LoadingState in case new assets are available

      this.setLoadingState();
    }
  }, {
    key: "setNextState",
    value: function setNextState() {
      this.setLoadingState();
    }
  }, {
    key: "toString",
    value: function toString() {
      return "WaitingForAsset (".concat(DEFAULT_WAITING_FOR_ASSET_INTERVAL_SECONDS, "s)");
    }
  }]);

  return WaitingForAssetState;
}(TimedTrackState);

exports.WaitingForAssetState = WaitingForAssetState;

var makeInitialTrackState = function makeInitialTrackState(track, trackOptions) {
  var startWithSilence = trackOptions.startWithSilence;
  var stateClass = startWithSilence ? DeadAirState : LoadingState;
  var newState = new stateClass(track, trackOptions);
  return newState;
};

exports.makeInitialTrackState = makeInitialTrackState;