/* 1444 */\n (function(module, exports, __webpack_require__) {\nvar classof = __webpack_require__(331);\nvar ITERATOR = __webpack_require__(67)('iterator');\nvar Iterators = __webpack_require__(159);\nmodule.exports = __webpack_require__(53).isIterable = function (it) {\n  var O = Object(it);\n  return O[ITERATOR] !== undefined\n    || '@@iterator' in O\n    // eslint-disable-next-line no-prototype-builtins\n    || Iterators.hasOwnProperty(classof(O));\n};\n })