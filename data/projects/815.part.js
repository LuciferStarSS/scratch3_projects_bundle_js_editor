/* 815 */
 (function(module, exports, __webpack_require__) {
"use strict";
eval("\n/*<replacement>*/\nvar pna = __webpack_require__(556);\n/*</replacement>*/\n// undocumented cb() API, needed for core, not for public API\nfunction destroy(err, cb) {\n  var _this = this;\n  var readableDestroyed = this._readableState && this._readableState.destroyed;\n  var writableDestroyed = this._writableState && this._writableState.destroyed;\n  if (readableDestroyed || writableDestroyed) {\n    if (cb) {\n      cb(err);\n    } else if (err && (!this._writableState || !this._writableState.errorEmitted)) {\n      pna.nextTick(emitErrorNT, this, err);\n    }\n    return this;\n  }\n  // we set destroyed to true before firing error callbacks in order\n  // to make it re-entrance safe in case destroy() is called within callbacks\n  if (this._readableState) {\n    this._readableState.destroyed = true;\n  }\n  // if this is a duplex stream mark the writable part as destroyed as well\n  if (this._writableState) {\n    this._writableState.destroyed = true;\n  }\n  this._destroy(err || null, function (err) {\n    if (!cb && err) {\n      pna.nextTick(emitErrorNT, _this, err);\n      if (_this._writableState) {\n        _this._writableState.errorEmitted = true;\n      }\n    } else if (cb) {\n      cb(err);\n    }\n  });\n  return this;\n}\nfunction undestroy() {\n  if (this._readableState) {\n    this._readableState.destroyed = false;\n    this._readableState.reading = false;\n    this._readableState.ended = false;\n    this._readableState.endEmitted = false;\n  }\n  if (this._writableState) {\n    this._writableState.destroyed = false;\n    this._writableState.ended = false;\n    this._writableState.ending = false;\n    this._writableState.finished = false;\n    this._writableState.errorEmitted = false;\n  }\n}\nfunction emitErrorNT(self, err) {\n  self.emit('error', err);\n}\nmodule.exports = {\n  destroy: destroy,\n  undestroy: undestroy\n};\n// ./~/readable-stream/lib/internal/streams/destroy.js\n// module id = 815\n// module chunks = 0\n//# sourceURL=scratch:///./~/readable-stream/lib/internal/streams/destroy.js?");
 })