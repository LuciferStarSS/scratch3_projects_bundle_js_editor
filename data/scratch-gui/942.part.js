/* 942 */\n (function(module, exports, __webpack_require__) {\n\"use strict\";\nvar Uint8ArrayReader = __webpack_require__(425);\nvar utils = __webpack_require__(42);\nfunction NodeBufferReader(data) {\n    Uint8ArrayReader.call(this, data);\n}\nutils.inherits(NodeBufferReader, Uint8ArrayReader);\n/**\n * @see DataReader.readData\n */\nNodeBufferReader.prototype.readData = function(size) {\n    this.checkOffset(size);\n    var result = this.data.slice(this.zero + this.index, this.zero + this.index + size);\n    this.index += size;\n    return result;\n};\nmodule.exports = NodeBufferReader;\n })