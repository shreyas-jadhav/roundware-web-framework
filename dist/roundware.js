"use strict";

require("core-js/modules/es.array.concat.js");

require("core-js/modules/es.array.filter.js");

require("core-js/modules/es.array.iterator.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.promise.js");

require("core-js/modules/es.string.iterator.js");

require("core-js/modules/web.dom-collections.iterator.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  Roundware: true,
  GeoListenMode: true
};
Object.defineProperty(exports, "GeoListenMode", {
  enumerable: true,
  get: function get() {
    return _mixer.GeoListenMode;
  }
});
exports.Roundware = void 0;

require("regenerator-runtime/runtime.js");

var _project = require("./project");

var _session = require("./session");

var _speaker = require("./speaker");

var _geoPosition = require("./geo-position");

var _asset = require("./asset");

var _timed_asset = require("./timed_asset");

var _shims = require("./shims");

var _apiClient = require("./api-client");

var _user = require("./user");

var _envelope = require("./envelope");

var _mixer = require("./mixer");

var _audiotrack = require("./audiotrack");

var _assetFilters = require("./assetFilters");

Object.keys(_assetFilters).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _assetFilters[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _assetFilters[key];
    }
  });
});

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/** This class is the primary integration point between Roundware's server and your application

   @example
   var roundwareServerUrl = "http://localhost:8888/api/2";
   var roundwareProjectId = 1;

   var roundware = new Roundware(window,{
     serverUrl: roundwareServerUrl,
     projectId: roundwareProjectId
   });

   function ready() {
     console.info("Connected to Roundware Server. Ready to play.");
     // this is a good place to initialize audio player controls, etc.
   }

   // Generally we throw user-friendly messages and log a more technical message
   function handleError(userErrMsg) {
     console.error("Roundware Error: " + userErrMsg);
   }

  roundware.connect().
    then(ready).
    catch(handleError);

  function startListening(streamURL) {
    console.info("Loading " + streamURL);
    // good place to connect your audio player to the audio stream
  }

  roundware.play(startListening).catch(handleError);
**/
var Roundware = /*#__PURE__*/function () {
  /** Initialize a new Roundware instance
   * @param {Object} windowScope - representing the context in which we are executing - provides references to window.navigator, window.console, etc.
   * @param {Object} options - Collection of parameters for configuring this Roundware instance
   * @param {String} options.serverUrl - identifies the Roundware server
   * @param {Number} options.projectId - identifies the Roundware project to connect
   * @param {Boolean} options.geoListenMode - whether or not to attempt to initialize geolocation-based listening
   * @throws Will throw an error if serveUrl or projectId are missing
    TODO need to provide a more modern/ES6-aware architecture here vs burdening the constructor with all of these details **/
  function Roundware(windowScope, _ref) {
    var serverUrl = _ref.serverUrl,
        projectId = _ref.projectId,
        speakerFilters = _ref.speakerFilters,
        assetFilters = _ref.assetFilters,
        listenerLocation = _ref.listenerLocation,
        user = _ref.user,
        geoPosition = _ref.geoPosition,
        session = _ref.session,
        project = _ref.project,
        speaker = _ref.speaker,
        asset = _ref.asset,
        timedAsset = _ref.timedAsset,
        audiotrack = _ref.audiotrack,
        assetUpdateInterval = _ref.assetUpdateInterval,
        prefetchSpeakerAudio = _ref.prefetchSpeakerAudio,
        options = _objectWithoutProperties(_ref, ["serverUrl", "projectId", "speakerFilters", "assetFilters", "listenerLocation", "user", "geoPosition", "session", "project", "speaker", "asset", "timedAsset", "audiotrack", "assetUpdateInterval", "prefetchSpeakerAudio"]);

    _classCallCheck(this, Roundware);

    _defineProperty(this, "_speakerFilters", {});

    _defineProperty(this, "_initialParams", {});

    _defineProperty(this, "_onUpdateLocation", function () {});

    _defineProperty(this, "_onUpdateAssets", function () {});

    _defineProperty(this, "_assetData", []);

    _defineProperty(this, "_onPlayAssets", function () {});

    _defineProperty(this, "uiConfig", {});

    _defineProperty(this, "_speakerData", []);

    _defineProperty(this, "_audioTracksData", []);

    _defineProperty(this, "_timedAssetData", []);

    this.windowScope = windowScope;
    this._serverUrl = serverUrl;
    this._projectId = projectId;
    if (speakerFilters) this._speakerFilters = speakerFilters;
    this._assetFilters = assetFilters;
    this._listenerLocation = listenerLocation;
    this._initialOptions = options; // By default, update the asset pool every 5 minutes.

    this._assetUpdateInterval = assetUpdateInterval || 300000;

    if (this._serverUrl === undefined) {
      throw "Roundware objects must be initialized with a serverUrl";
    }

    if (this._projectId === undefined) {
      throw "Roundware objects must be initialized with a projectId";
    }

    this._apiClient = new _apiClient.ApiClient(window, this._serverUrl);
    options.apiClient = this._apiClient;
    var navigator = window.navigator; // TODO need to reorganize/refactor these classes

    this._user = user || new _user.User(options);
    this._geoPosition = geoPosition || new _geoPosition.GeoPosition(navigator, {
      geoListenMode: options.geoListenMode,
      defaultCoords: listenerLocation
    });
    this._session = session || new _session.Session(navigator, this._projectId, this._geoPosition.isEnabled, options);
    this._project = project || new _project.Project(this._projectId, options);
    this._speaker = speaker || new _speaker.Speaker(this._projectId, options);
    this._asset = asset || new _asset.Asset(this._projectId, options);
    this._timed_asset = timedAsset || new _timed_asset.TimedAsset(this._projectId, options);
    this._audiotrack = audiotrack || new _audiotrack.Audiotrack(this._projectId, options);
    this.uiConfig = {};

    var mixParams = _objectSpread(_objectSpread({}, this.mixParams), this._initialParams);

    this._mixer = new _mixer.Mixer({
      client: this,
      windowScope: this.windowScope,
      listenerLocation: this._listenerLocation,
      prefetchSpeakerAudio: prefetchSpeakerAudio || false,
      mixParams: mixParams
    });
  }

  _createClass(Roundware, [{
    key: "updateLocation",
    value: function updateLocation(listenerLocation) {
      this._listenerLocation = listenerLocation;

      this._mixer.updateParams({
        listenerLocation: listenerLocation
      });

      if (this._onUpdateLocation) this._onUpdateLocation(listenerLocation);
    }
  }, {
    key: "_triggerOnPlayAssets",
    value: function _triggerOnPlayAssets() {
      if (this._onPlayAssets) {
        this._onPlayAssets(this.currentlyPlayingAssets);
      }
    }
  }, {
    key: "enableGeolocation",
    value: function enableGeolocation(mode) {
      if (mode === _mixer.GeoListenMode.AUTOMATIC) {
        this._geoPosition.enable();
      } else {
        this._geoPosition.disable();
      }

      this._mixer.updateParams({
        geoListenMode: mode
      });
    }
  }, {
    key: "disableGeolocation",
    value: function disableGeolocation() {
      this._geoPosition.disable();

      this._mixer.updateParams({
        geoListenMode: _mixer.GeoListenMode.DISABLED
      });
    }
    /** Initiate a connection to Roundware
     *  @return {Promise} - Can be resolved in order to get the audio stream URL, or rejected to get an error message; see example above **/

  }, {
    key: "connect",
    value: function () {
      var _connect = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var _this = this;

        var sessionId, promises;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                // want to start this process as soon as possible, as it can take a few seconds
                this._geoPosition.connect(function (newLocation) {
                  return _this.updateLocation(newLocation);
                });

                _shims.logger.info("Initializing Roundware for project ID ".concat(this._projectId));

                _context.prev = 2;
                _context.next = 5;
                return this._user.connect();

              case 5:
                _context.next = 7;
                return this._session.connect();

              case 7:
                sessionId = _context.sent;
                this._sessionId = sessionId;
                promises = [this._project.connect(sessionId), this._project.uiconfig(sessionId).then(function (uiConfig) {
                  return _this.uiConfig = uiConfig;
                }), this._speaker.connect(this._speakerFilters).then(function (speakerData) {
                  return _this._speakerData = speakerData;
                }), this._audiotrack.connect().then(function (audioTracksData) {
                  return _this._audioTracksData = audioTracksData;
                })];
                _context.next = 12;
                return Promise.all(promises);

              case 12:
                console.info("Roundware connected");
                return _context.abrupt("return", {
                  uiConfig: this.uiConfig
                });

              case 16:
                _context.prev = 16;
                _context.t0 = _context["catch"](2);
                throw "Sorry, we were unable to connect to Roundware. Please try again.";

              case 19:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[2, 16]]);
      }));

      function connect() {
        return _connect.apply(this, arguments);
      }

      return connect;
    }()
  }, {
    key: "getAssets",
    /// Requests list of assets from the server given some filters.
    value: function () {
      var _getAssets = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(options) {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!(!options && this._assetData)) {
                  _context2.next = 4;
                  break;
                }

                return _context2.abrupt("return", this._assetData);

              case 4:
                _context2.next = 6;
                return this._apiClient.get("/assets/", _objectSpread(_objectSpread({
                  project_id: this._projectId
                }, this._assetFilters), options || {}));

              case 6:
                return _context2.abrupt("return", _context2.sent);

              case 7:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function getAssets(_x) {
        return _getAssets.apply(this, arguments);
      }

      return getAssets;
    }()
  }, {
    key: "getAssetsFromPool",
    /// Returns a reduced asset list by filtering the overall pool.
    /// Example: `getAssetsFromPool(allAssetFilter([distanceRangesFilter(), anyTagsFilter()]))`
    value: function () {
      var _getAssetsFromPool = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(assetFilter) {
        var extraParams,
            pool,
            mixParams,
            _args3 = arguments;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                extraParams = _args3.length > 1 && _args3[1] !== undefined ? _args3[1] : {};
                _context3.next = 3;
                return this.loadAssetPool();

              case 3:
                pool = _context3.sent;
                mixParams = _objectSpread(_objectSpread({}, this.mixParams), extraParams);
                return _context3.abrupt("return", pool.filter(function (a) {
                  return assetFilter(a, mixParams) != _assetFilters.ASSET_PRIORITIES.DISCARD;
                }));

              case 6:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function getAssetsFromPool(_x2) {
        return _getAssetsFromPool.apply(this, arguments);
      }

      return getAssetsFromPool;
    }()
  }, {
    key: "updateAssetPool",
    value: function () {
      var _updateAssetPool = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
        var filters, existingAssets, pool;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                filters = this._assetFilters;
                existingAssets = [];

                if (this._lastAssetUpdate) {
                  filters = _objectSpread(_objectSpread({}, filters), {}, {
                    created__gte: this._lastAssetUpdate.toISOString()
                  });
                  existingAssets = this.assets();
                }

                _context4.t0 = existingAssets;
                _context4.next = 6;
                return this._asset.connect(filters);

              case 6:
                _context4.t1 = _context4.sent;
                this._assetData = _context4.t0.concat.call(_context4.t0, _context4.t1);
                this._lastAssetUpdate = new Date(); // Update the mixer's asset pool, if any.

                pool = this.assetPool;

                if (pool && this._timedAssetData) {
                  pool.updateAssets(this._assetData, this._timedAssetData);
                }

                if (this._onUpdateAssets) {
                  this._onUpdateAssets(this._assetData);
                }

              case 12:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function updateAssetPool() {
        return _updateAssetPool.apply(this, arguments);
      }

      return updateAssetPool;
    }()
  }, {
    key: "loadAssetPool",
    value: function () {
      var _loadAssetPool = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
        var _this2 = this;

        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                if (this._assetData) {
                  _context5.next = 4;
                  break;
                }

                _context5.next = 3;
                return this.updateAssetPool();

              case 3:
                // Setup periodic retrieval of newly uploaded assets.
                this._assetDataTimer = setInterval(function () {
                  return _this2.updateAssetPool();
                }, this._assetUpdateInterval);

              case 4:
                if (this._timedAssetData) {
                  _context5.next = 8;
                  break;
                }

                _context5.next = 7;
                return this._timed_asset.connect();

              case 7:
                this._timedAssetData = _context5.sent;

              case 8:
                return _context5.abrupt("return", this._assetData);

              case 9:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function loadAssetPool() {
        return _loadAssetPool.apply(this, arguments);
      }

      return loadAssetPool;
    }()
  }, {
    key: "activateMixer",
    value: function () {
      var _activateMixer = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
        var activationParams,
            _args6 = arguments;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                activationParams = _args6.length > 0 && _args6[0] !== undefined ? _args6[0] : {};
                _context6.next = 3;
                return this.loadAssetPool();

              case 3:
                this._mixer.updateParams(activationParams);

                return _context6.abrupt("return", this._mixer);

              case 5:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function activateMixer() {
        return _activateMixer.apply(this, arguments);
      }

      return activateMixer;
    }()
    /** Create or resume the audio stream
     * @see Stream.play **/

  }, {
    key: "play",
    value: function play() {
      var firstPlayCallback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};
      return this._geoPosition.waitForInitialGeolocation().then(firstPlayCallback);
    }
    /** Tell Roundware server to pause the audio stream. You should always call this when the local audio player has been paused.
     * @see Stream.pause **/

  }, {
    key: "pause",
    value: function pause() {
      if (this._mixer.playlist) {
        this._mixer.playlist.pause();
      }
    }
    /** Tell Roundware server to kill the audio stream.
     * @see Stream.kill **/

  }, {
    key: "kill",
    value: function kill() {
      if (this._assetDataTimer) {
        clearInterval(this._assetDataTimer);
      }
    }
    /** Tell Roundware server to replay the current asset.
     * @see Stream.replay **/

  }, {
    key: "replay",
    value: function replay() {}
    /** Tell Roundware server to skip the current asset.
     * @see Stream.skip **/

  }, {
    key: "skip",
    value: function skip() {
      if (this._mixer.playlist) {
        this._mixer.playlist.skip();
      }
    }
    /** Update the Roundware stream with new tag IDs
     * @param {string} tagIdStr - comma-separated list of tag IDs to send to the streams API **/

  }, {
    key: "tags",
    value: function tags() {}
    /** Update the Roundware stream with new tag IDs and or geo-position
     * @param {object} data - containing keys latitude, longitude and tagIds **/

  }, {
    key: "update",
    value: function update(data) {
      if (this._mixer.playlist) {
        this._mixer.playlist.updateParams(data);
      } // Object.keys(data).map(e => console.log(`key=${e}  value=${data[e]}`));

    }
  }, {
    key: "speakers",
    value: function speakers() {
      return this._speakerData || [];
    }
  }, {
    key: "assets",
    value: function assets() {
      return this._assetData || [];
    }
  }, {
    key: "timedAssets",
    value: function timedAssets() {
      return this._timedAssetData || [];
    }
  }, {
    key: "audiotracks",
    value: function audiotracks() {
      return this._audioTracksData || [];
    }
    /** Attach new assets to the project
     * @param {Object} audioData - the binary data from a recording to be saved as an asset
     * @param {string} fileName - name of the file
     * @return {promise} - represents the API calls to save an asset; can be tested to find out whether upload was successful
     * @see Envelope.upload */

  }, {
    key: "saveAsset",
    value: function () {
      var _saveAsset = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(audioData, fileName, data) {
        var envelope;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.next = 2;
                return this.makeEnvelope();

              case 2:
                envelope = _context7.sent;
                return _context7.abrupt("return", envelope.upload(audioData, fileName, data));

              case 4:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function saveAsset(_x3, _x4, _x5) {
        return _saveAsset.apply(this, arguments);
      }

      return saveAsset;
    }()
    /** Explicitly make a new envelope that you can attach multiple assets to by
     calling the `Envelope.upload` method. This is the main way to add text,
     photo, and video assets to an envelope. */

  }, {
    key: "makeEnvelope",
    value: function () {
      var _makeEnvelope = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
        var envelope;
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                if (this._sessionId) {
                  _context8.next = 2;
                  break;
                }

                throw new Error("can't save assets without first connecting to the server");

              case 2:
                envelope = new _envelope.Envelope(this._sessionId, this._apiClient, this._geoPosition, this);
                _context8.next = 5;
                return envelope.connect();

              case 5:
                return _context8.abrupt("return", envelope);

              case 6:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function makeEnvelope() {
        return _makeEnvelope.apply(this, arguments);
      }

      return makeEnvelope;
    }()
  }, {
    key: "findTagDescription",
    value: function findTagDescription(tagId) {
      var tagType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "listen";
      var tagGroups = this.uiConfig[tagType];

      var _iterator = _createForOfIteratorHelper(tagGroups),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var group = _step.value;

          var _iterator2 = _createForOfIteratorHelper(group.display_items),
              _step2;

          try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
              var item = _step2.value;

              if (item.tag_id == tagId) {
                return item.tag_display_text;
              }
            }
          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      return undefined;
    }
  }, {
    key: "vote",
    value: function () {
      var _vote = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(assetId, voteType, value) {
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                return _context9.abrupt("return", this._apiClient.post("/assets/".concat(assetId, "/votes/"), {
                  session_id: this._sessionId,
                  vote_type: voteType,
                  value: value
                }));

              case 1:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      function vote(_x6, _x7, _x8) {
        return _vote.apply(this, arguments);
      }

      return vote;
    }() /// @return Detailed information about a particular asset.

  }, {
    key: "getAsset",
    value: function () {
      var _getAsset = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(id) {
        var _iterator3, _step3, asset;

        return regeneratorRuntime.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                if (!this._assetData) {
                  _context10.next = 18;
                  break;
                }

                _iterator3 = _createForOfIteratorHelper(this._assetData);
                _context10.prev = 2;

                _iterator3.s();

              case 4:
                if ((_step3 = _iterator3.n()).done) {
                  _context10.next = 10;
                  break;
                }

                asset = _step3.value;

                if (!(asset.id === id)) {
                  _context10.next = 8;
                  break;
                }

                return _context10.abrupt("return", asset);

              case 8:
                _context10.next = 4;
                break;

              case 10:
                _context10.next = 15;
                break;

              case 12:
                _context10.prev = 12;
                _context10.t0 = _context10["catch"](2);

                _iterator3.e(_context10.t0);

              case 15:
                _context10.prev = 15;

                _iterator3.f();

                return _context10.finish(15);

              case 18:
                return _context10.abrupt("return", this._apiClient.get("/assets/".concat(id, "/"), {
                  session_id: this._sessionId
                }));

              case 19:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10, this, [[2, 12, 15, 18]]);
      }));

      function getAsset(_x9) {
        return _getAsset.apply(this, arguments);
      }

      return getAsset;
    }() /// @return Details about a particular envelope (which may contain multiple assets).

  }, {
    key: "getEnvelope",
    value: function () {
      var _getEnvelope = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(id) {
        return regeneratorRuntime.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                return _context11.abrupt("return", this._apiClient.get("/envelopes/".concat(id), {
                  session_id: this._sessionId
                }));

              case 1:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11, this);
      }));

      function getEnvelope(_x10) {
        return _getEnvelope.apply(this, arguments);
      }

      return getEnvelope;
    }()
  }, {
    key: "onUpdateLocation",
    set: function set(callback) {
      this._onUpdateLocation = callback;

      var lastCoords = this._geoPosition.getLastCoords();

      callback(lastCoords);
    }
  }, {
    key: "onUpdateAssets",
    set: function set(callback) {
      this._onUpdateAssets = callback;

      if (this._assetData) {
        callback(this.assets());
      }
    }
  }, {
    key: "onPlayAssets",
    set: function set(callback) {
      this._onPlayAssets = callback;
      callback(this.currentlyPlayingAssets);
    }
  }, {
    key: "currentlyPlayingAssets",
    get: function get() {
      return this._mixer.playlist && this._mixer.playlist.currentlyPlayingAssets;
    }
  }, {
    key: "mixParams",
    get: function get() {
      return (this._project || {}).mixParams;
    }
  }, {
    key: "assetPool",
    get: function get() {
      return this._mixer.playlist && this._mixer.playlist.assetPool;
    }
  }]);

  return Roundware;
}();

exports.Roundware = Roundware;