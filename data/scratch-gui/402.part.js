/* 402 */\n (function(module, exports, __webpack_require__) {\n\"use strict\";\n(function(global, process) {// Copyright Joyent, Inc. and other Node contributors.\n//\n// Permission is hereby granted, free of charge, to any person obtaining a\n// copy of this software and associated documentation files (the\n// \"Software\"), to deal in the Software without restriction, including\n// without limitation the rights to use, copy, modify, merge, publish,\n// distribute, sublicense, and/or sell copies of the Software, and to permit\n// persons to whom the Software is furnished to do so, subject to the\n// following conditions:\n//\n// The above copyright notice and this permission notice shall be included\n// in all copies or substantial portions of the Software.\n//\n// THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS\n// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF\n// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN\n// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,\n// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR\n// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE\n// USE OR OTHER DEALINGS IN THE SOFTWARE.\n/*<replacement>*/\nvar pna = __webpack_require__(216);\n/*</replacement>*/\nmodule.exports = Readable;\n/*<replacement>*/\nvar isArray = __webpack_require__(399);\n/*</replacement>*/\n/*<replacement>*/\nvar Duplex;\n/*</replacement>*/\nReadable.ReadableState = ReadableState;\n/*<replacement>*/\nvar EE = __webpack_require__(91).EventEmitter;\nvar EElistenerCount = function (emitter, type) {\n  return emitter.listeners(type).length;\n};\n/*</replacement>*/\n/*<replacement>*/\nvar Stream = __webpack_require__(403);\n/*</replacement>*/\n/*<replacement>*/\nvar Buffer = __webpack_require__(217).Buffer;\nvar OurUint8Array = global.Uint8Array || function () {};\nfunction _uint8ArrayToBuffer(chunk) {\n  return Buffer.from(chunk);\n}\nfunction _isUint8Array(obj) {\n  return Buffer.isBuffer(obj) || obj instanceof OurUint8Array;\n}\n/*</replacement>*/\n/*<replacement>*/\nvar util = __webpack_require__(178);\nutil.inherits = __webpack_require__(92);\n/*</replacement>*/\n/*<replacement>*/\nvar debugUtil = __webpack_require__(912);\nvar debug = void 0;\nif (debugUtil && debugUtil.debuglog) {\n  debug = debugUtil.debuglog('stream');\n} else {\n  debug = function () {};\n}\n/*</replacement>*/\nvar BufferList = __webpack_require__(913);\nvar destroyImpl = __webpack_require__(404);\nvar StringDecoder;\nutil.inherits(Readable, Stream);\nvar kProxyEvents = ['error', 'close', 'destroy', 'pause', 'resume'];\nfunction prependListener(emitter, event, fn) {\n  // Sadly this is not cacheable as some libraries bundle their own\n  // event emitter implementation with them.\n  if (typeof emitter.prependListener === 'function') return emitter.prependListener(event, fn);\n  // This is a hack to make sure that our error handler is attached before any\n  // userland ones.  NEVER DO THIS. This is here only because this code needs\n  // to continue to work with older versions of Node.js that do not include\n  // the prependListener() method. The goal is to eventually remove this hack.\n  if (!emitter._events || !emitter._events[event]) emitter.on(event, fn);else if (isArray(emitter._events[event])) emitter._events[event].unshift(fn);else emitter._events[event] = [fn, emitter._events[event]];\n}\nfunction ReadableState(options, stream) {\n  Duplex = Duplex || __webpack_require__(134);\n  options = options || {};\n  // Duplex streams are both readable and writable, but share\n  // the same options object.\n  // However, some cases require setting options to different\n  // values for the readable and the writable sides of the duplex stream.\n  // These options can be provided separately as readableXXX and writableXXX.\n  var isDuplex = stream instanceof Duplex;\n  // object stream flag. Used to make read(n) ignore n and to\n  // make all the buffer merging and length checks go away\n  this.objectMode = !!options.objectMode;\n  if (isDuplex) this.objectMode = this.objectMode || !!options.readableObjectMode;\n  // the point at which it stops calling _read() to fill the buffer\n  // Note: 0 is a valid value, means \"don't call _read preemptively ever\"\n  var hwm = options.highWaterMark;\n  var readableHwm = options.readableHighWaterMark;\n  var defaultHwm = this.objectMode ? 16 : 16 * 1024;\n  if (hwm || hwm === 0) this.highWaterMark = hwm;else if (isDuplex && (readableHwm || readableHwm === 0)) this.highWaterMark = readableHwm;else this.highWaterMark = defaultHwm;\n  // cast to ints.\n  this.highWaterMark = Math.floor(this.highWaterMark);\n  // A linked list is used to store data chunks instead of an array because the\n  // linked list can remove elements from the beginning faster than\n  // array.shift()\n  this.buffer = new BufferList();\n  this.length = 0;\n  this.pipes = null;\n  this.pipesCount = 0;\n  this.flowing = null;\n  this.ended = false;\n  this.endEmitted = false;\n  this.reading = false;\n  // a flag to be able to tell if the event 'readable'/'data' is emitted\n  // immediately, or on a later tick.  We set this to true at first, because\n  // any actions that shouldn't happen until \"later\" should generally also\n  // not happen before the first read call.\n  this.sync = true;\n  // whenever we return null, then we set a flag to say\n  // that we're awaiting a 'readable' event emission.\n  this.needReadable = false;\n  this.emittedReadable = false;\n  this.readableListening = false;\n  this.resumeScheduled = false;\n  // has it been destroyed\n  this.destroyed = false;\n  // Crypto is kind of old and crusty.  Historically, its default string\n  // encoding is 'binary' so we have to make this configurable.\n  // Everything else in the universe uses 'utf8', though.\n  this.defaultEncoding = options.defaultEncoding || 'utf8';\n  // the number of writers that are awaiting a drain event in .pipe()s\n  this.awaitDrain = 0;\n  // if true, a maybeReadMore has been scheduled\n  this.readingMore = false;\n  this.decoder = null;\n  this.encoding = null;\n  if (options.encoding) {\n    if (!StringDecoder) StringDecoder = __webpack_require__(289).StringDecoder;\n    this.decoder = new StringDecoder(options.encoding);\n    this.encoding = options.encoding;\n  }\n}\nfunction Readable(options) {\n  Duplex = Duplex || __webpack_require__(134);\n  if (!(this instanceof Readable)) return new Readable(options);\n  this._readableState = new ReadableState(options, this);\n  // legacy\n  this.readable = true;\n  if (options) {\n    if (typeof options.read === 'function') this._read = options.read;\n    if (typeof options.destroy === 'function') this._destroy = options.destroy;\n  }\n  Stream.call(this);\n}\nObject.defineProperty(Readable.prototype, 'destroyed', {\n  get: function () {\n    if (this._readableState === undefined) {\n      return false;\n    }\n    return this._readableState.destroyed;\n  },\n  set: function (value) {\n    // we ignore the value if the stream\n    // has not been initialized yet\n    if (!this._readableState) {\n      return;\n    }\n    // backward compatibility, the user is explicitly\n    // managing destroyed\n    this._readableState.destroyed = value;\n  }\n});\nReadable.prototype.destroy = destroyImpl.destroy;\nReadable.prototype._undestroy = destroyImpl.undestroy;\nReadable.prototype._destroy = function (err, cb) {\n  this.push(null);\n  cb(err);\n};\n// Manually shove something into the read() buffer.\n// This returns true if the highWaterMark has not been hit yet,\n// similar to how Writable.write() returns true if you should\n// write() some more.\nReadable.prototype.push = function (chunk, encoding) {\n  var state = this._readableState;\n  var skipChunkCheck;\n  if (!state.objectMode) {\n    if (typeof chunk === 'string') {\n      encoding = encoding || state.defaultEncoding;\n      if (encoding !== state.encoding) {\n        chunk = Buffer.from(chunk, encoding);\n        encoding = '';\n      }\n      skipChunkCheck = true;\n    }\n  } else {\n    skipChunkCheck = true;\n  }\n  return readableAddChunk(this, chunk, encoding, false, skipChunkCheck);\n};\n// Unshift should *always* be something directly out of read()\nReadable.prototype.unshift = function (chunk) {\n  return readableAddChunk(this, chunk, null, true, false);\n};\nfunction readableAddChunk(stream, chunk, encoding, addToFront, skipChunkCheck) {\n  var state = stream._readableState;\n  if (chunk === null) {\n    state.reading = false;\n    onEofChunk(stream, state);\n  } else {\n    var er;\n    if (!skipChunkCheck) er = chunkInvalid(state, chunk);\n    if (er) {\n      stream.emit('error', er);\n    } else if (state.objectMode || chunk && chunk.length > 0) {\n      if (typeof chunk !== 'string' && !state.objectMode && Object.getPrototypeOf(chunk) !== Buffer.prototype) {\n        chunk = _uint8ArrayToBuffer(chunk);\n      }\n      if (addToFront) {\n        if (state.endEmitted) stream.emit('error', new Error('stream.unshift() after end event'));else addChunk(stream, state, chunk, true);\n      } else if (state.ended) {\n        stream.emit('error', new Error('stream.push() after EOF'));\n      } else {\n        state.reading = false;\n        if (state.decoder && !encoding) {\n          chunk = state.decoder.write(chunk);\n          if (state.objectMode || chunk.length !== 0) addChunk(stream, state, chunk, false);else maybeReadMore(stream, state);\n        } else {\n          addChunk(stream, state, chunk, false);\n        }\n      }\n    } else if (!addToFront) {\n      state.reading = false;\n    }\n  }\n  return needMoreData(state);\n}\nfunction addChunk(stream, state, chunk, addToFront) {\n  if (state.flowing && state.length === 0 && !state.sync) {\n    stream.emit('data', chunk);\n    stream.read(0);\n  } else {\n    // update the buffer info.\n    state.length += state.objectMode ? 1 : chunk.length;\n    if (addToFront) state.buffer.unshift(chunk);else state.buffer.push(chunk);\n    if (state.needReadable) emitReadable(stream);\n  }\n  maybeReadMore(stream, state);\n}\nfunction chunkInvalid(state, chunk) {\n  var er;\n  if (!_isUint8Array(chunk) && typeof chunk !== 'string' && chunk !== undefined && !state.objectMode) {\n    er = new TypeError('Invalid non-string/buffer chunk');\n  }\n  return er;\n}\n// if it's past the high water mark, we can push in some more.\n// Also, if we have no data yet, we can stand some\n// more bytes.  This is to work around cases where hwm=0,\n// such as the repl.  Also, if the push() triggered a\n// readable event, and the user called read(largeNumber) such that\n// needReadable was set, then we ought to push more, so that another\n// 'readable' event will be triggered.\nfunction needMoreData(state) {\n  return !state.ended && (state.needReadable || state.length < state.highWaterMark || state.length === 0);\n}\nReadable.prototype.isPaused = function () {\n  return this._readableState.flowing === false;\n};\n// backwards compatibility.\nReadable.prototype.setEncoding = function (enc) {\n  if (!StringDecoder) StringDecoder = __webpack_require__(289).StringDecoder;\n  this._readableState.decoder = new StringDecoder(enc);\n  this._readableState.encoding = enc;\n  return this;\n};\n// Don't raise the hwm > 8MB\nvar MAX_HWM = 0x800000;\nfunction computeNewHighWaterMark(n) {\n  if (n >= MAX_HWM) {\n    n = MAX_HWM;\n  } else {\n    // Get the next highest power of 2 to prevent increasing hwm excessively in\n    // tiny amounts\n    n--;\n    n |= n >>> 1;\n    n |= n >>> 2;\n    n |= n >>> 4;\n    n |= n >>> 8;\n    n |= n >>> 16;\n    n++;\n  }\n  return n;\n}\n// This function is designed to be inlinable, so please take care when making\n// changes to the function body.\nfunction howMuchToRead(n, state) {\n  if (n <= 0 || state.length === 0 && state.ended) return 0;\n  if (state.objectMode) return 1;\n  if (n !== n) {\n    // Only flow one buffer at a time\n    if (state.flowing && state.length) return state.buffer.head.data.length;else return state.length;\n  }\n  // If we're asking for more than the current hwm, then raise the hwm.\n  if (n > state.highWaterMark) state.highWaterMark = computeNewHighWaterMark(n);\n  if (n <= state.length) return n;\n  // Don't have enough\n  if (!state.ended) {\n    state.needReadable = true;\n    return 0;\n  }\n  return state.length;\n}\n// you can override either this method, or the async _read(n) below.\nReadable.prototype.read = function (n) {\n  debug('read', n);\n  n = parseInt(n, 10);\n  var state = this._readableState;\n  var nOrig = n;\n  if (n !== 0) state.emittedReadable = false;\n  // if we're doing read(0) to trigger a readable event, but we\n  // already have a bunch of data in the buffer, then just trigger\n  // the 'readable' event and move on.\n  if (n === 0 && state.needReadable && (state.length >= state.highWaterMark || state.ended)) {\n    debug('read: emitReadable', state.length, state.ended);\n    if (state.length === 0 && state.ended) endReadable(this);else emitReadable(this);\n    return null;\n  }\n  n = howMuchToRead(n, state);\n  // if we've ended, and we're now clear, then finish it up.\n  if (n === 0 && state.ended) {\n    if (state.length === 0) endReadable(this);\n    return null;\n  }\n  // All the actual chunk generation logic needs to be\n  // *below* the call to _read.  The reason is that in certain\n  // synthetic stream cases, such as passthrough streams, _read\n  // may be a completely synchronous operation which may change\n  // the state of the read buffer, providing enough data when\n  // before there was *not* enough.\n  //\n  // So, the steps are:\n  // 1. Figure out what the state of things will be after we do\n  // a read from the buffer.\n  //\n  // 2. If that resulting state will trigger a _read, then call _read.\n  // Note that this may be asynchronous, or synchronous.  Yes, it is\n  // deeply ugly to write APIs this way, but that still doesn't mean\n  // that the Readable class should behave improperly, as streams are\n  // designed to be sync/async agnostic.\n  // Take note if the _read call is sync or async (ie, if the read call\n  // has returned yet), so that we know whether or not it's safe to emit\n  // 'readable' etc.\n  //\n  // 3. Actually pull the requested chunks out of the buffer and return.\n  // if we need a readable event, then we need to do some reading.\n  var doRead = state.needReadable;\n  debug('need readable', doRead);\n  // if we currently have less than the highWaterMark, then also read some\n  if (state.length === 0 || state.length - n < state.highWaterMark) {\n    doRead = true;\n    debug('length less than watermark', doRead);\n  }\n  // however, if we've ended, then there's no point, and if we're already\n  // reading, then it's unnecessary.\n  if (state.ended || state.reading) {\n    doRead = false;\n    debug('reading or ended', doRead);\n  } else if (doRead) {\n    debug('do read');\n    state.reading = true;\n    state.sync = true;\n    // if the length is currently zero, then we *need* a readable event.\n    if (state.length === 0) state.needReadable = true;\n    // call internal read method\n    this._read(state.highWaterMark);\n    state.sync = false;\n    // If _read pushed data synchronously, then `reading` will be false,\n    // and we need to re-evaluate how much data we can return to the user.\n    if (!state.reading) n = howMuchToRead(nOrig, state);\n  }\n  var ret;\n  if (n > 0) ret = fromList(n, state);else ret = null;\n  if (ret === null) {\n    state.needReadable = true;\n    n = 0;\n  } else {\n    state.length -= n;\n  }\n  if (state.length === 0) {\n    // If we have nothing in the buffer, then we want to know\n    // as soon as we *do* get something into the buffer.\n    if (!state.ended) state.needReadable = true;\n    // If we tried to read() past the EOF, then emit end on the next tick.\n    if (nOrig !== n && state.ended) endReadable(this);\n  }\n  if (ret !== null) this.emit('data', ret);\n  return ret;\n};\nfunction onEofChunk(stream, state) {\n  if (state.ended) return;\n  if (state.decoder) {\n    var chunk = state.decoder.end();\n    if (chunk && chunk.length) {\n      state.buffer.push(chunk);\n      state.length += state.objectMode ? 1 : chunk.length;\n    }\n  }\n  state.ended = true;\n  // emit 'readable' now to make sure it gets picked up.\n  emitReadable(stream);\n}\n// Don't emit readable right away in sync mode, because this can trigger\n// another read() call => stack overflow.  This way, it might trigger\n// a nextTick recursion warning, but that's not so bad.\nfunction emitReadable(stream) {\n  var state = stream._readableState;\n  state.needReadable = false;\n  if (!state.emittedReadable) {\n    debug('emitReadable', state.flowing);\n    state.emittedReadable = true;\n    if (state.sync) pna.nextTick(emitReadable_, stream);else emitReadable_(stream);\n  }\n}\nfunction emitReadable_(stream) {\n  debug('emit readable');\n  stream.emit('readable');\n  flow(stream);\n}\n// at this point, the user has presumably seen the 'readable' event,\n// and called read() to consume some data.  that may have triggered\n// in turn another _read(n) call, in which case reading = true if\n// it's in progress.\n// However, if we're not ended, or reading, and the length < hwm,\n// then go ahead and try to read some more preemptively.\nfunction maybeReadMore(stream, state) {\n  if (!state.readingMore) {\n    state.readingMore = true;\n    pna.nextTick(maybeReadMore_, stream, state);\n  }\n}\nfunction maybeReadMore_(stream, state) {\n  var len = state.length;\n  while (!state.reading && !state.flowing && !state.ended && state.length < state.highWaterMark) {\n    debug('maybeReadMore read 0');\n    stream.read(0);\n    if (len === state.length)\n      // didn't get any data, stop spinning.\n      break;else len = state.length;\n  }\n  state.readingMore = false;\n}\n// abstract method.  to be overridden in specific implementation classes.\n// call cb(er, data) where data is <= n in length.\n// for virtual (non-string, non-buffer) streams, \"length\" is somewhat\n// arbitrary, and perhaps not very meaningful.\nReadable.prototype._read = function (n) {\n  this.emit('error', new Error('_read() is not implemented'));\n};\nReadable.prototype.pipe = function (dest, pipeOpts) {\n  var src = this;\n  var state = this._readableState;\n  switch (state.pipesCount) {\n    case 0:\n      state.pipes = dest;\n      break;\n    case 1:\n      state.pipes = [state.pipes, dest];\n      break;\n    default:\n      state.pipes.push(dest);\n      break;\n  }\n  state.pipesCount += 1;\n  debug('pipe count=%d opts=%j', state.pipesCount, pipeOpts);\n  var doEnd = (!pipeOpts || pipeOpts.end !== false) && dest !== process.stdout && dest !== process.stderr;\n  var endFn = doEnd ? onend : unpipe;\n  if (state.endEmitted) pna.nextTick(endFn);else src.once('end', endFn);\n  dest.on('unpipe', onunpipe);\n  function onunpipe(readable, unpipeInfo) {\n    debug('onunpipe');\n    if (readable === src) {\n      if (unpipeInfo && unpipeInfo.hasUnpiped === false) {\n        unpipeInfo.hasUnpiped = true;\n        cleanup();\n      }\n    }\n  }\n  function onend() {\n    debug('onend');\n    dest.end();\n  }\n  // when the dest drains, it reduces the awaitDrain counter\n  // on the source.  This would be more elegant with a .once()\n  // handler in flow(), but adding and removing repeatedly is\n  // too slow.\n  var ondrain = pipeOnDrain(src);\n  dest.on('drain', ondrain);\n  var cleanedUp = false;\n  function cleanup() {\n    debug('cleanup');\n    // cleanup event handlers once the pipe is broken\n    dest.removeListener('close', onclose);\n    dest.removeListener('finish', onfinish);\n    dest.removeListener('drain', ondrain);\n    dest.removeListener('error', onerror);\n    dest.removeListener('unpipe', onunpipe);\n    src.removeListener('end', onend);\n    src.removeListener('end', unpipe);\n    src.removeListener('data', ondata);\n    cleanedUp = true;\n    // if the reader is waiting for a drain event from this\n    // specific writer, then it would cause it to never start\n    // flowing again.\n    // So, if this is awaiting a drain, then we just call it now.\n    // If we don't know, then assume that we are waiting for one.\n    if (state.awaitDrain && (!dest._writableState || dest._writableState.needDrain)) ondrain();\n  }\n  // If the user pushes more data while we're writing to dest then we'll end up\n  // in ondata again. However, we only want to increase awaitDrain once because\n  // dest will only emit one 'drain' event for the multiple writes.\n  // => Introduce a guard on increasing awaitDrain.\n  var increasedAwaitDrain = false;\n  src.on('data', ondata);\n  function ondata(chunk) {\n    debug('ondata');\n    increasedAwaitDrain = false;\n    var ret = dest.write(chunk);\n    if (false === ret && !increasedAwaitDrain) {\n      // If the user unpiped during `dest.write()`, it is possible\n      // to get stuck in a permanently paused state if that write\n      // also returned false.\n      // => Check whether `dest` is still a piping destination.\n      if ((state.pipesCount === 1 && state.pipes === dest || state.pipesCount > 1 && indexOf(state.pipes, dest) !== -1) && !cleanedUp) {\n        debug('false write response, pause', src._readableState.awaitDrain);\n        src._readableState.awaitDrain++;\n        increasedAwaitDrain = true;\n      }\n      src.pause();\n    }\n  }\n  // if the dest has an error, then stop piping into it.\n  // however, don't suppress the throwing behavior for this.\n  function onerror(er) {\n    debug('onerror', er);\n    unpipe();\n    dest.removeListener('error', onerror);\n    if (EElistenerCount(dest, 'error') === 0) dest.emit('error', er);\n  }\n  // Make sure our error handler is attached before userland ones.\n  prependListener(dest, 'error', onerror);\n  // Both close and finish should trigger unpipe, but only once.\n  function onclose() {\n    dest.removeListener('finish', onfinish);\n    unpipe();\n  }\n  dest.once('close', onclose);\n  function onfinish() {\n    debug('onfinish');\n    dest.removeListener('close', onclose);\n    unpipe();\n  }\n  dest.once('finish', onfinish);\n  function unpipe() {\n    debug('unpipe');\n    src.unpipe(dest);\n  }\n  // tell the dest that it's being piped to\n  dest.emit('pipe', src);\n  // start the flow if it hasn't been started already.\n  if (!state.flowing) {\n    debug('pipe resume');\n    src.resume();\n  }\n  return dest;\n};\nfunction pipeOnDrain(src) {\n  return function () {\n    var state = src._readableState;\n    debug('pipeOnDrain', state.awaitDrain);\n    if (state.awaitDrain) state.awaitDrain--;\n    if (state.awaitDrain === 0 && EElistenerCount(src, 'data')) {\n      state.flowing = true;\n      flow(src);\n    }\n  };\n}\nReadable.prototype.unpipe = function (dest) {\n  var state = this._readableState;\n  var unpipeInfo = { hasUnpiped: false };\n  // if we're not piping anywhere, then do nothing.\n  if (state.pipesCount === 0) return this;\n  // just one destination.  most common case.\n  if (state.pipesCount === 1) {\n    // passed in one, but it's not the right one.\n    if (dest && dest !== state.pipes) return this;\n    if (!dest) dest = state.pipes;\n    // got a match.\n    state.pipes = null;\n    state.pipesCount = 0;\n    state.flowing = false;\n    if (dest) dest.emit('unpipe', this, unpipeInfo);\n    return this;\n  }\n  // slow case. multiple pipe destinations.\n  if (!dest) {\n    // remove all.\n    var dests = state.pipes;\n    var len = state.pipesCount;\n    state.pipes = null;\n    state.pipesCount = 0;\n    state.flowing = false;\n    for (var i = 0; i < len; i++) {\n      dests[i].emit('unpipe', this, unpipeInfo);\n    }return this;\n  }\n  // try to find the right one.\n  var index = indexOf(state.pipes, dest);\n  if (index === -1) return this;\n  state.pipes.splice(index, 1);\n  state.pipesCount -= 1;\n  if (state.pipesCount === 1) state.pipes = state.pipes[0];\n  dest.emit('unpipe', this, unpipeInfo);\n  return this;\n};\n// set up data events if they are asked for\n// Ensure readable listeners eventually get something\nReadable.prototype.on = function (ev, fn) {\n  var res = Stream.prototype.on.call(this, ev, fn);\n  if (ev === 'data') {\n    // Start flowing on next tick if stream isn't explicitly paused\n    if (this._readableState.flowing !== false) this.resume();\n  } else if (ev === 'readable') {\n    var state = this._readableState;\n    if (!state.endEmitted && !state.readableListening) {\n      state.readableListening = state.needReadable = true;\n      state.emittedReadable = false;\n      if (!state.reading) {\n        pna.nextTick(nReadingNextTick, this);\n      } else if (state.length) {\n        emitReadable(this);\n      }\n    }\n  }\n  return res;\n};\nReadable.prototype.addListener = Readable.prototype.on;\nfunction nReadingNextTick(self) {\n  debug('readable nexttick read 0');\n  self.read(0);\n}\n// pause() and resume() are remnants of the legacy readable stream API\n// If the user uses them, then switch into old mode.\nReadable.prototype.resume = function () {\n  var state = this._readableState;\n  if (!state.flowing) {\n    debug('resume');\n    state.flowing = true;\n    resume(this, state);\n  }\n  return this;\n};\nfunction resume(stream, state) {\n  if (!state.resumeScheduled) {\n    state.resumeScheduled = true;\n    pna.nextTick(resume_, stream, state);\n  }\n}\nfunction resume_(stream, state) {\n  if (!state.reading) {\n    debug('resume read 0');\n    stream.read(0);\n  }\n  state.resumeScheduled = false;\n  state.awaitDrain = 0;\n  stream.emit('resume');\n  flow(stream);\n  if (state.flowing && !state.reading) stream.read(0);\n}\nReadable.prototype.pause = function () {\n  debug('call pause flowing=%j', this._readableState.flowing);\n  if (false !== this._readableState.flowing) {\n    debug('pause');\n    this._readableState.flowing = false;\n    this.emit('pause');\n  }\n  return this;\n};\nfunction flow(stream) {\n  var state = stream._readableState;\n  debug('flow', state.flowing);\n  while (state.flowing && stream.read() !== null) {}\n}\n// wrap an old-style stream as the async data source.\n// This is *not* part of the readable stream interface.\n// It is an ugly unfortunate mess of history.\nReadable.prototype.wrap = function (stream) {\n  var _this = this;\n  var state = this._readableState;\n  var paused = false;\n  stream.on('end', function () {\n    debug('wrapped end');\n    if (state.decoder && !state.ended) {\n      var chunk = state.decoder.end();\n      if (chunk && chunk.length) _this.push(chunk);\n    }\n    _this.push(null);\n  });\n  stream.on('data', function (chunk) {\n    debug('wrapped data');\n    if (state.decoder) chunk = state.decoder.write(chunk);\n    // don't skip over falsy values in objectMode\n    if (state.objectMode && (chunk === null || chunk === undefined)) return;else if (!state.objectMode && (!chunk || !chunk.length)) return;\n    var ret = _this.push(chunk);\n    if (!ret) {\n      paused = true;\n      stream.pause();\n    }\n  });\n  // proxy all the other methods.\n  // important when wrapping filters and duplexes.\n  for (var i in stream) {\n    if (this[i] === undefined && typeof stream[i] === 'function') {\n      this[i] = function (method) {\n        return function () {\n          return stream[method].apply(stream, arguments);\n        };\n      }(i);\n    }\n  }\n  // proxy certain important events.\n  for (var n = 0; n < kProxyEvents.length; n++) {\n    stream.on(kProxyEvents[n], this.emit.bind(this, kProxyEvents[n]));\n  }\n  // when we try to consume some more bytes, simply unpause the\n  // underlying stream.\n  this._read = function (n) {\n    debug('wrapped _read', n);\n    if (paused) {\n      paused = false;\n      stream.resume();\n    }\n  };\n  return this;\n};\nObject.defineProperty(Readable.prototype, 'readableHighWaterMark', {\n  // making it explicit this property is not enumerable\n  // because otherwise some prototype manipulation in\n  // userland will fail\n  enumerable: false,\n  get: function () {\n    return this._readableState.highWaterMark;\n  }\n});\n// exposed for testing purposes only.\nReadable._fromList = fromList;\n// Pluck off n bytes from an array of buffers.\n// Length is the combined lengths of all the buffers in the list.\n// This function is designed to be inlinable, so please take care when making\n// changes to the function body.\nfunction fromList(n, state) {\n  // nothing buffered\n  if (state.length === 0) return null;\n  var ret;\n  if (state.objectMode) ret = state.buffer.shift();else if (!n || n >= state.length) {\n    // read it all, truncate the list\n    if (state.decoder) ret = state.buffer.join('');else if (state.buffer.length === 1) ret = state.buffer.head.data;else ret = state.buffer.concat(state.length);\n    state.buffer.clear();\n  } else {\n    // read part of list\n    ret = fromListPartial(n, state.buffer, state.decoder);\n  }\n  return ret;\n}\n// Extracts only enough buffered data to satisfy the amount requested.\n// This function is designed to be inlinable, so please take care when making\n// changes to the function body.\nfunction fromListPartial(n, list, hasStrings) {\n  var ret;\n  if (n < list.head.data.length) {\n    // slice is the same for buffers and strings\n    ret = list.head.data.slice(0, n);\n    list.head.data = list.head.data.slice(n);\n  } else if (n === list.head.data.length) {\n    // first chunk is a perfect match\n    ret = list.shift();\n  } else {\n    // result spans more than one buffer\n    ret = hasStrings ? copyFromBufferString(n, list) : copyFromBuffer(n, list);\n  }\n  return ret;\n}\n// Copies a specified amount of characters from the list of buffered data\n// chunks.\n// This function is designed to be inlinable, so please take care when making\n// changes to the function body.\nfunction copyFromBufferString(n, list) {\n  var p = list.head;\n  var c = 1;\n  var ret = p.data;\n  n -= ret.length;\n  while (p = p.next) {\n    var str = p.data;\n    var nb = n > str.length ? str.length : n;\n    if (nb === str.length) ret += str;else ret += str.slice(0, n);\n    n -= nb;\n    if (n === 0) {\n      if (nb === str.length) {\n        ++c;\n        if (p.next) list.head = p.next;else list.head = list.tail = null;\n      } else {\n        list.head = p;\n        p.data = str.slice(nb);\n      }\n      break;\n    }\n    ++c;\n  }\n  list.length -= c;\n  return ret;\n}\n// Copies a specified amount of bytes from the list of buffered data chunks.\n// This function is designed to be inlinable, so please take care when making\n// changes to the function body.\nfunction copyFromBuffer(n, list) {\n  var ret = Buffer.allocUnsafe(n);\n  var p = list.head;\n  var c = 1;\n  p.data.copy(ret);\n  n -= p.data.length;\n  while (p = p.next) {\n    var buf = p.data;\n    var nb = n > buf.length ? buf.length : n;\n    buf.copy(ret, ret.length - n, 0, nb);\n    n -= nb;\n    if (n === 0) {\n      if (nb === buf.length) {\n        ++c;\n        if (p.next) list.head = p.next;else list.head = list.tail = null;\n      } else {\n        list.head = p;\n        p.data = buf.slice(nb);\n      }\n      break;\n    }\n    ++c;\n  }\n  list.length -= c;\n  return ret;\n}\nfunction endReadable(stream) {\n  var state = stream._readableState;\n  // If we get here before consuming all the bytes, then that is a\n  // bug in node.  Should never happen.\n  if (state.length > 0) throw new Error('\"endReadable()\" called on non-empty stream');\n  if (!state.endEmitted) {\n    state.ended = true;\n    pna.nextTick(endReadableNT, state, stream);\n  }\n}\nfunction endReadableNT(state, stream) {\n  // Check that we didn't get one last unshift.\n  if (!state.endEmitted && state.length === 0) {\n    state.endEmitted = true;\n    stream.readable = false;\n    stream.emit('end');\n  }\n}\nfunction indexOf(xs, x) {\n  for (var i = 0, l = xs.length; i < l; i++) {\n    if (xs[i] === x) return i;\n  }\n  return -1;\n}\n}.call(this, __webpack_require__(44), __webpack_require__(93)))\n })