"use strict";

require("core-js/modules/es.array.slice.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Session = void 0;

require("regenerator-runtime/runtime.js");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var clientSystem = "Unknown";
var projectId, sessionId, geoListenEnabled;
var apiClient;
/** Responsible for establishing a session with the Roundware server **/

var Session = /*#__PURE__*/function () {
  /** Create a new Session
   * @param {object} navigator - provides access to the userAgent string
   * @param {Number} newProjectId - identifies the Roundware project to associate with this session
   * @param {Boolean} geoListenEnablement - whether the server should enable geo listening features
   * @param {Object} options - Various configuration parameters for this session
   * @param {apiClient} options.apiClient - the API client object to use for server API calls
   **/
  function Session(navigator, newProjectId, geoListenEnablement, options) {
    _classCallCheck(this, Session);

    clientSystem = navigator.userAgent;

    if (clientSystem.length > 127) {
      // on mobile browsers, this string is longer than the server wants
      clientSystem = clientSystem.slice(0, 127);
    }

    projectId = newProjectId;
    geoListenEnabled = geoListenEnablement;
    apiClient = options.apiClient;
  }
  /** @returns {String} human-readable representation of this session **/


  _createClass(Session, [{
    key: "toString",
    value: function toString() {
      return "Roundware Session #" + sessionId;
    }
    /** Make an asynchronous API call to establish a session with the Roundware server
     * @return {Promise} represents the pending API call
     **/

  }, {
    key: "connect",
    value: function () {
      var _connect = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var requestData, data;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                requestData = {
                  project_id: projectId,
                  geo_listen_enabled: geoListenEnabled,
                  client_system: clientSystem
                };
                _context.next = 3;
                return apiClient.post("/sessions/", requestData);

              case 3:
                data = _context.sent;
                this.sessionId = data.id;
                return _context.abrupt("return", this.sessionId);

              case 6:
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
  }]);

  return Session;
}();

exports.Session = Session;