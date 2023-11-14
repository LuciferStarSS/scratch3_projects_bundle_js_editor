/* 509 */
 (function(module, __webpack_exports__, __webpack_require__) {
"use strict";
eval("/**\n * Copies the values of `source` to `array`.\n *\n * @private\n * @param {Array} source The array to copy values from.\n * @param {Array} [array=[]] The array to copy values to.\n * @returns {Array} Returns `array`.\n */\nfunction copyArray(source, array) {\n  var index = -1,\n      length = source.length;\n  array || (array = Array(length));\n  while (++index < length) {\n    array[index] = source[index];\n  }\n  return array;\n}\n/* harmony default export */ __webpack_exports__[\"a\"] = (copyArray);\n// ./~/lodash-es/_copyArray.js\n// module id = 509\n// module chunks = 0 1\n//# sourceURL=scratch:///./~/lodash-es/_copyArray.js?");
 })