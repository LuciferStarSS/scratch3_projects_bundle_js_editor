/* 1382 */\n (function(module, exports, __webpack_require__) {\n\"use strict\";\nvar doubleColonRe      = /::/g\nvar upperToLowerRe     = /([A-Z]+)([A-Z][a-z])/g\nvar lowerToUpperRe     = /([a-z\\d])([A-Z])/g\nvar underscoreToDashRe = /_/g\nmodule.exports = function(name, separator){\n   return name?\n           name.replace(doubleColonRe, '/')\n                .replace(upperToLowerRe, '$1_$2')\n                .replace(lowerToUpperRe, '$1_$2')\n                .replace(underscoreToDashRe, separator || '-')\n            :\n            ''\n}\n })