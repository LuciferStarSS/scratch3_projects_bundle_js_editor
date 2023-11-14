/* 1231 */\n (function(module, exports) {\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\nvar ArrayBufferStream = function () {\n  /**\n   * ArrayBufferStream wraps the built-in javascript ArrayBuffer, adding the ability to access\n   * data in it like a stream, tracking its position.\n   * You can request to read a value from the front of the array, and it will keep track of the position\n   * within the byte array, so that successive reads are consecutive.\n   * The available types to read include:\n   * Uint8, Uint8String, Int16, Uint16, Int32, Uint32\n   * @param {ArrayBuffer} arrayBuffer - array to use as a stream\n   * @param {number} start - the start position in the raw buffer. position\n   * will be relative to the start value.\n   * @param {number} end - the end position in the raw buffer. length and\n   * bytes available will be relative to the end value.\n   * @param {ArrayBufferStream} parent - if passed reuses the parent's\n   * internal objects\n   * @constructor\n   */\n  function ArrayBufferStream(arrayBuffer) {\n    var start = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;\n    var end = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : arrayBuffer.byteLength;\n    var _ref = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {},\n        _ref$_uint8View = _ref._uint8View,\n        _uint8View = _ref$_uint8View === void 0 ? new Uint8Array(arrayBuffer) : _ref$_uint8View;\n    _classCallCheck(this, ArrayBufferStream);\n    /**\n     * Raw data buffer for stream to read.\n     * @type {ArrayBufferStream}\n     */\n    this.arrayBuffer = arrayBuffer;\n    /**\n     * Start position in arrayBuffer. Read values are relative to the start\n     * in the arrayBuffer.\n     * @type {number}\n     */\n    this.start = start;\n    /**\n     * End position in arrayBuffer. Length and bytes available are relative\n     * to the start, end, and _position in the arrayBuffer;\n     * @type {number};\n     */\n    this.end = end;\n    /**\n     * Cached Uint8Array view of the arrayBuffer. Heavily used for reading\n     * Uint8 values and Strings from the stream.\n     * @type {Uint8Array}\n     */\n    this._uint8View = _uint8View;\n    /**\n     * Raw position in the arrayBuffer relative to the beginning of the\n     * arrayBuffer.\n     * @type {number}\n     */\n    this._position = start;\n  }\n  /**\n   * Return a new ArrayBufferStream that is a slice of the existing one\n   * @param  {number} length - the number of bytes of extract\n   * @return {ArrayBufferStream} the extracted stream\n   */\n  _createClass(ArrayBufferStream, [{\n    key: \"extract\",\n    value: function extract(length) {\n      return new ArrayBufferStream(this.arrayBuffer, this._position, this._position + length, this);\n    }\n    /**\n     * @return {number} the length of the stream in bytes\n     */\n  }, {\n    key: \"getLength\",\n    value: function getLength() {\n      return this.end - this.start;\n    }\n    /**\n     * @return {number} the number of bytes available after the current position in the stream\n     */\n  }, {\n    key: \"getBytesAvailable\",\n    value: function getBytesAvailable() {\n      return this.end - this._position;\n    }\n    /**\n     * Position relative to the start value in the arrayBuffer of this\n     * ArrayBufferStream.\n     * @type {number}\n     */\n  }, {\n    key: \"readUint8\",\n    /**\n     * Read an unsigned 8 bit integer from the stream\n     * @return {number} the next 8 bit integer in the stream\n     */\n    value: function readUint8() {\n      var val = this._uint8View[this._position];\n      this._position += 1;\n      return val;\n    }\n    /**\n     * Read a sequence of bytes of the given length and convert to a string.\n     * This is a convenience method for use with short strings.\n     * @param {number} length - the number of bytes to convert\n     * @return {string} a String made by concatenating the chars in the input\n     */\n  }, {\n    key: \"readUint8String\",\n    value: function readUint8String(length) {\n      var arr = this._uint8View;\n      var str = '';\n      var end = this._position + length;\n      for (var i = this._position; i < end; i++) {\n        str += String.fromCharCode(arr[i]);\n      }\n      this._position += length;\n      return str;\n    }\n    /**\n     * Read a 16 bit integer from the stream\n     * @return {number} the next 16 bit integer in the stream\n     */\n  }, {\n    key: \"readInt16\",\n    value: function readInt16() {\n      var val = new Int16Array(this.arrayBuffer, this._position, 1)[0];\n      this._position += 2; // one 16 bit int is 2 bytes\n      return val;\n    }\n    /**\n     * Read an unsigned 16 bit integer from the stream\n     * @return {number} the next unsigned 16 bit integer in the stream\n     */\n  }, {\n    key: \"readUint16\",\n    value: function readUint16() {\n      var val = new Uint16Array(this.arrayBuffer, this._position, 1)[0];\n      this._position += 2; // one 16 bit int is 2 bytes\n      return val;\n    }\n    /**\n     * Read a 32 bit integer from the stream\n     * @return {number} the next 32 bit integer in the stream\n     */\n  }, {\n    key: \"readInt32\",\n    value: function readInt32() {\n      var val;\n      if (this._position % 4 === 0) {\n        val = new Int32Array(this.arrayBuffer, this._position, 1)[0];\n      } else {\n        // Cannot read Int32 directly out because offset is not multiple of 4\n        // Need to slice out the values first\n        val = new Int32Array(this.arrayBuffer.slice(this._position, this._position + 4))[0];\n      }\n      this._position += 4; // one 32 bit int is 4 bytes\n      return val;\n    }\n    /**\n     * Read an unsigned 32 bit integer from the stream\n     * @return {number} the next unsigned 32 bit integer in the stream\n     */\n  }, {\n    key: \"readUint32\",\n    value: function readUint32() {\n      var val = new Uint32Array(this.arrayBuffer, this._position, 1)[0];\n      this._position += 4; // one 32 bit int is 4 bytes\n      return val;\n    }\n  }, {\n    key: \"position\",\n    get: function get() {\n      return this._position - this.start;\n    }\n    /**\n     * Set the position to read from in the arrayBuffer.\n     * @type {number}\n     * @param {number} value - new value to set position to\n     */\n    ,\n    set: function set(value) {\n      this._position = value + this.start;\n      return value;\n    }\n  }]);\n  return ArrayBufferStream;\n}();\nmodule.exports = ArrayBufferStream;\n })