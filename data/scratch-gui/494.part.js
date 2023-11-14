/* 494 */\n (function(module, exports, __webpack_require__) {\n// Generated by CoffeeScript 1.7.1\nvar UnicodeTrie, inflate;\ninflate = __webpack_require__(1269);\nUnicodeTrie = (function() {\n  var DATA_BLOCK_LENGTH, DATA_GRANULARITY, DATA_MASK, INDEX_1_OFFSET, INDEX_2_BLOCK_LENGTH, INDEX_2_BMP_LENGTH, INDEX_2_MASK, INDEX_SHIFT, LSCP_INDEX_2_LENGTH, LSCP_INDEX_2_OFFSET, OMITTED_BMP_INDEX_1_LENGTH, SHIFT_1, SHIFT_1_2, SHIFT_2, UTF8_2B_INDEX_2_LENGTH, UTF8_2B_INDEX_2_OFFSET;\n  SHIFT_1 = 6 + 5;\n  SHIFT_2 = 5;\n  SHIFT_1_2 = SHIFT_1 - SHIFT_2;\n  OMITTED_BMP_INDEX_1_LENGTH = 0x10000 >> SHIFT_1;\n  INDEX_2_BLOCK_LENGTH = 1 << SHIFT_1_2;\n  INDEX_2_MASK = INDEX_2_BLOCK_LENGTH - 1;\n  INDEX_SHIFT = 2;\n  DATA_BLOCK_LENGTH = 1 << SHIFT_2;\n  DATA_MASK = DATA_BLOCK_LENGTH - 1;\n  LSCP_INDEX_2_OFFSET = 0x10000 >> SHIFT_2;\n  LSCP_INDEX_2_LENGTH = 0x400 >> SHIFT_2;\n  INDEX_2_BMP_LENGTH = LSCP_INDEX_2_OFFSET + LSCP_INDEX_2_LENGTH;\n  UTF8_2B_INDEX_2_OFFSET = INDEX_2_BMP_LENGTH;\n  UTF8_2B_INDEX_2_LENGTH = 0x800 >> 6;\n  INDEX_1_OFFSET = UTF8_2B_INDEX_2_OFFSET + UTF8_2B_INDEX_2_LENGTH;\n  DATA_GRANULARITY = 1 << INDEX_SHIFT;\n  function UnicodeTrie(data) {\n    var isBuffer, uncompressedLength, view;\n    isBuffer = typeof data.readUInt32BE === 'function' && typeof data.slice === 'function';\n    if (isBuffer || data instanceof Uint8Array) {\n      if (isBuffer) {\n        this.highStart = data.readUInt32BE(0);\n        this.errorValue = data.readUInt32BE(4);\n        uncompressedLength = data.readUInt32BE(8);\n        data = data.slice(12);\n      } else {\n        view = new DataView(data.buffer);\n        this.highStart = view.getUint32(0);\n        this.errorValue = view.getUint32(4);\n        uncompressedLength = view.getUint32(8);\n        data = data.subarray(12);\n      }\n      data = inflate(data, new Uint8Array(uncompressedLength));\n      data = inflate(data, new Uint8Array(uncompressedLength));\n      this.data = new Uint32Array(data.buffer);\n    } else {\n      this.data = data.data, this.highStart = data.highStart, this.errorValue = data.errorValue;\n    }\n  }\n  UnicodeTrie.prototype.get = function(codePoint) {\n    var index;\n    if (codePoint < 0 || codePoint > 0x10ffff) {\n      return this.errorValue;\n    }\n    if (codePoint < 0xd800 || (codePoint > 0xdbff && codePoint <= 0xffff)) {\n      index = (this.data[codePoint >> SHIFT_2] << INDEX_SHIFT) + (codePoint & DATA_MASK);\n      return this.data[index];\n    }\n    if (codePoint <= 0xffff) {\n      index = (this.data[LSCP_INDEX_2_OFFSET + ((codePoint - 0xd800) >> SHIFT_2)] << INDEX_SHIFT) + (codePoint & DATA_MASK);\n      return this.data[index];\n    }\n    if (codePoint < this.highStart) {\n      index = this.data[(INDEX_1_OFFSET - OMITTED_BMP_INDEX_1_LENGTH) + (codePoint >> SHIFT_1)];\n      index = this.data[index + ((codePoint >> SHIFT_2) & INDEX_2_MASK)];\n      index = (index << INDEX_SHIFT) + (codePoint & DATA_MASK);\n      return this.data[index];\n    }\n    return this.data[this.data.length - DATA_GRANULARITY];\n  };\n  return UnicodeTrie;\n})();\nmodule.exports = UnicodeTrie;\n })