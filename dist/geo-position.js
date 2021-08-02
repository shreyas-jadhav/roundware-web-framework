"use strict";

require("core-js/modules/es.array.concat.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.promise.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GeoPosition = void 0;

var _shims = require("./shims");

var _mixer = require("./mixer");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var initialGeoTimeoutSeconds = 5;
var frameworkDefaultCoords = {
  latitude: 42.3140089,
  longitude: -71.2504676
}; // Boston, MA
// for an initial rapid, low-accuracy position

var fastGeolocationPositionOptions = {
  enableHighAccuracy: false,
  timeout: initialGeoTimeoutSeconds,
  maximumAge: Infinity
}; // subsequent position monitoring should be high-accuracy

var accurateGeolocationPositionOptions = {
  enableHighAccuracy: true,
  timeout: Infinity,
  maximumAge: 0
};
/** Responsible for tracking the user's position, when geo listening is enabled and the browser is capable
 * @property {Boolean} isEnabled - whether or not the geo positioning system is enabled and available
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/Using_geolocation **/

var GeoPosition = /*#__PURE__*/function () {
  /** Create a new GeoPosition.
   * @param {Window[`navigator`]} navigator - provides access to geolocation system
   * @param {Object} options - parameters for initializing this GeoPosition
   * @param {Boolean} [options.geoListenMode = GeoListenMode.DISABLED] - whether or not to attempt to use geolocation
   * @param {Boolean} [options.defaultCoords] */
  function GeoPosition(navigator, options) {
    _classCallCheck(this, GeoPosition);

    this._navigator = navigator;
    var defaultCoords = options.defaultCoords,
        geoListenMode = options.geoListenMode;
    var initialCoords = defaultCoords ? defaultCoords : frameworkDefaultCoords;
    this._initialGeolocationPromise = Promise.resolve(initialCoords);
    this.defaultCoords = initialCoords;
    this._lastCoords = initialCoords;
    this.geolocation = navigator.geolocation;
    this.isEnabled = navigator.geolocation && geoListenMode === _mixer.GeoListenMode.AUTOMATIC;

    this.updateCallback = function () {};

    this._geoWatchID = null; //console.info({ defaultCoords: this.defaultCoords });
  }

  _createClass(GeoPosition, [{
    key: "disable",
    value: function disable() {
      this.isEnabled = false;

      if (this._geoWatchID) {
        console.log("Canceling geoposition watch", this._geoWatchID);
        this.geolocation.clearWatch(this._geoWatchID);
        delete this._geoWatchID;
      }
    }
    /** @return {String} Human-readable representation of this GeoPosition **/

  }, {
    key: "toString",
    value: function toString() {
      return "GeoPosition (enabled: ".concat(this.isEnabled, ")");
    }
    /** @return {Object} coordinates - last known coordinates received from the geolocation system (defaults to latitude 1, longitude 1) **/

  }, {
    key: "getLastCoords",
    value: function getLastCoords() {
      return this._lastCoords;
    }
    /**
     * @param  {CallableFunction} geoUpdateCallback
     */

  }, {
    key: "connect",
    value: function connect(geoUpdateCallback) {
      this.updateCallback = geoUpdateCallback; // Ensure that geolocation is started if it was enabled from instantiation.

      if (this.isEnabled) {
        this.enable();
      }
    }
    /** Attempts to get an initial rough geographic location for the listener, then sets up a callback
     * to update the position.
     * @param {Function} geoUpdateCallback - object that should receive geolocation coordinate updates
     * @see isEnabled **/

  }, {
    key: "enable",
    value: function enable() {
      var _this = this;

      if (this.isEnabled && this._geoWatchID) {
        return;
      }

      var defaultCoords = this.defaultCoords,
          geolocation = this._navigator.geolocation;
      this.isEnabled = true;

      _shims.logger.log("Initializing geolocation system");

      this._initialGeolocationPromise = new Promise(function (resolve) {
        geolocation.getCurrentPosition(function (initialPosition) {
          var coords = initialPosition.coords;
          _this._lastCoords = coords;

          _shims.logger.info("Received initial geolocation:", coords);

          _this.updateCallback(coords);

          resolve(coords);
        }, function (error) {
          _shims.logger.warn("Unable to get initial geolocation: ".concat(error.message, " (code #").concat(error.code, "), falling back to default coordinates for initial listener location"));

          resolve(defaultCoords);
        }, fastGeolocationPositionOptions);
      });
      this._geoWatchID = geolocation.watchPosition(function (updatedPosition) {
        var coords = updatedPosition.coords;
        _this._lastCoords = coords;

        _shims.logger.info("Received updated geolocation:", coords);

        _this.updateCallback(coords);
      }, function (error) {
        return _shims.logger.warn("Unable to watch geoposition changes: ".concat(error.message, " (code #").concat(error.code, ")"));
      }, accurateGeolocationPositionOptions);
    }
    /** Allows you to wait on the progress of the .connect() behavior, attempting to get an initial
     * estimate of the user's position. Note that this promise will never fail - if we cannot get an
     * accurate estimate, we fall back to default coordinates (currently latitude 1, longitude 1)
     * @return {Promise} Represents the attempt to get an initial estimate of the user's position **/

  }, {
    key: "waitForInitialGeolocation",
    value: function waitForInitialGeolocation() {
      return this._initialGeolocationPromise;
    }
  }]);

  return GeoPosition;
}();

exports.GeoPosition = GeoPosition;