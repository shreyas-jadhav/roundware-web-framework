"use strict";

require("core-js/modules/es.array.concat.js");

require("core-js/modules/es.array.for-each.js");

require("core-js/modules/es.number.to-fixed.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.regexp.to-string.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PlaylistAudiotrack = void 0;

var _utils = require("./utils");

var _TrackStates = require("./TrackStates");

var _TrackOptions = require("./mixer/TrackOptions");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/*
@see https://github.com/loafofpiecrust/roundware-ios-framework-v2/blob/client-mixing/RWFramework/RWFramework/Playlist/AudioTrack.swift

 Audiotracks data looks like this:

 [{
   "id": 8,
   "minvolume": 0.7,
   "maxvolume": 0.7,
   "minduration": 200.0,
   "maxduration": 250.0,
   "mindeadair": 1.0,
   "maxdeadair": 3.0,
   "minfadeintime": 2.0,
   "maxfadeintime": 4.0,
   "minfadeouttime": 0.3,
   "maxfadeouttime": 1.0,
   "minpanpos": 0.0,
   "maxpanpos": 0.0,
   "minpanduration": 10.0,
   "maxpanduration": 20.0,
   "repeatrecordings": false,
   "active": true,
   "start_with_silence": false,
   "banned_duration": 600,
   "tag_filters": [],
   "project_id": 9
 }]


 asset looks like:

 {
  alt_text_loc_ids: []
  audio_length_in_seconds: 14.4
  created: "2019-03-13T20:09:34.237155"
  description: ""
  description_loc_ids: []
  end_time: 14.396
  envelope_ids: [6204]
  file: "https://prod.roundware.com/rwmedia/20190313-200933-43867.mp3"
  filename: "20190313-200933-43867.wav"
  id: 11511
  language_id: 1
  latitude: 42.4985662
  longitude: -71.2809467
  media_type: "audio"
  project_id: 27
  session_id: 43867
  shape: null
  start_time: 0
  submitted: true
  tag_ids: [290]
  updated: "2019-03-13T20:09:34.237155"
  user: null
  volume: 1
  weight: 50
  }

*/
//const LOGGABLE_AUDIO_ELEMENT_EVENTS = ['loadstart','playing','stalled','waiting']; // see https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement#Events
var LOGGABLE_AUDIO_ELEMENT_EVENTS = ["pause", "play", "playing", "waiting", "stalled"]; // see https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement#Events

var NEARLY_ZERO = 0.01; // webaudio spec says you can't use 0.0 as a value due to floating point math concerns

var PlaylistAudiotrack = /*#__PURE__*/function () {
  function PlaylistAudiotrack(_ref) {
    var _this = this;

    var audioContext = _ref.audioContext,
        windowScope = _ref.windowScope,
        audioData = _ref.audioData,
        playlist = _ref.playlist;

    _classCallCheck(this, PlaylistAudiotrack);

    this.trackId = audioData.id;
    this.timedAssetPriority = audioData.timed_asset_priority;
    this.playlist = playlist;
    this.playing = false;
    this.windowScope = windowScope;
    var audioElement = new Audio();
    audioElement.crossOrigin = "anonymous";
    audioElement.loop = false;
    var audioSrc = audioContext.createMediaElementSource(audioElement);
    var gainNode = audioContext.createGain();
    audioSrc.connect(gainNode);
    gainNode.connect(audioContext.destination);
    LOGGABLE_AUDIO_ELEMENT_EVENTS.forEach(function (name) {
      return audioElement.addEventListener(name, function () {
        return console.log("\t[".concat(_this, " audio ").concat(name, " event]"));
      });
    });
    audioElement.addEventListener("error", function () {
      return _this.onAudioError();
    });
    audioElement.addEventListener("ended", function () {
      return _this.onAudioEnded();
    });
    var trackOptions = new _TrackOptions.TrackOptions(function (param) {
      return (0, _utils.getUrlParam)(windowScope.location.toString(), param);
    }, audioData);
    this.audioContext = audioContext;
    this.audioElement = audioElement;
    this.gainNode = gainNode;
    this.trackOptions = trackOptions;
    this.mixParams = {
      timedAssetPriority: audioData.timed_asset_priority
    };
    this.setInitialTrackState();
  }

  _createClass(PlaylistAudiotrack, [{
    key: "setInitialTrackState",
    value: function setInitialTrackState() {
      this.state = (0, _TrackStates.makeInitialTrackState)(this, this.trackOptions);
    }
  }, {
    key: "onAudioError",
    value: function onAudioError(evt) {
      console.warn("\t[".concat(this, " audio error, skipping to next track]"), evt);
      this.setInitialTrackState();
    }
  }, {
    key: "onAudioEnded",
    value: function onAudioEnded() {
      console.log("\t[".concat(this, " audio ended event]"));
    }
  }, {
    key: "play",
    value: function play() {
      console.log("".concat(_utils.timestamp, " ").concat(this, ": ").concat(this.state));
      if (!this.state) console.warn("No Initial track state. call `setInitialTrackState()`");else this.state.play();
    }
  }, {
    key: "updateParams",
    value: function updateParams() {
      var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      this.mixParams = _objectSpread(_objectSpread({}, this.mixParams), params);
      if (this.state) this.state.updateParams(this.mixParams);else console.warn("State is undefined!");
    } // Halts any scheduled gain changes and holds at current level
    // @see https://developer.mozilla.org/en-US/docs/Web/API/AudioParam/cancelAndHoldAtTime

  }, {
    key: "holdGain",
    value: function holdGain() {
      var gain = this.gainNode.gain,
          currentTime = this.audioContext.currentTime;
      gain.cancelScheduledValues(currentTime);
    }
  }, {
    key: "setZeroGain",
    value: function setZeroGain() {
      var gain = this.gainNode.gain,
          currentTime = this.audioContext.currentTime;
      gain.setValueAtTime(NEARLY_ZERO, currentTime); // http://alemangui.github.io/blog//2015/12/26/ramp-to-value.html
    } // exponentialRampToValueAtTime sounds more gradual for fading in

  }, {
    key: "fadeIn",
    value: function fadeIn(fadeInDurationSeconds) {
      var currentAsset = this.currentAsset;

      if (!currentAsset || !currentAsset.volume) {
        console.warn("currentAsset is undefined!");
        return false;
      }

      var randomVolume = this.trackOptions.randomVolume;
      var finalVolume = randomVolume * currentAsset.volume;

      try {
        this.setZeroGain();
        this.playAudio();
        this.rampGain(finalVolume, fadeInDurationSeconds);
        return true;
      } catch (err) {
        this.currentAsset = undefined;
        console.warn("".concat(this, " unable to play"), currentAsset, err);
        return false;
      }
    }
  }, {
    key: "rampGain",
    value: function rampGain(finalVolume, durationSeconds) {
      var rampMethod = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "exponentialRampToValueAtTime";
      var gain = this.gainNode.gain,
          currentTime = this.audioContext.currentTime;
      console.log("\t[ramping ".concat(this, " gain to ").concat(finalVolume.toFixed(2), " (").concat(durationSeconds.toFixed(1), "s - ").concat(rampMethod, ")]"));

      try {
        gain.setValueAtTime(gain.value, currentTime); // http://alemangui.github.io/blog//2015/12/26/ramp-to-value.html

        gain[rampMethod](finalVolume, currentTime + durationSeconds);
        return true;
      } catch (err) {
        console.warn("Unable to ramp gain ".concat(this), err);
        return false;
      }
    } // linearRampToValueAtTime sounds more gradual for fading out

  }, {
    key: "fadeOut",
    value: function fadeOut(fadeOutDurationSeconds) {
      return this.rampGain(NEARLY_ZERO, fadeOutDurationSeconds, "linearRampToValueAtTime"); // 'exponentialRampToValueAtTime');
    }
  }, {
    key: "loadNextAsset",
    value: function loadNextAsset() {
      var audioElement = this.audioElement,
          currentAsset = this.currentAsset;

      if (!currentAsset || !currentAsset.playCount || !currentAsset.lastListenTime) {
        console.warn("currentAsset properties were undefined!");
        return false;
      }

      if (currentAsset) {
        currentAsset.playCount++;
        currentAsset.lastListenTime = new Date();
      }

      var newAsset = this.playlist.next(this);
      this.currentAsset = newAsset;

      if (newAsset) {
        var file = newAsset.file,
            start = newAsset.start;
        console.log("\t[loading next asset ".concat(this, ": ").concat(file, "]"));
        audioElement.src = file;
        audioElement.currentTime = start >= NEARLY_ZERO ? start : NEARLY_ZERO; // value but must fininite

        this.audioElement = audioElement;
        return newAsset;
      }

      return null;
    }
  }, {
    key: "pause",
    value: function pause() {
      console.log("".concat(_utils.timestamp, " pausing ").concat(this));
      if (!this.state) return console.warn("pause() was called on a undefined state!");
      this.state.pause();
      if (this.audioElement) this.audioElement.pause();
    }
  }, {
    key: "playAudio",
    value: function playAudio() {
      if (this.audioElement) this.audioElement.play();
    }
  }, {
    key: "pauseAudio",
    value: function pauseAudio() {
      this.holdGain();
      if (this.audioElement) this.audioElement.pause();
    }
  }, {
    key: "skip",
    value: function skip() {
      var state = this.state;
      console.log("Skipping ".concat(this));
      if (state) state.skip();
    }
  }, {
    key: "replay",
    value: function replay() {
      var state = this.state;
      console.log("Replaying ".concat(this));
      if (state) state.replay();
    }
  }, {
    key: "transition",
    value: function transition(newState) {
      var state = this.state,
          elapsedTimeMs = this.playlist.elapsedTimeMs;
      console.log("".concat(_utils.timestamp, " ").concat(this, ": '").concat(state, "' \u279C  '").concat(newState, "' (").concat((elapsedTimeMs / 1000).toFixed(1), "s elapsed)"));
      if (!this.state) return console.warn("!current state was undefined");
      this.state.finish();
      this.state = newState;
      this.state.play();
    }
  }, {
    key: "toString",
    value: function toString() {
      return "Track #".concat(this.trackId);
    }
  }]);

  return PlaylistAudiotrack;
}();

exports.PlaylistAudiotrack = PlaylistAudiotrack;