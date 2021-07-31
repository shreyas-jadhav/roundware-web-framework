"use strict";

require("core-js/modules/es.array.for-each.js");

require("core-js/modules/es.array.iterator.js");

require("core-js/modules/es.array.join.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.regexp.constructor.js");

require("core-js/modules/es.regexp.exec.js");

require("core-js/modules/es.regexp.to-string.js");

require("core-js/modules/es.string.iterator.js");

require("core-js/modules/es.string.pad-start.js");

require("core-js/modules/es.string.replace.js");

require("core-js/modules/es.string.search.js");

require("core-js/modules/web.dom-collections.iterator.js");

require("core-js/modules/web.url.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.coordsToPoints = coordsToPoints;
exports.buildAudioContext = buildAudioContext;
exports.NO_OP = exports.getUrlParam = exports.timestamp = exports.randomInt = exports.random = exports.hasOwnProperty = exports.isEmpty = exports.cleanAudioURL = void 0;

var _standardizedAudioContext = require("standardized-audio-context");

/* global require */
var _require = require("@turf/helpers"),
    point = _require.point;

var MATCHES_URI_SCHEME = new RegExp(/^https?:\/\//i);
var MATCHES_WAV_FILE = new RegExp(/\.wav$/i);
/**
 * @param  {string} url
 * @returns Cleaned URL
 */

var cleanAudioURL = function cleanAudioURL(url) {
  return url.replace(MATCHES_URI_SCHEME, "//").replace(MATCHES_WAV_FILE, ".mp3");
};
/**
 * @param  {number} {latitude
 * @param  {number} longitude
 * @returns Point
 */


exports.cleanAudioURL = cleanAudioURL;

function coordsToPoints(_ref) {
  var latitude = _ref.latitude,
      longitude = _ref.longitude;
  // NOTE we need to reverse the order here to make geolocations compatible with Roundware geometries, which have points listed w/ longitude first
  return point([+longitude, +latitude]); // NOTE we need to reverse the order here to make geolocations compatible with Roundware geometries, which have points listed w/ longitude first
} // @see https://stackoverflow.com/a/24403771/308448


var isEmpty = function isEmpty(array) {
  return !array || array.length < 1;
}; // @see https://eslint.org/docs/rules/no-prototype-builtins


exports.isEmpty = isEmpty;

var hasOwnProperty = function hasOwnProperty(target, propName) {
  return Object.prototype.hasOwnProperty.call(target, propName);
}; // @see https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_minby-and-_maxby //const makeSelect = (comparator) => (a,b) => comparator(a,b) ? a : b;
//export const minValue = makeSelect((a,b) => a <= b);
//const minByValue = makeSelect((a, b) => a.value <= b.value)
//const maxByValue = makeSelect((a, b) => a.value >= b.value)
// @see https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_random


exports.hasOwnProperty = hasOwnProperty;

var random = function random() {
  var a = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
  var b = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var lower = Math.min(a, b);
  var upper = Math.max(a, b);
  return lower + Math.random() * (upper - lower);
};

exports.random = random;

var randomInt = function randomInt() {
  var a = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
  var b = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var lower = Math.ceil(Math.min(a, b));
  var upper = Math.floor(Math.max(a, b));
  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

exports.randomInt = randomInt;
var UNLOCK_AUDIO_EVENTS = ["touchstart", "touchend", "mousedown", "keydown"];
/** Helps stabilize WebAudio startup
 @thanks https://www.mattmontag.com/web/unlock-web-audio-in-safari-for-ios-and-macos */

function unlockAudioContext(body, audioCtx) {
  if (audioCtx.state !== "suspended") return;

  function unlock() {
    audioCtx.resume().then(clean);
  }

  function clean() {
    UNLOCK_AUDIO_EVENTS.forEach(function (e) {
      return body.removeEventListener(e, unlock);
    });
  }

  UNLOCK_AUDIO_EVENTS.forEach(function (e) {
    return body.addEventListener(e, unlock, false);
  });
}

function buildAudioContext(windowScope) {
  var audioContext = new _standardizedAudioContext.AudioContext();
  var body = windowScope.document.body;
  unlockAudioContext(body, audioContext);
  return audioContext;
}

var timestamp = {
  toString: function toString() {
    var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Date();
    var hour = time.getHours().toString().padStart(2, "0");
    var mins = time.getMinutes().toString().padStart(2, "0");
    var secs = time.getSeconds().toString().padStart(2, "0");
    return [hour, mins, secs].join(":");
  }
};
exports.timestamp = timestamp;

var getUrlParam = function getUrlParam(urlStr, paramName) {
  var url = new URL(urlStr);
  var params = new URLSearchParams(url.search);
  return params.get(paramName);
};

exports.getUrlParam = getUrlParam;

var NO_OP = function NO_OP() {};

exports.NO_OP = NO_OP;