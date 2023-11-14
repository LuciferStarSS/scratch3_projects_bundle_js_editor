/* 683 */
 (function(module, __webpack_exports__, __webpack_require__) {
"use strict";
eval(" var __WEBPACK_IMPORTED_MODULE_0__assocIndexOf_js__ = __webpack_require__(302);\n/**\n * Sets the list cache `key` to `value`.\n *\n * @private\n * @name set\n * @memberOf ListCache\n * @param {string} key The key of the value to set.\n * @param {*} value The value to set.\n * @returns {Object} Returns the list cache instance.\n */\nfunction listCacheSet(key, value) {\n  var data = this.__data__,\n      index = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__assocIndexOf_js__[\"a\" /* default */])(data, key);\n  if (index < 0) {\n    ++this.size;\n    data.push([key, value]);\n  } else {\n    data[index][1] = value;\n  }\n  return this;\n}\n/* harmony default export */ __webpack_exports__[\"a\"] = (listCacheSet);\n// ./~/lodash-es/_listCacheSet.js\n// module id = 683\n// module chunks = 0 1\n//# sourceURL=scratch:///./~/lodash-es/_listCacheSet.js?");
 })