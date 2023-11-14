/* 782 */
 (function(module, exports, __webpack_require__) {
"use strict";
eval("\nvar utils = __webpack_require__(165);\nvar GenericWorker = __webpack_require__(251);\n/**\n * A worker which calculate the total length of the data flowing through.\n * @constructor\n * @param {String} propName the name used to expose the length\n */\nfunction DataLengthProbe(propName) {\n    GenericWorker.call(this, \"DataLengthProbe for \" + propName);\n    this.propName = propName;\n    this.withStreamInfo(propName, 0);\n}\nutils.inherits(DataLengthProbe, GenericWorker);\n/**\n * @see GenericWorker.processChunk\n */\nDataLengthProbe.prototype.processChunk = function (chunk) {\n    if(chunk) {\n        var length = this.streamInfo[this.propName] || 0;\n        this.streamInfo[this.propName] = length + chunk.data.length;\n    }\n    GenericWorker.prototype.processChunk.call(this, chunk);\n};\nmodule.exports = DataLengthProbe;\n// ./~/jszip/lib/stream/DataLengthProbe.js\n// module id = 782\n// module chunks = 0\n//# sourceURL=scratch:///./~/jszip/lib/stream/DataLengthProbe.js?");
 })