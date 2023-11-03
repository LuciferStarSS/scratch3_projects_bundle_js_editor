/* 657 */
 (function(module, __webpack_exports__, __webpack_require__) {
"use strict";
eval("/** Used to match `RegExp` flags from their coerced string values. */\nvar reFlags = /\\w*$/;\n/**\n * Creates a clone of `regexp`.\n *\n * @private\n * @param {Object} regexp The regexp to clone.\n * @returns {Object} Returns the cloned regexp.\n */\nfunction cloneRegExp(regexp) {\n  var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));\n  result.lastIndex = regexp.lastIndex;\n  return result;\n}\n/* harmony default export */ __webpack_exports__[\"a\"] = (cloneRegExp);\n// ./~/lodash-es/_cloneRegExp.js\n// module id = 657\n// module chunks = 0 1\n//# sourceURL=scratch:///./~/lodash-es/_cloneRegExp.js?");
 })