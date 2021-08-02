"use strict";

require("core-js/modules/es.array.concat.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.promise.js");

require("core-js/modules/es.regexp.to-string.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Envelope = void 0;

require("regenerator-runtime/runtime.js");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Envelope = /*#__PURE__*/function () {
  /** Create an Envelope
   * @param {number} sessionId - identifies the session associated with this asset
   * @param {ApiClient} apiClient - the API client object to use for server API calls
   * @param {geoPosition} geoPosition -
   * @param  {Roundware} roundware - roundware object
   **/
  function Envelope(sessionId, apiClient, geoPosition, roundware) {
    _classCallCheck(this, Envelope);

    this._envelopeId = "(unknown)";
    this._sessionId = sessionId;
    this._apiClient = apiClient;
    this._geoPosition = geoPosition;
    this._roundware = roundware;
  }
  /** @returns {String} human-readable representation of this asset **/


  _createClass(Envelope, [{
    key: "toString",
    value: function toString() {
      return "Envelope ".concat(this._assetId);
    }
    /** Create a new Envelope in the server to which we can attach audio recordings as assets
     * @returns {Promise} represents the pending API call **/

  }, {
    key: "connect",
    value: function () {
      var _connect = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var _this = this;

        var data;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                data = {
                  session_id: this._sessionId
                };
                return _context.abrupt("return", this._apiClient.post("/envelopes/", data).then(function (data) {
                  _this._envelopeId = data.id;
                }));

              case 2:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function connect() {
        return _connect.apply(this, arguments);
      }

      return connect;
    }()
    /** Sends an audio file to the server
     * @param {blob} audioData
     * @param {string} fileName - name of the file
     * @return {Promise} - represents the API call */

  }, {
    key: "upload",
    value: function () {
      var _upload = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(audioData, fileName) {
        var data,
            formData,
            coordinates,
            path,
            options,
            res,
            _args2 = arguments;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                data = _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : {};

                if (this._envelopeId) {
                  _context2.next = 3;
                  break;
                }

                return _context2.abrupt("return", Promise.reject("cannot upload audio without first connecting this envelope to the server"));

              case 3:
                formData = new FormData();
                coordinates = {};

                if (!data.latitude && !data.longitude) {
                  coordinates = this._geoPosition.getLastCoords();
                } else {
                  coordinates = {
                    latitude: data.latitude,
                    longitude: data.longitude
                  };
                }

                console.log(coordinates);
                formData.append("session_id", this._sessionId.toString());
                formData.append("file", audioData);
                formData.append("latitude", coordinates.latitude.toString());
                formData.append("longitude", coordinates.longitude.toString());

                if (data.tag_ids) {
                  formData.append("tag_ids", data.tag_ids);
                }

                if (data.media_type) {
                  formData.append("media_type", data.media_type);
                }

                path = "/envelopes/".concat(this._envelopeId, "/");
                console.info("Uploading ".concat(fileName, " to envelope ").concat(path));
                options = {
                  contentType: "multipart/form-data"
                };
                _context2.next = 18;
                return this._apiClient.patch(path, formData, options);

              case 18:
                res = _context2.sent;
                console.info("UPLOADDATA", res);

                if (!res.detail) {
                  _context2.next = 24;
                  break;
                }

                throw new Error(res.detail);

              case 24:
                _context2.next = 26;
                return this._roundware.updateAssetPool();

              case 26:
                return _context2.abrupt("return", res);

              case 27:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function upload(_x, _x2) {
        return _upload.apply(this, arguments);
      }

      return upload;
    }()
  }]);

  return Envelope;
}();

exports.Envelope = Envelope;