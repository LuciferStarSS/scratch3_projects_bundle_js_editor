/* 656 */
 (function(module, __webpack_exports__, __webpack_require__) {
"use strict";
eval(" var __WEBPACK_IMPORTED_MODULE_0__cloneArrayBuffer_js__ = __webpack_require__(459);\n/**\n * Creates a clone of `dataView`.\n *\n * @private\n * @param {Object} dataView The data view to clone.\n * @param {boolean} [isDeep] Specify a deep clone.\n * @returns {Object} Returns the cloned data view.\n */\nfunction cloneDataView(dataView, isDeep) {\n  var buffer = isDeep ? __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__cloneArrayBuffer_js__[\"a\" /* default */])(dataView.buffer) : dataView.buffer;\n  return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);\n}\n/* harmony default export */ __webpack_exports__[\"a\"] = (cloneDataView);\n// ./~/lodash-es/_cloneDataView.js\n// module id = 656\n// module chunks = 0 1\n//# sourceURL=scratch:///./~/lodash-es/_cloneDataView.js?");
 })