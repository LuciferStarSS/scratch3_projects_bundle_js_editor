/* 138 */\n (function(module, exports, __webpack_require__) {\nvar dP = __webpack_require__(117);\nvar createDesc = __webpack_require__(235);\nmodule.exports = __webpack_require__(119) ? function (object, key, value) {\n  return dP.f(object, key, createDesc(1, value));\n} : function (object, key, value) {\n  object[key] = value;\n  return object;\n};\n })