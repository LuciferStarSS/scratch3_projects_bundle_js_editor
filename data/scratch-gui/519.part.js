/* 519 */\n (function(module, exports, __webpack_require__) {\nvar classof = __webpack_require__(331);\nvar ITERATOR = __webpack_require__(67)('iterator');\nvar Iterators = __webpack_require__(159);\nmodule.exports = __webpack_require__(53).getIteratorMethod = function (it) {\n  if (it != undefined) return it[ITERATOR]\n    || it['@@iterator']\n    || Iterators[classof(it)];\n};\n })