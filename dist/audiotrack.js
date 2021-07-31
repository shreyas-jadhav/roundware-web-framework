"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Audiotrack = void 0;

require("regenerator-runtime/runtime.js");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/* This is what audiotracks data looks like:
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
*/
var REQUEST_PATH = "/audiotracks/";

var Audiotrack = /*#__PURE__*/function () {
  function Audiotrack(projectId, options) {
    _classCallCheck(this, Audiotrack);

    this._projectId = projectId;
    this._apiClient = options.apiClient;
  }

  _createClass(Audiotrack, [{
    key: "toString",
    value: function toString() {
      return "Roundware Audiotracks (#".concat(this._projectId, ")");
    }
  }, {
    key: "connect",
    value: function () {
      var _connect = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var data,
            _args = arguments;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                data = _args.length > 0 && _args[0] !== undefined ? _args[0] : {};
                data.project_id = this._projectId;
                data.active = true;
                _context.next = 5;
                return this._apiClient.get(REQUEST_PATH, data);

              case 5:
                return _context.abrupt("return", _context.sent);

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

  return Audiotrack;
}();

exports.Audiotrack = Audiotrack;