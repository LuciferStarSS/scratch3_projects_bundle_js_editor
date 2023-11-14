/* 501 */
 (function(module, __webpack_exports__, __webpack_require__) {
"use strict";
eval(" var __WEBPACK_IMPORTED_MODULE_0__mapCacheClear_js__ = __webpack_require__(684);\n var __WEBPACK_IMPORTED_MODULE_1__mapCacheDelete_js__ = __webpack_require__(685);\n var __WEBPACK_IMPORTED_MODULE_2__mapCacheGet_js__ = __webpack_require__(686);\n var __WEBPACK_IMPORTED_MODULE_3__mapCacheHas_js__ = __webpack_require__(687);\n var __WEBPACK_IMPORTED_MODULE_4__mapCacheSet_js__ = __webpack_require__(688);\n\n/**\n * Creates a map cache object to store key-value pairs.\n *\n * @private\n * @constructor\n * @param {Array} [entries] The key-value pairs to cache.\n */\nfunction MapCache(entries) {\n  var index = -1,\n      length = entries == null ? 0 : entries.length;\n  this.clear();\n  while (++index < length) {\n    var entry = entries[index];\n    this.set(entry[0], entry[1]);\n  }\n}\n// Add methods to `MapCache`.\nMapCache.prototype.clear = __WEBPACK_IMPORTED_MODULE_0__mapCacheClear_js__[\"a\" /* default */];\nMapCache.prototype['delete'] = __WEBPACK_IMPORTED_MODULE_1__mapCacheDelete_js__[\"a\" /* default */];\nMapCache.prototype.get = __WEBPACK_IMPORTED_MODULE_2__mapCacheGet_js__[\"a\" /* default */];\nMapCache.prototype.has = __WEBPACK_IMPORTED_MODULE_3__mapCacheHas_js__[\"a\" /* default */];\nMapCache.prototype.set = __WEBPACK_IMPORTED_MODULE_4__mapCacheSet_js__[\"a\" /* default */];\n/* harmony default export */ __webpack_exports__[\"a\"] = (MapCache);\n// ./~/lodash-es/_MapCache.js\n// module id = 501\n// module chunks = 0 1\n//# sourceURL=scratch:///./~/lodash-es/_MapCache.js?");
 })