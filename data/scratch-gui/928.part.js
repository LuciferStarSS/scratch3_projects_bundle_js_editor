/* 928 */\n (function(module, exports, __webpack_require__) {\n\"use strict\";\nvar USE_TYPEDARRAY = (typeof Uint8Array !== 'undefined') && (typeof Uint16Array !== 'undefined') && (typeof Uint32Array !== 'undefined');\nvar pako = __webpack_require__(415);\nvar utils = __webpack_require__(42);\nvar GenericWorker = __webpack_require__(76);\nvar ARRAY_TYPE = USE_TYPEDARRAY ? \"uint8array\" : \"array\";\nexports.magic = \"\\x08\\x00\";\n/**\n * Create a worker that uses pako to inflate/deflate.\n * @constructor\n * @param {String} action the name of the pako function to call : either \"Deflate\" or \"Inflate\".\n * @param {Object} options the options to use when (de)compressing.\n */\nfunction FlateWorker(action, options) {\n    GenericWorker.call(this, \"FlateWorker/\" + action);\n    this._pako = null;\n    this._pakoAction = action;\n    this._pakoOptions = options;\n    // the `meta` object from the last chunk received\n    // this allow this worker to pass around metadata\n    this.meta = {};\n}\nutils.inherits(FlateWorker, GenericWorker);\n/**\n * @see GenericWorker.processChunk\n */\nFlateWorker.prototype.processChunk = function (chunk) {\n    this.meta = chunk.meta;\n    if (this._pako === null) {\n        this._createPako();\n    }\n    this._pako.push(utils.transformTo(ARRAY_TYPE, chunk.data), false);\n};\n/**\n * @see GenericWorker.flush\n */\nFlateWorker.prototype.flush = function () {\n    GenericWorker.prototype.flush.call(this);\n    if (this._pako === null) {\n        this._createPako();\n    }\n    this._pako.push([], true);\n};\n/**\n * @see GenericWorker.cleanUp\n */\nFlateWorker.prototype.cleanUp = function () {\n    GenericWorker.prototype.cleanUp.call(this);\n    this._pako = null;\n};\n/**\n * Create the _pako object.\n * TODO: lazy-loading this object isn't the best solution but it's the\n * quickest. The best solution is to lazy-load the worker list. See also the\n * issue #446.\n */\nFlateWorker.prototype._createPako = function () {\n    this._pako = new pako[this._pakoAction]({\n        raw: true,\n        level: this._pakoOptions.level || -1 // default compression\n    });\n    var self = this;\n    this._pako.onData = function(data) {\n        self.push({\n            data : data,\n            meta : self.meta\n        });\n    };\n};\nexports.compressWorker = function (compressionOptions) {\n    return new FlateWorker(\"Deflate\", compressionOptions);\n};\nexports.uncompressWorker = function () {\n    return new FlateWorker(\"Inflate\", {});\n};\n })