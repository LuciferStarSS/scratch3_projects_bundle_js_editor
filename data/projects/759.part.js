/* 759 */
 (function(module, exports, __webpack_require__) {
eval("var isObject = __webpack_require__(596)\n  , document = __webpack_require__(551).document\n  // in old IE typeof document.createElement is 'object'\n  , is = isObject(document) && isObject(document.createElement);\nmodule.exports = function(it){\n  return is ? document.createElement(it) : {};\n};\n// ./~/core-js/library/modules/_dom-create.js\n// module id = 759\n// module chunks = 0\n//# sourceURL=scratch:///./~/core-js/library/modules/_dom-create.js?");
 })