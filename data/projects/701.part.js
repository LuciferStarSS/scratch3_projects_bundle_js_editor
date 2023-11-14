/* 701 */
 (function(module, __webpack_exports__, __webpack_require__) {
"use strict";
eval(" var __WEBPACK_IMPORTED_MODULE_0__baseClone_js__ = __webpack_require__(507);\n/** Used to compose bitmasks for cloning. */\nvar CLONE_DEEP_FLAG = 1,\n    CLONE_SYMBOLS_FLAG = 4;\n/**\n * This method is like `_.clone` except that it recursively clones `value`.\n *\n * @static\n * @memberOf _\n * @since 1.0.0\n * @category Lang\n * @param {*} value The value to recursively clone.\n * @returns {*} Returns the deep cloned value.\n * @see _.clone\n * @example\n *\n * var objects = [{ 'a': 1 }, { 'b': 2 }];\n *\n * var deep = _.cloneDeep(objects);\n * console.log(deep[0] === objects[0]);\n * // => false\n */\nfunction cloneDeep(value) {\n  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__baseClone_js__[\"a\" /* default */])(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG);\n}\n/* harmony default export */ __webpack_exports__[\"a\"] = (cloneDeep);\n// ./~/lodash-es/cloneDeep.js\n// module id = 701\n// module chunks = 0 1\n//# sourceURL=scratch:///./~/lodash-es/cloneDeep.js?");
 })