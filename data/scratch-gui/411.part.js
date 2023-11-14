/* 411 */\n (function(module, exports, __webpack_require__) {\n\"use strict\";\nvar utils = __webpack_require__(42);\nvar GenericWorker = __webpack_require__(76);\n// the size of the generated chunks\n// TODO expose this as a public variable\nvar DEFAULT_BLOCK_SIZE = 16 * 1024;\n/**\n * A worker that reads a content and emits chunks.\n * @constructor\n * @param {Promise} dataP the promise of the data to split\n */\nfunction DataWorker(dataP) {\n    GenericWorker.call(this, \"DataWorker\");\n    var self = this;\n    this.dataIsReady = false;\n    this.index = 0;\n    this.max = 0;\n    this.data = null;\n    this.type = \"\";\n    this._tickScheduled = false;\n    dataP.then(function (data) {\n        self.dataIsReady = true;\n        self.data = data;\n        self.max = data && data.length || 0;\n        self.type = utils.getTypeOf(data);\n        if(!self.isPaused) {\n            self._tickAndRepeat();\n        }\n    }, function (e) {\n        self.error(e);\n    });\n}\nutils.inherits(DataWorker, GenericWorker);\n/**\n * @see GenericWorker.cleanUp\n */\nDataWorker.prototype.cleanUp = function () {\n    GenericWorker.prototype.cleanUp.call(this);\n    this.data = null;\n};\n/**\n * @see GenericWorker.resume\n */\nDataWorker.prototype.resume = function () {\n    if(!GenericWorker.prototype.resume.call(this)) {\n        return false;\n    }\n    if (!this._tickScheduled && this.dataIsReady) {\n        this._tickScheduled = true;\n        utils.delay(this._tickAndRepeat, [], this);\n    }\n    return true;\n};\n/**\n * Trigger a tick a schedule an other call to this function.\n */\nDataWorker.prototype._tickAndRepeat = function() {\n    this._tickScheduled = false;\n    if(this.isPaused || this.isFinished) {\n        return;\n    }\n    this._tick();\n    if(!this.isFinished) {\n        utils.delay(this._tickAndRepeat, [], this);\n        this._tickScheduled = true;\n    }\n};\n/**\n * Read and push a chunk.\n */\nDataWorker.prototype._tick = function() {\n    if(this.isPaused || this.isFinished) {\n        return false;\n    }\n    var size = DEFAULT_BLOCK_SIZE;\n    var data = null, nextIndex = Math.min(this.max, this.index + size);\n    if (this.index >= this.max) {\n        // EOF\n        return this.end();\n    } else {\n        switch(this.type) {\n            case \"string\":\n                data = this.data.substring(this.index, nextIndex);\n            break;\n            case \"uint8array\":\n                data = this.data.subarray(this.index, nextIndex);\n            break;\n            case \"array\":\n            case \"nodebuffer\":\n                data = this.data.slice(this.index, nextIndex);\n            break;\n        }\n        this.index = nextIndex;\n        return this.push({\n            data : data,\n            meta : {\n                percent : this.max ? this.index / this.max * 100 : 0\n            }\n        });\n    }\n};\nmodule.exports = DataWorker;\n })