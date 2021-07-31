"use strict";

require("core-js/modules/es.number.constructor.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AssetEnvelope = void 0;

var _utils = require("../utils");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var AssetEnvelope = /*#__PURE__*/function () {
  function AssetEnvelope(trackOptions, asset) {
    _classCallCheck(this, AssetEnvelope);

    var randomFadeInDuration = trackOptions.randomFadeInDuration,
        randomFadeOutDuration = trackOptions.randomFadeOutDuration,
        fadeOutMultiplier = trackOptions.fadeOutMultiplier,
        durationLowerBound = trackOptions.durationLowerBound,
        durationUpperBound = trackOptions.durationUpperBound;
    var activeRegionLowerBound = asset.activeRegionLowerBound,
        activeRegionUpperBound = asset.activeRegionUpperBound,
        activeRegionLength = asset.activeRegionLength;
    this.asset = asset;
    this.assetId = asset.id;
    this.minDuration = Math.min(durationLowerBound, Number(activeRegionLength));
    this.maxDuration = Math.min(durationUpperBound, Number(activeRegionLength));
    this.duration = (0, _utils.random)(this.minDuration, this.maxDuration);
    var latestStart = Number(activeRegionUpperBound) - this.duration;
    this.start = (0, _utils.random)(activeRegionLowerBound, latestStart);
    this.fadeInDuration = Math.min(randomFadeInDuration, this.duration / 2);
    this.fadeOutDuration = Math.min(randomFadeOutDuration, this.duration / 2) * Number(fadeOutMultiplier);
    this.startFadingOutSecs = this.duration - this.fadeInDuration - this.fadeOutDuration;
  }

  _createClass(AssetEnvelope, [{
    key: "toString",
    value: function toString() {
      var assetId = this.asset.id;
      return "AssetEnvelope #".concat(assetId);
    }
  }]);

  return AssetEnvelope;
}();

exports.AssetEnvelope = AssetEnvelope;