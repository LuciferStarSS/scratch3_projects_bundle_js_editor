/* 520 */\n (function(module, exports, __webpack_require__) {\n// 7.3.20 SpeciesConstructor(O, defaultConstructor)\nvar anObject = __webpack_require__(96);\nvar aFunction = __webpack_require__(234);\nvar SPECIES = __webpack_require__(67)('species');\nmodule.exports = function (O, D) {\n  var C = anObject(O).constructor;\n  var S;\n  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);\n};\n })