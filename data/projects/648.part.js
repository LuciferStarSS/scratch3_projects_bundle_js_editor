/* 648 */
 (function(module, __webpack_exports__, __webpack_require__) {
"use strict";
eval(" var __WEBPACK_IMPORTED_MODULE_0__isFunction_js__ = __webpack_require__(516);\n var __WEBPACK_IMPORTED_MODULE_1__isMasked_js__ = __webpack_require__(678);\n var __WEBPACK_IMPORTED_MODULE_2__isObject_js__ = __webpack_require__(264);\n var __WEBPACK_IMPORTED_MODULE_3__toSource_js__ = __webpack_require__(512);\n\n/**\n * Used to match `RegExp`\n * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).\n */\nvar reRegExpChar = /[\\\\^$.*+?()[\\]{}|]/g;\n/** Used to detect host constructors (Safari). */\nvar reIsHostCtor = /^\\[object .+?Constructor\\]$/;\n/** Used for built-in method references. */\nvar funcProto = Function.prototype,\n    objectProto = Object.prototype;\n/** Used to resolve the decompiled source of functions. */\nvar funcToString = funcProto.toString;\n/** Used to check objects for own properties. */\nvar hasOwnProperty = objectProto.hasOwnProperty;\n/** Used to detect if a method is native. */\nvar reIsNative = RegExp('^' +\n  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\\\$&')\n  .replace(/hasOwnProperty|(function).*?(?=\\\\\\()| for .+?(?=\\\\\\])/g, '$1.*?') + '$'\n);\n/**\n * The base implementation of `_.isNative` without bad shim checks.\n *\n * @private\n * @param {*} value The value to check.\n * @returns {boolean} Returns `true` if `value` is a native function,\n *  else `false`.\n */\nfunction baseIsNative(value) {\n  if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__isObject_js__[\"a\" /* default */])(value) || __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__isMasked_js__[\"a\" /* default */])(value)) {\n    return false;\n  }\n  var pattern = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__isFunction_js__[\"a\" /* default */])(value) ? reIsNative : reIsHostCtor;\n  return pattern.test(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__toSource_js__[\"a\" /* default */])(value));\n}\n/* harmony default export */ __webpack_exports__[\"a\"] = (baseIsNative);\n// ./~/lodash-es/_baseIsNative.js\n// module id = 648\n// module chunks = 0 1\n//# sourceURL=scratch:///./~/lodash-es/_baseIsNative.js?");
 })