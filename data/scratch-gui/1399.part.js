/* 1399 */\n (function(module, exports, __webpack_require__) {\nvar toInteger = __webpack_require__(324);\nvar max = Math.max;\nvar min = Math.min;\nmodule.exports = function (index, length) {\n  index = toInteger(index);\n  return index < 0 ? max(index + length, 0) : min(index, length);\n};\n })