"use strict";

require("core-js/modules/es.array.concat.js");

require("core-js/modules/es.function.name.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Project = void 0;

require("regenerator-runtime/runtime.js");

var _mixer = require("./mixer");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Project = /*#__PURE__*/function () {
  function Project(newProjectId, _ref) {
    var apiClient = _ref.apiClient;

    _classCallCheck(this, Project);

    _defineProperty(this, "location", {
      latitude: 1,
      longitude: 1
    });

    this.projectId = newProjectId;
    this.projectName = "(unknown)";
    this.apiClient = apiClient;
    this.mixParams = {};
  }

  _createClass(Project, [{
    key: "toString",
    value: function toString() {
      return "Roundware Project '".concat(this.projectName, "' (#").concat(this.projectId, ")");
    }
    /**
     * @param  {number} sessionId
     * @returns {Promise} sessionId | undefined
     */

  }, {
    key: "connect",
    value: function () {
      var _connect = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(sessionId) {
        var path, requestData, data;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                path = "/projects/" + this.projectId + "/";
                requestData = {
                  session_id: sessionId
                };
                _context.prev = 2;
                _context.next = 5;
                return this.apiClient.get(path, requestData);

              case 5:
                data = _context.sent;
                //console.info({ PROJECTDATA: data });
                this.projectName = data.name;
                this.legalAgreement = data.legal_agreement;
                this.recordingRadius = data.recording_radius;
                this.maxRecordingLength = data.max_recording_length;
                this.location = {
                  latitude: data.latitude,
                  longitude: data.longitude
                };
                this.mixParams = _objectSpread({
                  geoListenMode: data.geo_listen_enabled ? _mixer.GeoListenMode.MANUAL : _mixer.GeoListenMode.DISABLED,
                  recordingRadius: data.recording_radius,
                  ordering: data.ordering
                }, this.mixParams);
                return _context.abrupt("return", sessionId);

              case 15:
                _context.prev = 15;
                _context.t0 = _context["catch"](2);
                console.error("Unable to get Project details", _context.t0);

              case 18:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[2, 15]]);
      }));

      function connect(_x) {
        return _connect.apply(this, arguments);
      }

      return connect;
    }()
    /**
     * @param  {number} sessionId
     * @returns Promise<IUiConfig>
     */

  }, {
    key: "uiconfig",
    value: function () {
      var _uiconfig = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(sessionId) {
        var path, data;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                path = "/projects/" + this.projectId + "/uiconfig/";
                data = {
                  session_id: sessionId
                };
                _context2.next = 4;
                return this.apiClient.get(path, data);

              case 4:
                return _context2.abrupt("return", _context2.sent);

              case 5:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function uiconfig(_x2) {
        return _uiconfig.apply(this, arguments);
      }

      return uiconfig;
    }()
  }]);

  return Project;
}();

exports.Project = Project;