"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

require("core-js/modules/es.array.for-each.js");

require("core-js/modules/es.array.map.js");

require("core-js/modules/web.dom-collections.for-each.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AssetSorter = void 0;

var sortMethodCollection = _interopRequireWildcard(require("./sortMethods"));

var _utils = require("./utils");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function mapSortMethods(sortMethodNames) {
  // @ts-ignore
  return sortMethodNames.map(function (name) {
    return sortMethodCollection[name];
  });
}

var AssetSorter = /*#__PURE__*/function () {
  function AssetSorter(_ref) {
    var _ref$sortMethods = _ref.sortMethods,
        sortMethods = _ref$sortMethods === void 0 ? [] : _ref$sortMethods,
        _ref$ordering = _ref.ordering,
        ordering = _ref$ordering === void 0 ? "random" : _ref$ordering;

    _classCallCheck(this, AssetSorter);

    if ((0, _utils.isEmpty)(sortMethods)) {
      this.sortMethods = [sortMethodCollection.sortByProjectDefault(ordering)];
    } else {
      // @ts-ignore
      this.sortMethods = mapSortMethods(sortMethods);
    } //console.info({ ordering, sortMethods, thisSortMethods: this.sortMethods });

  }

  _createClass(AssetSorter, [{
    key: "sort",
    value: function sort(assets) {
      this.sortMethods.forEach(function (sortMethod) {
        return sortMethod(assets);
      });
    }
  }]);

  return AssetSorter;
}();

exports.AssetSorter = AssetSorter;