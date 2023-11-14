/* 423 */\n (function(module, exports, __webpack_require__) {\n\"use strict\";\nvar DataReader = __webpack_require__(424);\nvar utils = __webpack_require__(42);\nfunction ArrayReader(data) {\n    DataReader.call(this, data);\n\tfor(var i = 0; i < this.data.length; i++) {\n\t\tdata[i] = data[i] & 0xFF;\n\t}\n}\nutils.inherits(ArrayReader, DataReader);\n/**\n * @see DataReader.byteAt\n */\nArrayReader.prototype.byteAt = function(i) {\n    return this.data[this.zero + i];\n};\n/**\n * @see DataReader.lastIndexOfSignature\n */\nArrayReader.prototype.lastIndexOfSignature = function(sig) {\n    var sig0 = sig.charCodeAt(0),\n        sig1 = sig.charCodeAt(1),\n        sig2 = sig.charCodeAt(2),\n        sig3 = sig.charCodeAt(3);\n    for (var i = this.length - 4; i >= 0; --i) {\n        if (this.data[i] === sig0 && this.data[i + 1] === sig1 && this.data[i + 2] === sig2 && this.data[i + 3] === sig3) {\n            return i - this.zero;\n        }\n    }\n    return -1;\n};\n/**\n * @see DataReader.readAndCheckSignature\n */\nArrayReader.prototype.readAndCheckSignature = function (sig) {\n    var sig0 = sig.charCodeAt(0),\n        sig1 = sig.charCodeAt(1),\n        sig2 = sig.charCodeAt(2),\n        sig3 = sig.charCodeAt(3),\n        data = this.readData(4);\n    return sig0 === data[0] && sig1 === data[1] && sig2 === data[2] && sig3 === data[3];\n};\n/**\n * @see DataReader.readData\n */\nArrayReader.prototype.readData = function(size) {\n    this.checkOffset(size);\n    if(size === 0) {\n        return [];\n    }\n    var result = this.data.slice(this.zero + this.index, this.zero + this.index + size);\n    this.index += size;\n    return result;\n};\nmodule.exports = ArrayReader;\n })