/* 466 */
 (function(module, exports, __webpack_require__) {
"use strict";
eval("// Copyright Joyent, Inc. and other Node contributors.\n//\n// Permission is hereby granted, free of charge, to any person obtaining a\n// copy of this software and associated documentation files (the\n// \"Software\"), to deal in the Software without restriction, including\n// without limitation the rights to use, copy, modify, merge, publish,\n// distribute, sublicense, and/or sell copies of the Software, and to permit\n// persons to whom the Software is furnished to do so, subject to the\n// following conditions:\n//\n// The above copyright notice and this permission notice shall be included\n// in all copies or substantial portions of the Software.\n//\n// THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS\n// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF\n// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN\n// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,\n// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR\n// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE\n// USE OR OTHER DEALINGS IN THE SOFTWARE.\n// a duplex stream is just a stream that is both readable and writable.\n// Since JS doesn't have multiple prototypal inheritance, this class\n// prototypally inherits from Readable, and then parasitically from\n// Writable.\n/*<replacement>*/\nvar pna = __webpack_require__(556);\n/*</replacement>*/\n/*<replacement>*/\nvar objectKeys = Object.keys || function (obj) {\n  var keys = [];\n  for (var key in obj) {\n    keys.push(key);\n  }return keys;\n};\n/*</replacement>*/\nmodule.exports = Duplex;\n/*<replacement>*/\nvar util = Object.create(__webpack_require__(488));\nutil.inherits = __webpack_require__(471);\n/*</replacement>*/\nvar Readable = __webpack_require__(813);\nvar Writable = __webpack_require__(722);\nutil.inherits(Duplex, Readable);\n{\n  // avoid scope creep, the keys array can then be collected\n  var keys = objectKeys(Writable.prototype);\n  for (var v = 0; v < keys.length; v++) {\n    var method = keys[v];\n    if (!Duplex.prototype[method]) Duplex.prototype[method] = Writable.prototype[method];\n  }\n}\nfunction Duplex(options) {\n  if (!(this instanceof Duplex)) return new Duplex(options);\n  Readable.call(this, options);\n  Writable.call(this, options);\n  if (options && options.readable === false) this.readable = false;\n  if (options && options.writable === false) this.writable = false;\n  this.allowHalfOpen = true;\n  if (options && options.allowHalfOpen === false) this.allowHalfOpen = false;\n  this.once('end', onend);\n}\nObject.defineProperty(Duplex.prototype, 'writableHighWaterMark', {\n  // making it explicit this property is not enumerable\n  // because otherwise some prototype manipulation in\n  // userland will fail\n  enumerable: false,\n  get: function () {\n    return this._writableState.highWaterMark;\n  }\n});\n// the no-half-open enforcer\nfunction onend() {\n  // if we allow half-open state, or if the writable side ended,\n  // then we're ok.\n  if (this.allowHalfOpen || this._writableState.ended) return;\n  // no more data can be written.\n  // But allow more writes to happen in this tick.\n  pna.nextTick(onEndNT, this);\n}\nfunction onEndNT(self) {\n  self.end();\n}\nObject.defineProperty(Duplex.prototype, 'destroyed', {\n  get: function () {\n    if (this._readableState === undefined || this._writableState === undefined) {\n      return false;\n    }\n    return this._readableState.destroyed && this._writableState.destroyed;\n  },\n  set: function (value) {\n    // we ignore the value if the stream\n    // has not been initialized yet\n    if (this._readableState === undefined || this._writableState === undefined) {\n      return;\n    }\n    // backward compatibility, the user is explicitly\n    // managing destroyed\n    this._readableState.destroyed = value;\n    this._writableState.destroyed = value;\n  }\n});\nDuplex.prototype._destroy = function (err, cb) {\n  this.push(null);\n  this.end();\n  pna.nextTick(cb, err);\n};\n// ./~/readable-stream/lib/_stream_duplex.js\n// module id = 466\n// module chunks = 0\n//# sourceURL=scratch:///./~/readable-stream/lib/_stream_duplex.js?");
 })