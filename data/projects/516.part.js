/* 516 */
 (function(module, __webpack_exports__, __webpack_require__) {
"use strict";
eval(" var __WEBPACK_IMPORTED_MODULE_0__baseGetTag_js__ = __webpack_require__(262);\n var __WEBPACK_IMPORTED_MODULE_1__isObject_js__ = __webpack_require__(264);\n/** `Object#toString` result references. */\nvar asyncTag = '[object AsyncFunction]',\n    funcTag = '[object Function]',\n    genTag = '[object GeneratorFunction]',\n    proxyTag = '[object Proxy]';\n/**\n * Checks if `value` is classified as a `Function` object.\n *\n * @static\n * @memberOf _\n * @since 0.1.0\n * @category Lang\n * @param {*} value The value to check.\n * @returns {boolean} Returns `true` if `value` is a function, else `false`.\n * @example\n *\n * _.isFunction(_);\n * // => true\n *\n * _.isFunction(/abc/);\n * // => false\n */\nfunction isFunction(value) {\n  if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__isObject_js__[\"a\" /* default */])(value)) {\n    return false;\n  }\n  // The use of `Object#toString` avoids issues with the `typeof` operator\n  // in Safari 9 which returns 'object' for typed arrays and other constructors.\n  var tag = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__baseGetTag_js__[\"a\" /* default */])(value);\n  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;\n}\n/* harmony default export */ __webpack_exports__[\"a\"] = (isFunction);\n// ./~/lodash-es/isFunction.js\n// module id = 516\n// module chunks = 0 1\n//# sourceURL=scratch:///./~/lodash-es/isFunction.js?");
 })