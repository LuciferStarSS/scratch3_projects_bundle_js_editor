/* 500 */
 (function(module, exports, __webpack_require__) {
"use strict";
eval("/* global Promise */\n// load the global object first:\n// - it should be better integrated in the system (unhandledRejection in node)\n// - the environment may have a custom Promise implementation (see zone.js)\nvar ES6Promise = null;\nif (typeof Promise !== \"undefined\") {\n    ES6Promise = Promise;\n} else {\n    ES6Promise = __webpack_require__(1195);\n}\n/**\n * Let the user use/change some implementations.\n */\nmodule.exports = {\n    Promise: ES6Promise\n};\n// ./~/jszip/lib/external.js\n// module id = 500\n// module chunks = 0\n//# sourceURL=scratch:///./~/jszip/lib/external.js?");
 })