"use strict";

require("core-js/modules/es.number.constructor.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TrackOptions = void 0;

var _utils = require("../utils");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var TrackOptions = /*#__PURE__*/function () {
  function TrackOptions(urlParamLookup, params) {
    _classCallCheck(this, TrackOptions);

    this.volumeRange = [params.minvolume, params.maxvolume];
    this.duration = [params.minduration, params.maxduration];
    this.deadAir = [params.mindeadair, params.maxdeadair];
    this.fadeInTime = [params.minfadeintime, params.maxfadeintime];
    this.fadeOutTime = [params.minfadeouttime, params.maxfadeouttime];
    this.repeatRecordings = !!params.repeatrecordings;
    this.tags = params.tag_filters;
    this.bannedDuration = params.banned_duration || 600, this.startWithSilence = (0, _utils.hasOwnProperty)(params, "start_with_silence") ? !!params.start_with_silence : true;
    this.fadeOutWhenFiltered = (0, _utils.hasOwnProperty)(params, "fadeout_when_filtered") ? !!params.fadeout_when_filtered : true;
    this.fadeOutMultiplier = 1;
    var fadeOutMultiplierParam = urlParamLookup("rwfFadeOutMultiplier");

    if (fadeOutMultiplierParam) {
      this.fadeOutMultiplier = Number(fadeOutMultiplierParam);
      console.log("Applying fade-out multiplier", this.fadeOutMultiplier);
    }
  }

  _createClass(TrackOptions, [{
    key: "randomVolume",
    get: function get() {
      return (0, _utils.random)(this.volumeRangeLowerBound, this.volumeRangeUpperBound);
    }
  }, {
    key: "randomDeadAir",
    get: function get() {
      return (0, _utils.random)(this.deadAirLowerBound, this.deadAirUpperBound);
    }
  }, {
    key: "randomFadeInDuration",
    get: function get() {
      return Math.min((0, _utils.random)(this.fadeInLowerBound, this.fadeInUpperBound), this.durationHalfway);
    }
  }, {
    key: "randomFadeOutDuration",
    get: function get() {
      return Math.min((0, _utils.random)(this.fadeOutLowerBound, this.fadeOutUpperBound), this.durationHalfway);
    }
  }, {
    key: "volumeRangeLowerBound",
    get: function get() {
      return this.volumeRange[0];
    }
  }, {
    key: "volumeRangeUpperBound",
    get: function get() {
      return this.volumeRange[1];
    }
  }, {
    key: "deadAirLowerBound",
    get: function get() {
      return this.deadAir[0];
    }
  }, {
    key: "deadAirUpperBound",
    get: function get() {
      return this.deadAir[1];
    }
  }, {
    key: "durationLowerBound",
    get: function get() {
      return this.duration[0];
    }
  }, {
    key: "durationUpperBound",
    get: function get() {
      return this.duration[1];
    }
  }, {
    key: "durationHalfway",
    get: function get() {
      return (this.durationUpperBound - this.durationLowerBound) / 2;
    }
  }, {
    key: "fadeInLowerBound",
    get: function get() {
      return this.fadeInTime[0];
    }
  }, {
    key: "fadeInUpperBound",
    get: function get() {
      return this.fadeInTime[1];
    }
  }, {
    key: "fadeOutLowerBound",
    get: function get() {
      return this.fadeOutTime[0];
    }
  }, {
    key: "fadeOutUpperBound",
    get: function get() {
      return this.fadeOutTime[1];
    }
  }]);

  return TrackOptions;
}();

exports.TrackOptions = TrackOptions;