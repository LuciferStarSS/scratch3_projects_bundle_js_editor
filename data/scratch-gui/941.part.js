/* 941 */\n (function(module, exports, __webpack_require__) {\n\"use strict\";\nvar DataReader = __webpack_require__(424);\nvar utils = __webpack_require__(42);\nfunction StringReader(data) {\n    DataReader.call(this, data);\n}\nutils.inherits(StringReader, DataReader);\n/**\n * @see DataReader.byteAt\n */\nStringReader.prototype.byteAt = function(i) {\n    return this.data.charCodeAt(this.zero + i);\n};\n/**\n * @see DataReader.lastIndexOfSignature\n */\nStringReader.prototype.lastIndexOfSignature = function(sig) {\n    return this.data.lastIndexOf(sig) - this.zero;\n};\n/**\n * @see DataReader.readAndCheckSignature\n */\nStringReader.prototype.readAndCheckSignature = function (sig) {\n    var data = this.readData(4);\n    return sig === data;\n};\n/**\n * @see DataReader.readData\n */\nStringReader.prototype.readData = function(size) {\n    this.checkOffset(size);\n    // this will work because the constructor applied the \"& 0xff\" mask.\n    var result = this.data.slice(this.zero + this.index, this.zero + this.index + size);\n    this.index += size;\n    return result;\n};\nmodule.exports = StringReader;\n })