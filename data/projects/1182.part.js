/* 1182 */
 (function(module, exports, __webpack_require__) {
"use strict";
eval("\nvar GenericWorker = __webpack_require__(251);\nvar utils = __webpack_require__(165);\n/**\n * A worker which convert chunks to a specified type.\n * @constructor\n * @param {String} destType the destination type.\n */\nfunction ConvertWorker(destType) {\n    GenericWorker.call(this, \"ConvertWorker to \" + destType);\n    this.destType = destType;\n}\nutils.inherits(ConvertWorker, GenericWorker);\n/**\n * @see GenericWorker.processChunk\n */\nConvertWorker.prototype.processChunk = function (chunk) {\n    this.push({\n        data : utils.transformTo(this.destType, chunk.data),\n        meta : chunk.meta\n    });\n};\nmodule.exports = ConvertWorker;\n// ./~/jszip/lib/stream/ConvertWorker.js\n// module id = 1182\n// module chunks = 0\n//# sourceURL=scratch:///./~/jszip/lib/stream/ConvertWorker.js?");
 })