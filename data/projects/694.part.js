/* 694 */
 (function(module, __webpack_exports__, __webpack_require__) {
"use strict";
eval("/**\n * Removes `key` and its value from the stack.\n *\n * @private\n * @name delete\n * @memberOf Stack\n * @param {string} key The key of the value to remove.\n * @returns {boolean} Returns `true` if the entry was removed, else `false`.\n */\nfunction stackDelete(key) {\n  var data = this.__data__,\n      result = data['delete'](key);\n  this.size = data.size;\n  return result;\n}\n/* harmony default export */ __webpack_exports__[\"a\"] = (stackDelete);\n// ./~/lodash-es/_stackDelete.js\n// module id = 694\n// module chunks = 0 1\n//# sourceURL=scratch:///./~/lodash-es/_stackDelete.js?");
 })