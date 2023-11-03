/* 653 */
 (function(module, __webpack_exports__, __webpack_require__) {
"use strict";
eval("/**\n * The base implementation of `_.times` without support for iteratee shorthands\n * or max array length checks.\n *\n * @private\n * @param {number} n The number of times to invoke `iteratee`.\n * @param {Function} iteratee The function invoked per iteration.\n * @returns {Array} Returns the array of results.\n */\nfunction baseTimes(n, iteratee) {\n  var index = -1,\n      result = Array(n);\n  while (++index < n) {\n    result[index] = iteratee(index);\n  }\n  return result;\n}\n/* harmony default export */ __webpack_exports__[\"a\"] = (baseTimes);\n// ./~/lodash-es/_baseTimes.js\n// module id = 653\n// module chunks = 0 1\n//# sourceURL=scratch:///./~/lodash-es/_baseTimes.js?");
 })