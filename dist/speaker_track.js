"use strict";

require("core-js/modules/es.array.concat.js");

require("core-js/modules/es.array.iterator.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.promise.js");

require("core-js/modules/es.string.iterator.js");

require("core-js/modules/web.dom-collections.iterator.js");

require("core-js/modules/web.url.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SpeakerTrack = void 0;

require("regenerator-runtime/runtime.js");

var _booleanPointInPolygon = _interopRequireDefault(require("@turf/boolean-point-in-polygon"));

var _pointToLineDistance = _interopRequireDefault(require("@turf/point-to-line-distance"));

var _lineToPolygon = _interopRequireDefault(require("@turf/line-to-polygon"));

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var convertLinesToPolygon = function convertLinesToPolygon(shape) {
  return (0, _lineToPolygon.default)(shape);
};

var FADE_DURATION_SECONDS = 3;
var NEARLY_ZERO = 0.001;
/** A Roundware speaker under the control of the client-side mixer, representing 'A polygonal geographic zone within which an ambient audio stream broadcasts continuously to listeners.
 * Speakers can overlap, causing their audio to be mixed together accordingly.  Volume attenuation happens linearly over a specified distance from the edge of the Speaker’s defined zone.'
 * (quoted from https://github.com/loafofpiecrust/roundware-ios-framework-v2/blob/client-mixing/RWFramework/RWFramework/Playlist/Speaker.swift)
 * */

var SpeakerTrack = /*#__PURE__*/function () {
  function SpeakerTrack(_ref) {
    var audioContext = _ref.audioContext,
        listenerPoint = _ref.listenerPoint,
        prefetchAudio = _ref.prefetchAudio,
        data = _ref.data;

    _classCallCheck(this, SpeakerTrack);

    var speakerId = data.id,
        maxVolume = data.maxvolume,
        minVolume = data.minvolume,
        attenuation_border = data.attenuation_border,
        boundary = data.boundary,
        attenuationDistance = data.attenuation_distance,
        uri = data.uri;
    this.prefetch = prefetchAudio;
    this.audioContext = audioContext;
    this.speakerId = speakerId;
    this.maxVolume = maxVolume;
    this.minVolume = minVolume;
    this.attenuationDistanceKm = attenuationDistance / 1000;
    this.uri = uri;
    this.listenerPoint = listenerPoint;
    this.playing = false;
    this.attenuationBorderPolygon = convertLinesToPolygon(attenuation_border);
    this.attenuationBorderLineString = attenuation_border;
    this.outerBoundary = convertLinesToPolygon(boundary);
    this.currentVolume = NEARLY_ZERO;
  }

  _createClass(SpeakerTrack, [{
    key: "outerBoundaryContains",
    value: function outerBoundaryContains(point) {
      // @ts-ignore
      return (0, _booleanPointInPolygon.default)(point, this.outerBoundary);
    }
  }, {
    key: "attenuationShapeContains",
    value: function attenuationShapeContains(point) {
      // @ts-ignore
      return (0, _booleanPointInPolygon.default)(point, this.attenuationBorderPolygon);
    }
  }, {
    key: "attenuationRatio",
    value: function attenuationRatio(atPoint) {
      var distToInnerShapeKm = (0, _pointToLineDistance.default)(atPoint, this.attenuationBorderLineString, {
        units: "kilometers"
      });
      var ratio = 1 - distToInnerShapeKm / this.attenuationDistanceKm;
      return ratio;
    }
  }, {
    key: "calculateVolume",
    value: function calculateVolume() {
      var listenerPoint = this.listenerPoint;

      if (!listenerPoint) {
        return this.currentVolume;
      } else if (this.attenuationShapeContains(listenerPoint)) {
        return this.maxVolume;
      } else if (this.outerBoundaryContains(listenerPoint)) {
        var range = this.maxVolume - this.minVolume;
        var volumeGradient = this.minVolume + range * this.attenuationRatio(listenerPoint);
        return volumeGradient;
      } else {
        return this.minVolume;
      }
    } // @see https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/createGain

  }, {
    key: "buildAudio",
    value: function () {
      var _buildAudio = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var audioContext, uri, cleanURL, audio, response, blob, audioSrc, gainNode;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!this.audio) {
                  _context.next = 2;
                  break;
                }

                return _context.abrupt("return", this.audio);

              case 2:
                audioContext = this.audioContext, uri = this.uri;
                cleanURL = (0, _utils.cleanAudioURL)(uri);

                if (!this.prefetch) {
                  _context.next = 14;
                  break;
                }

                _context.next = 7;
                return fetch(cleanURL);

              case 7:
                response = _context.sent;
                _context.next = 10;
                return response.blob();

              case 10:
                blob = _context.sent;
                audio = new Audio(URL.createObjectURL(blob));
                _context.next = 15;
                break;

              case 14:
                audio = new Audio(cleanURL);

              case 15:
                audio.crossOrigin = "anonymous";
                audio.loop = true;
                audioSrc = audioContext.createMediaElementSource(audio);
                gainNode = audioContext.createGain();
                audioSrc.connect(gainNode);
                gainNode.connect(audioContext.destination);
                this.gainNode = gainNode;
                this.audio = audio;
                this.audioContext = audioContext;
                return _context.abrupt("return", this.audio);

              case 25:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function buildAudio() {
        return _buildAudio.apply(this, arguments);
      }

      return buildAudio;
    }()
  }, {
    key: "updateParams",
    value: function () {
      var _updateParams = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(isPlaying, opts) {
        var newVolume;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (opts && opts.listenerPoint) {
                  this.listenerPoint = opts.listenerPoint.geometry;
                }

                _context2.next = 3;
                return this.updateVolume();

              case 3:
                newVolume = _context2.sent;

                if (this.audio) {
                  _context2.next = 6;
                  break;
                }

                throw new Error("Audio is undefined! use buildAudio()");

              case 6:
                if (!(isPlaying != this.playing)) {
                  _context2.next = 13;
                  break;
                }

                if (!(newVolume < 0.05)) {
                  _context2.next = 11;
                  break;
                }

                this.audio.pause();
                _context2.next = 13;
                break;

              case 11:
                _context2.next = 13;
                return this.audio.play();

              case 13:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function updateParams(_x, _x2) {
        return _updateParams.apply(this, arguments);
      }

      return updateParams;
    }()
  }, {
    key: "updateVolume",
    value: function () {
      var _updateVolume = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
        var newVolume, secondsFromNow;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                newVolume = this.calculateVolume();
                this.currentVolume = newVolume;
                secondsFromNow = this.audioContext.currentTime + FADE_DURATION_SECONDS;
                _context3.next = 5;
                return this.buildAudio();

              case 5:
                if (this.gainNode) this.gainNode.gain.linearRampToValueAtTime(newVolume, secondsFromNow); //console.info(`Setting '${this}' volume: ${newVolume.toFixed(2)} over ${FADE_DURATION_SECONDS} seconds`);

                return _context3.abrupt("return", newVolume);

              case 7:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function updateVolume() {
        return _updateVolume.apply(this, arguments);
      }

      return updateVolume;
    }()
  }, {
    key: "play",
    value: function () {
      var _play = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
        var newVolume;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return this.updateVolume();

              case 2:
                newVolume = _context4.sent;

                if (!(newVolume < 0.05)) {
                  _context4.next = 5;
                  break;
                }

                return _context4.abrupt("return");

              case 5:
                _context4.prev = 5;

                if (this.audio) {
                  _context4.next = 8;
                  break;
                }

                throw new Error("Audio is undefined! Please use buildAudio()");

              case 8:
                _context4.next = 10;
                return this.audio.play();

              case 10:
                this.playing = true;
                _context4.next = 16;
                break;

              case 13:
                _context4.prev = 13;
                _context4.t0 = _context4["catch"](5);
                console.error("Unable to play", this.logline, _context4.t0);

              case 16:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this, [[5, 13]]);
      }));

      function play() {
        return _play.apply(this, arguments);
      }

      return play;
    }()
  }, {
    key: "pause",
    value: function () {
      var _pause = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                if (this.playing) {
                  _context5.next = 2;
                  break;
                }

                return _context5.abrupt("return");

              case 2:
                _context5.prev = 2;

                if (this.audio) {
                  _context5.next = 5;
                  break;
                }

                throw new Error("Audio is undefined! Please use buildAudio()");

              case 5:
                this.audio.pause();
                this.playing = false;
                _context5.next = 12;
                break;

              case 9:
                _context5.prev = 9;
                _context5.t0 = _context5["catch"](2);
                console.error("Unable to pause", this.logline, _context5.t0);

              case 12:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this, [[2, 9]]);
      }));

      function pause() {
        return _pause.apply(this, arguments);
      }

      return pause;
    }()
  }, {
    key: "toString",
    value: function toString() {
      var speakerId = this.speakerId;
      return "SpeakerTrack (".concat(speakerId, ")");
    }
  }, {
    key: "logline",
    get: function get() {
      return "".concat(this, " (").concat(this.uri, ")");
    }
  }]);

  return SpeakerTrack;
}();

exports.SpeakerTrack = SpeakerTrack;