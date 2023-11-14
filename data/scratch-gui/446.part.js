/* 446 */\n (function(module, exports, __webpack_require__) {\n\"use strict\";\nvar bind = __webpack_require__(183);\nvar ES = __webpack_require__(1056);\nvar replace = bind.call(Function.call, String.prototype.replace);\n/* eslint-disable no-control-regex */\nvar leftWhitespace = /^[\\x09\\x0A\\x0B\\x0C\\x0D\\x20\\xA0\\u1680\\u180E\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200A\\u202F\\u205F\\u3000\\u2028\\u2029\\uFEFF]+/;\nvar rightWhitespace = /[\\x09\\x0A\\x0B\\x0C\\x0D\\x20\\xA0\\u1680\\u180E\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200A\\u202F\\u205F\\u3000\\u2028\\u2029\\uFEFF]+$/;\n/* eslint-enable no-control-regex */\nmodule.exports = function trim() {\n\tvar S = ES.ToString(ES.CheckObjectCoercible(this));\n\treturn replace(replace(S, leftWhitespace, ''), rightWhitespace, '');\n};\n })