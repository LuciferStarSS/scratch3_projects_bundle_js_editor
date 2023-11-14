/* 677 */
 (function(module, __webpack_exports__, __webpack_require__) {
"use strict";
eval("/**\n * Checks if `value` is suitable for use as unique object key.\n *\n * @private\n * @param {*} value The value to check.\n * @returns {boolean} Returns `true` if `value` is suitable, else `false`.\n */\nfunction isKeyable(value) {\n  var type = typeof value;\n  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')\n    ? (value !== '__proto__')\n    : (value === null);\n}\n/* harmony default export */ __webpack_exports__[\"a\"] = (isKeyable);\n// ./~/lodash-es/_isKeyable.js\n// module id = 677\n// module chunks = 0 1\n//# sourceURL=scratch:///./~/lodash-es/_isKeyable.js?");
 })