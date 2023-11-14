/* 77 */\n (function(module, exports, __webpack_require__) {\n\"use strict\";\n/**\n * A worker that does nothing but passing chunks to the next one. This is like\n * a nodejs stream but with some differences. On the good side :\n * - it works on IE 6-9 without any issue / polyfill\n * - it weights less than the full dependencies bundled with browserify\n * - it forwards errors (no need to declare an error handler EVERYWHERE)\n *\n * A chunk is an object with 2 attributes : `meta` and `data`. The former is an\n * object containing anything (`percent` for example), see each worker for more\n * details. The latter is the real data (String, Uint8Array, etc).\n *\n * @constructor\n * @param {String} name the name of the stream (mainly used for debugging purposes)\n */\nfunction GenericWorker(name) {\n    // the name of the worker\n    this.name = name || \"default\";\n    // an object containing metadata about the workers chain\n    this.streamInfo = {};\n    // an error which happened when the worker was paused\n    this.generatedError = null;\n    // an object containing metadata to be merged by this worker into the general metadata\n    this.extraStreamInfo = {};\n    // true if the stream is paused (and should not do anything), false otherwise\n    this.isPaused = true;\n    // true if the stream is finished (and should not do anything), false otherwise\n    this.isFinished = false;\n    // true if the stream is locked to prevent further structure updates (pipe), false otherwise\n    this.isLocked = false;\n    // the event listeners\n    this._listeners = {\n        'data':[],\n        'end':[],\n        'error':[]\n    };\n    // the previous worker, if any\n    this.previous = null;\n}\nGenericWorker.prototype = {\n    /**\n     * Push a chunk to the next workers.\n     * @param {Object} chunk the chunk to push\n     */\n    push : function (chunk) {\n        this.emit(\"data\", chunk);\n    },\n    /**\n     * End the stream.\n     * @return {Boolean} true if this call ended the worker, false otherwise.\n     */\n    end : function () {\n        if (this.isFinished) {\n            return false;\n        }\n        this.flush();\n        try {\n            this.emit(\"end\");\n            this.cleanUp();\n            this.isFinished = true;\n        } catch (e) {\n            this.emit(\"error\", e);\n        }\n        return true;\n    },\n    /**\n     * End the stream with an error.\n     * @param {Error} e the error which caused the premature end.\n     * @return {Boolean} true if this call ended the worker with an error, false otherwise.\n     */\n    error : function (e) {\n        if (this.isFinished) {\n            return false;\n        }\n        if(this.isPaused) {\n            this.generatedError = e;\n        } else {\n            this.isFinished = true;\n            this.emit(\"error\", e);\n            // in the workers chain exploded in the middle of the chain,\n            // the error event will go downward but we also need to notify\n            // workers upward that there has been an error.\n            if(this.previous) {\n                this.previous.error(e);\n            }\n            this.cleanUp();\n        }\n        return true;\n    },\n    /**\n     * Add a callback on an event.\n     * @param {String} name the name of the event (data, end, error)\n     * @param {Function} listener the function to call when the event is triggered\n     * @return {GenericWorker} the current object for chainability\n     */\n    on : function (name, listener) {\n        this._listeners[name].push(listener);\n        return this;\n    },\n    /**\n     * Clean any references when a worker is ending.\n     */\n    cleanUp : function () {\n        this.streamInfo = this.generatedError = this.extraStreamInfo = null;\n        this._listeners = [];\n    },\n    /**\n     * Trigger an event. This will call registered callback with the provided arg.\n     * @param {String} name the name of the event (data, end, error)\n     * @param {Object} arg the argument to call the callback with.\n     */\n    emit : function (name, arg) {\n        if (this._listeners[name]) {\n            for(var i = 0; i < this._listeners[name].length; i++) {\n                this._listeners[name][i].call(this, arg);\n            }\n        }\n    },\n    /**\n     * Chain a worker with an other.\n     * @param {Worker} next the worker receiving events from the current one.\n     * @return {worker} the next worker for chainability\n     */\n    pipe : function (next) {\n        return next.registerPrevious(this);\n    },\n    /**\n     * Same as `pipe` in the other direction.\n     * Using an API with `pipe(next)` is very easy.\n     * Implementing the API with the point of view of the next one registering\n     * a source is easier, see the ZipFileWorker.\n     * @param {Worker} previous the previous worker, sending events to this one\n     * @return {Worker} the current worker for chainability\n     */\n    registerPrevious : function (previous) {\n        if (this.isLocked) {\n            throw new Error(\"The stream '\" + this + \"' has already been used.\");\n        }\n        // sharing the streamInfo...\n        this.streamInfo = previous.streamInfo;\n        // ... and adding our own bits\n        this.mergeStreamInfo();\n        this.previous =  previous;\n        var self = this;\n        previous.on('data', function (chunk) {\n            self.processChunk(chunk);\n        });\n        previous.on('end', function () {\n            self.end();\n        });\n        previous.on('error', function (e) {\n            self.error(e);\n        });\n        return this;\n    },\n    /**\n     * Pause the stream so it doesn't send events anymore.\n     * @return {Boolean} true if this call paused the worker, false otherwise.\n     */\n    pause : function () {\n        if(this.isPaused || this.isFinished) {\n            return false;\n        }\n        this.isPaused = true;\n        if(this.previous) {\n            this.previous.pause();\n        }\n        return true;\n    },\n    /**\n     * Resume a paused stream.\n     * @return {Boolean} true if this call resumed the worker, false otherwise.\n     */\n    resume : function () {\n        if(!this.isPaused || this.isFinished) {\n            return false;\n        }\n        this.isPaused = false;\n        // if true, the worker tried to resume but failed\n        var withError = false;\n        if(this.generatedError) {\n            this.error(this.generatedError);\n            withError = true;\n        }\n        if(this.previous) {\n            this.previous.resume();\n        }\n        return !withError;\n    },\n    /**\n     * Flush any remaining bytes as the stream is ending.\n     */\n    flush : function () {},\n    /**\n     * Process a chunk. This is usually the method overridden.\n     * @param {Object} chunk the chunk to process.\n     */\n    processChunk : function(chunk) {\n        this.push(chunk);\n    },\n    /**\n     * Add a key/value to be added in the workers chain streamInfo once activated.\n     * @param {String} key the key to use\n     * @param {Object} value the associated value\n     * @return {Worker} the current worker for chainability\n     */\n    withStreamInfo : function (key, value) {\n        this.extraStreamInfo[key] = value;\n        this.mergeStreamInfo();\n        return this;\n    },\n    /**\n     * Merge this worker's streamInfo into the chain's streamInfo.\n     */\n    mergeStreamInfo : function () {\n        for(var key in this.extraStreamInfo) {\n            if (!this.extraStreamInfo.hasOwnProperty(key)) {\n                continue;\n            }\n            this.streamInfo[key] = this.extraStreamInfo[key];\n        }\n    },\n    /**\n     * Lock the stream to prevent further updates on the workers chain.\n     * After calling this method, all calls to pipe will fail.\n     */\n    lock: function () {\n        if (this.isLocked) {\n            throw new Error(\"The stream '\" + this + \"' has already been used.\");\n        }\n        this.isLocked = true;\n        if (this.previous) {\n            this.previous.lock();\n        }\n    },\n    /**\n     *\n     * Pretty print the workers chain.\n     */\n    toString : function () {\n        var me = \"Worker \" + this.name;\n        if (this.previous) {\n            return this.previous + \" -> \" + me;\n        } else {\n            return me;\n        }\n    }\n};\nmodule.exports = GenericWorker;\n })