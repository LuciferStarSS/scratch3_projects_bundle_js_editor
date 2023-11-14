/* 651 */
 (function(module, __webpack_exports__, __webpack_require__) {
"use strict";
eval(" var __WEBPACK_IMPORTED_MODULE_0__isPrototype_js__ = __webpack_require__(462);\n var __WEBPACK_IMPORTED_MODULE_1__nativeKeys_js__ = __webpack_require__(690);\n/** Used for built-in method references. */\nvar objectProto = Object.prototype;\n/** Used to check objects for own properties. */\nvar hasOwnProperty = objectProto.hasOwnProperty;\n/**\n * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.\n *\n * @private\n * @param {Object} object The object to query.\n * @returns {Array} Returns the array of property names.\n */\nfunction baseKeys(object) {\n  if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__isPrototype_js__[\"a\" /* default */])(object)) {\n    return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__nativeKeys_js__[\"a\" /* default */])(object);\n  }\n  var result = [];\n  for (var key in Object(object)) {\n    if (hasOwnProperty.call(object, key) && key != 'constructor') {\n      result.push(key);\n    }\n  }\n  return result;\n}\n/* harmony default export */ __webpack_exports__[\"a\"] = (baseKeys);\n// ./~/lodash-es/_baseKeys.js\n// module id = 651\n// module chunks = 0 1\n//# sourceURL=scratch:///./~/lodash-es/_baseKeys.js?");
 })