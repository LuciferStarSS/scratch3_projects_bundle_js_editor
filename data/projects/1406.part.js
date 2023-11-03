/* 1406 */
 (function(module, exports, __webpack_require__) {
"use strict";
eval("\nmodule.exports = function (str) {\n\treturn encodeURIComponent(str).replace(/[!'()*]/g, function (c) {\n\t\treturn '%' + c.charCodeAt(0).toString(16).toUpperCase();\n\t});\n};\n// ./~/strict-uri-encode/index.js\n// module id = 1406\n// module chunks = 0\n//# sourceURL=scratch:///./~/strict-uri-encode/index.js?");
 })