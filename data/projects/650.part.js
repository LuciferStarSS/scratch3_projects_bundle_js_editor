/* 650 */
 (function(module, __webpack_exports__, __webpack_require__) {
"use strict";
eval(" var __WEBPACK_IMPORTED_MODULE_0__baseGetTag_js__ = __webpack_require__(262);\n var __WEBPACK_IMPORTED_MODULE_1__isLength_js__ = __webpack_require__(517);\n var __WEBPACK_IMPORTED_MODULE_2__isObjectLike_js__ = __webpack_require__(243);\n\n/** `Object#toString` result references. */\nvar argsTag = '[object Arguments]',\n    arrayTag = '[object Array]',\n    boolTag = '[object Boolean]',\n    dateTag = '[object Date]',\n    errorTag = '[object Error]',\n    funcTag = '[object Function]',\n    mapTag = '[object Map]',\n    numberTag = '[object Number]',\n    objectTag = '[object Object]',\n    regexpTag = '[object RegExp]',\n    setTag = '[object Set]',\n    stringTag = '[object String]',\n    weakMapTag = '[object WeakMap]';\nvar arrayBufferTag = '[object ArrayBuffer]',\n    dataViewTag = '[object DataView]',\n    float32Tag = '[object Float32Array]',\n    float64Tag = '[object Float64Array]',\n    int8Tag = '[object Int8Array]',\n    int16Tag = '[object Int16Array]',\n    int32Tag = '[object Int32Array]',\n    uint8Tag = '[object Uint8Array]',\n    uint8ClampedTag = '[object Uint8ClampedArray]',\n    uint16Tag = '[object Uint16Array]',\n    uint32Tag = '[object Uint32Array]';\n/** Used to identify `toStringTag` values of typed arrays. */\nvar typedArrayTags = {};\ntypedArrayTags[float32Tag] = typedArrayTags[float64Tag] =\ntypedArrayTags[int8Tag] = typedArrayTags[int16Tag] =\ntypedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =\ntypedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =\ntypedArrayTags[uint32Tag] = true;\ntypedArrayTags[argsTag] = typedArrayTags[arrayTag] =\ntypedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =\ntypedArrayTags[dataViewTag] = typedArrayTags[dateTag] =\ntypedArrayTags[errorTag] = typedArrayTags[funcTag] =\ntypedArrayTags[mapTag] = typedArrayTags[numberTag] =\ntypedArrayTags[objectTag] = typedArrayTags[regexpTag] =\ntypedArrayTags[setTag] = typedArrayTags[stringTag] =\ntypedArrayTags[weakMapTag] = false;\n/**\n * The base implementation of `_.isTypedArray` without Node.js optimizations.\n *\n * @private\n * @param {*} value The value to check.\n * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.\n */\nfunction baseIsTypedArray(value) {\n  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__isObjectLike_js__[\"a\" /* default */])(value) &&\n    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__isLength_js__[\"a\" /* default */])(value.length) && !!typedArrayTags[__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__baseGetTag_js__[\"a\" /* default */])(value)];\n}\n/* harmony default export */ __webpack_exports__[\"a\"] = (baseIsTypedArray);\n// ./~/lodash-es/_baseIsTypedArray.js\n// module id = 650\n// module chunks = 0 1\n//# sourceURL=scratch:///./~/lodash-es/_baseIsTypedArray.js?");
 })