/* 638 */
 (function(module, __webpack_exports__, __webpack_require__) {
"use strict";
eval(" var __WEBPACK_IMPORTED_MODULE_0__ListCache_js__ = __webpack_require__(301);\n var __WEBPACK_IMPORTED_MODULE_1__stackClear_js__ = __webpack_require__(693);\n var __WEBPACK_IMPORTED_MODULE_2__stackDelete_js__ = __webpack_require__(694);\n var __WEBPACK_IMPORTED_MODULE_3__stackGet_js__ = __webpack_require__(695);\n var __WEBPACK_IMPORTED_MODULE_4__stackHas_js__ = __webpack_require__(696);\n var __WEBPACK_IMPORTED_MODULE_5__stackSet_js__ = __webpack_require__(697);\n\n/**\n * Creates a stack cache object to store key-value pairs.\n *\n * @private\n * @constructor\n * @param {Array} [entries] The key-value pairs to cache.\n */\nfunction Stack(entries) {\n  var data = this.__data__ = new __WEBPACK_IMPORTED_MODULE_0__ListCache_js__[\"a\" /* default */](entries);\n  this.size = data.size;\n}\n// Add methods to `Stack`.\nStack.prototype.clear = __WEBPACK_IMPORTED_MODULE_1__stackClear_js__[\"a\" /* default */];\nStack.prototype['delete'] = __WEBPACK_IMPORTED_MODULE_2__stackDelete_js__[\"a\" /* default */];\nStack.prototype.get = __WEBPACK_IMPORTED_MODULE_3__stackGet_js__[\"a\" /* default */];\nStack.prototype.has = __WEBPACK_IMPORTED_MODULE_4__stackHas_js__[\"a\" /* default */];\nStack.prototype.set = __WEBPACK_IMPORTED_MODULE_5__stackSet_js__[\"a\" /* default */];\n/* harmony default export */ __webpack_exports__[\"a\"] = (Stack);\n// ./~/lodash-es/_Stack.js\n// module id = 638\n// module chunks = 0 1\n//# sourceURL=scratch:///./~/lodash-es/_Stack.js?");
 })