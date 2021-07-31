"use strict";

require("core-js/modules/es.array.iterator.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.promise.js");

require("core-js/modules/es.regexp.exec.js");

require("core-js/modules/es.regexp.to-string.js");

require("core-js/modules/es.string.iterator.js");

require("core-js/modules/es.string.search.js");

require("core-js/modules/web.dom-collections.iterator.js");

require("core-js/modules/web.url.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ApiClient = void 0;

require("regenerator-runtime/runtime.js");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var GENERIC_ERROR_MSG = "We were unable to contact the audio server, please try again."; // Handles HTTP interactions with the Roundware API server, v2.
// NOTE: Every HTTP method except ".get()" will cause most browsers to issue a preflight requirements check to the server via the OPTIONS verb,
// to verify CORS will allow the response to load in the browser. Sometimes this OPTIONS call can get obscured in debugging tools.
// @see http://roundware.org/docs/terminology/index.html

var ApiClient = /*#__PURE__*/function () {
  /** Create a new ApiClient
   * @param {String} baseServerUrl - identifies the Roundware server to receive API requests
   * @param {Boolean} [options.fetch = fetch] - for testing purposes, you can inject the fetch mechanism to use for making network requests **/
  function ApiClient(window, baseServerUrl) {
    _classCallCheck(this, ApiClient);

    //@ts-ignore
    this._jQuery = window.jQuery;
    this._serverUrl = baseServerUrl;
    this._authToken = "";
  }
  /** Make a GET request to the Roundware server
   * @param {String} path - the path for your API request, such as "/streams/"
   * @param {Object} options - see the "send" method
   * @see {send} **/


  _createClass(ApiClient, [{
    key: "get",
    value: function () {
      var _get = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(path, data) {
        var options,
            _args = arguments;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                options = _args.length > 2 && _args[2] !== undefined ? _args[2] : {};
                options.method = "GET";
                options.contentType = "x-www-form-urlencoded";
                _context.next = 5;
                return this.send(path, data, options);

              case 5:
                return _context.abrupt("return", _context.sent);

              case 6:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function get(_x, _x2) {
        return _get.apply(this, arguments);
      }

      return get;
    }()
    /** Make a POST request to the Roundware server
     * @param {String} path - the path for your API request, such as "/streams/"
     * @param {Object} options - see the "send" method
     * @see {send} **/

  }, {
    key: "post",
    value: function () {
      var _post = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(path, data) {
        var options,
            _args2 = arguments;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                options = _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : {};
                options.method = "POST";
                _context2.next = 4;
                return this.send(path, data, options);

              case 4:
                return _context2.abrupt("return", _context2.sent);

              case 5:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function post(_x3, _x4) {
        return _post.apply(this, arguments);
      }

      return post;
    }()
    /** Make a PATCH request to the Roundware server
     * @param {String} path - the path for your API request, such as "/streams/"
     * @param {Object} options - see the "send" method
     * @see {send} **/

  }, {
    key: "patch",
    value: function () {
      var _patch = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(path, data) {
        var options,
            _args3 = arguments;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                options = _args3.length > 2 && _args3[2] !== undefined ? _args3[2] : {};
                options.method = "PATCH";
                _context3.next = 4;
                return this.send(path, data, options);

              case 4:
                return _context3.abrupt("return", _context3.sent);

              case 5:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function patch(_x5, _x6) {
        return _patch.apply(this, arguments);
      }

      return patch;
    }()
    /** Transmit an Ajax request to the Roundware API. Note that the Roundware Server expects paths to end with a trailing slash: /sessions/ instead of /sessions
     * @param path {string} - identifies the endpoint to receive the request
     * @param data {object} - the payload to send
     * @param urlOptions {object} - any additional options to add to the URL
     * @return {Promise} - will resolve or reject depending on the status of the request
     * @todo might be a good place to implement exponential retry of certain types of errors
     * @todo as of 2019, the fetch() polyfills are good enough that we should be able to get rid of JQuery dependency
     * **/

  }, {
    key: "send",
    value: function () {
      var _send = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(path) {
        var data,
            urlOptions,
            url,
            contentType,
            method,
            requestInit,
            queryParams,
            _key,
            headers,
            _key2,
            stringData,
            response,
            json,
            _args4 = arguments;

        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                data = _args4.length > 1 && _args4[1] !== undefined ? _args4[1] : {};
                urlOptions = _args4.length > 2 ? _args4[2] : undefined;
                url = new URL(this._serverUrl + path);
                contentType = urlOptions.contentType, method = urlOptions.method;
                requestInit = {
                  method: method,
                  mode: "cors",
                  body: "",
                  headers: {}
                };
                queryParams = new URLSearchParams("");

                for (_key in urlOptions) {
                  queryParams.append(_key, urlOptions[_key]);
                }

                headers = {};
                _context4.t0 = method;
                _context4.next = _context4.t0 === "GET" ? 11 : _context4.t0 === "HEAD" ? 11 : 13;
                break;

              case 11:
                for (_key2 in data) {
                  queryParams.append(_key2, data[_key2]);
                }

                return _context4.abrupt("break", 18);

              case 13:
                stringData = "";

                if (!contentType) {
                  // If you don't specify a contentType, we assume you want us to convert your payload to JSON
                  contentType = "application/json";
                  stringData = JSON.stringify(data);
                }

                if (contentType != "multipart/form-data") {
                  headers["Content-Type"] = contentType;
                }

                requestInit.body = stringData;
                return _context4.abrupt("break", 18);

              case 18:
                url.search = queryParams.toString();

                if (this._authToken) {
                  headers["Authorization"] = this._authToken;
                }

                requestInit.headers = headers;
                _context4.prev = 21;
                _context4.next = 24;
                return fetch(url.toString(), requestInit);

              case 24:
                response = _context4.sent;
                _context4.next = 31;
                break;

              case 27:
                _context4.prev = 27;
                _context4.t1 = _context4["catch"](21);
                console.error("Roundware network error:", _context4.t1.message);
                throw GENERIC_ERROR_MSG;

              case 31:
                if (response.ok) {
                  _context4.next = 34;
                  break;
                }

                console.error("Roundware API error, code:", response.status);
                throw GENERIC_ERROR_MSG;

              case 34:
                _context4.prev = 34;
                _context4.next = 37;
                return response.json();

              case 37:
                json = _context4.sent;
                return _context4.abrupt("return", json);

              case 41:
                _context4.prev = 41;
                _context4.t2 = _context4["catch"](34);
                console.error("Unable to decode Roundware response", _context4.t2);
                throw GENERIC_ERROR_MSG;

              case 45:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this, [[21, 27], [34, 41]]);
      }));

      function send(_x7) {
        return _send.apply(this, arguments);
      }

      return send;
    }()
    /** Set the authorization token to use as the header for future API requests. Most Roundware API calls require an auth token to be set.
     * @param {String} authToken - characters to use in the authorization header **/

  }, {
    key: "authToken",
    set: function set(tokenStr) {
      this._authToken = "token ".concat(tokenStr);
    }
  }]);

  return ApiClient;
}();

exports.ApiClient = ApiClient;