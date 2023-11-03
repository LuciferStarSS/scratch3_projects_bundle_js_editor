/* 669 */
 (function(module, __webpack_exports__, __webpack_require__) {
"use strict";
eval("/**\n * Removes `key` and its value from the hash.\n *\n * @private\n * @name delete\n * @memberOf Hash\n * @param {Object} hash The hash to modify.\n * @param {string} key The key of the value to remove.\n * @returns {boolean} Returns `true` if the entry was removed, else `false`.\n */\nfunction hashDelete(key) {\n  var result = this.has(key) && delete this.__data__[key];\n  this.size -= result ? 1 : 0;\n  return result;\n}\n/* harmony default export */ __webpack_exports__[\"a\"] = (hashDelete);\n// ./~/lodash-es/_hashDelete.js\n// module id = 669\n// module chunks = 0 1\n//# sourceURL=scratch:///./~/lodash-es/_hashDelete.js?");
 })