/* 409 */\n (function(module, exports, __webpack_require__) {\n\"use strict\";\n(function(Buffer) {\nvar utils = __webpack_require__(42);\nvar ConvertWorker = __webpack_require__(924);\nvar GenericWorker = __webpack_require__(76);\nvar base64 = __webpack_require__(407);\nvar support = __webpack_require__(110);\nvar external = __webpack_require__(179);\nvar NodejsStreamOutputAdapter = null;\nif (support.nodestream) {\n    try {\n        NodejsStreamOutputAdapter = __webpack_require__(925);\n    } catch(e) {}\n}\n/**\n * Apply the final transformation of the data. If the user wants a Blob for\n * example, it's easier to work with an U8intArray and finally do the\n * ArrayBuffer/Blob conversion.\n * @param {String} type the name of the final type\n * @param {String|Uint8Array|Buffer} content the content to transform\n * @param {String} mimeType the mime type of the content, if applicable.\n * @return {String|Uint8Array|ArrayBuffer|Buffer|Blob} the content in the right format.\n */\nfunction transformZipOutput(type, content, mimeType) {\n    switch(type) {\n        case \"blob\" :\n            return utils.newBlob(utils.transformTo(\"arraybuffer\", content), mimeType);\n        case \"base64\" :\n            return base64.encode(content);\n        default :\n            return utils.transformTo(type, content);\n    }\n}\n/**\n * Concatenate an array of data of the given type.\n * @param {String} type the type of the data in the given array.\n * @param {Array} dataArray the array containing the data chunks to concatenate\n * @return {String|Uint8Array|Buffer} the concatenated data\n * @throws Error if the asked type is unsupported\n */\nfunction concat (type, dataArray) {\n    var i, index = 0, res = null, totalLength = 0;\n    for(i = 0; i < dataArray.length; i++) {\n        totalLength += dataArray[i].length;\n    }\n    switch(type) {\n        case \"string\":\n            return dataArray.join(\"\");\n          case \"array\":\n            return Array.prototype.concat.apply([], dataArray);\n        case \"uint8array\":\n            res = new Uint8Array(totalLength);\n            for(i = 0; i < dataArray.length; i++) {\n                res.set(dataArray[i], index);\n                index += dataArray[i].length;\n            }\n            return res;\n        case \"nodebuffer\":\n            return Buffer.concat(dataArray);\n        default:\n            throw new Error(\"concat : unsupported type '\"  + type + \"'\");\n    }\n}\n/**\n * Listen a StreamHelper, accumulate its content and concatenate it into a\n * complete block.\n * @param {StreamHelper} helper the helper to use.\n * @param {Function} updateCallback a callback called on each update. Called\n * with one arg :\n * - the metadata linked to the update received.\n * @return Promise the promise for the accumulation.\n */\nfunction accumulate(helper, updateCallback) {\n    return new external.Promise(function (resolve, reject){\n        var dataArray = [];\n        var chunkType = helper._internalType,\n            resultType = helper._outputType,\n            mimeType = helper._mimeType;\n        helper\n        .on('data', function (data, meta) {\n            dataArray.push(data);\n            if(updateCallback) {\n                updateCallback(meta);\n            }\n        })\n        .on('error', function(err) {\n            dataArray = [];\n            reject(err);\n        })\n        .on('end', function (){\n            try {\n                var result = transformZipOutput(resultType, concat(chunkType, dataArray), mimeType);\n                resolve(result);\n            } catch (e) {\n                reject(e);\n            }\n            dataArray = [];\n        })\n        .resume();\n    });\n}\n/**\n * An helper to easily use workers outside of JSZip.\n * @constructor\n * @param {Worker} worker the worker to wrap\n * @param {String} outputType the type of data expected by the use\n * @param {String} mimeType the mime type of the content, if applicable.\n */\nfunction StreamHelper(worker, outputType, mimeType) {\n    var internalType = outputType;\n    switch(outputType) {\n        case \"blob\":\n        case \"arraybuffer\":\n            internalType = \"uint8array\";\n        break;\n        case \"base64\":\n            internalType = \"string\";\n        break;\n    }\n    try {\n        // the type used internally\n        this._internalType = internalType;\n        // the type used to output results\n        this._outputType = outputType;\n        // the mime type\n        this._mimeType = mimeType;\n        utils.checkSupport(internalType);\n        this._worker = worker.pipe(new ConvertWorker(internalType));\n        // the last workers can be rewired without issues but we need to\n        // prevent any updates on previous workers.\n        worker.lock();\n    } catch(e) {\n        this._worker = new GenericWorker(\"error\");\n        this._worker.error(e);\n    }\n}\nStreamHelper.prototype = {\n    /**\n     * Listen a StreamHelper, accumulate its content and concatenate it into a\n     * complete block.\n     * @param {Function} updateCb the update callback.\n     * @return Promise the promise for the accumulation.\n     */\n    accumulate : function (updateCb) {\n        return accumulate(this, updateCb);\n    },\n    /**\n     * Add a listener on an event triggered on a stream.\n     * @param {String} evt the name of the event\n     * @param {Function} fn the listener\n     * @return {StreamHelper} the current helper.\n     */\n    on : function (evt, fn) {\n        var self = this;\n        if(evt === \"data\") {\n            this._worker.on(evt, function (chunk) {\n                fn.call(self, chunk.data, chunk.meta);\n            });\n        } else {\n            this._worker.on(evt, function () {\n                utils.delay(fn, arguments, self);\n            });\n        }\n        return this;\n    },\n    /**\n     * Resume the flow of chunks.\n     * @return {StreamHelper} the current helper.\n     */\n    resume : function () {\n        utils.delay(this._worker.resume, [], this._worker);\n        return this;\n    },\n    /**\n     * Pause the flow of chunks.\n     * @return {StreamHelper} the current helper.\n     */\n    pause : function () {\n        this._worker.pause();\n        return this;\n    },\n    /**\n     * Return a nodejs stream for this helper.\n     * @param {Function} updateCb the update callback.\n     * @return {NodejsStreamOutputAdapter} the nodejs stream.\n     */\n    toNodejsStream : function (updateCb) {\n        utils.checkSupport(\"nodestream\");\n        if (this._outputType !== \"nodebuffer\") {\n            // an object stream containing blob/arraybuffer/uint8array/string\n            // is strange and I don't know if it would be useful.\n            // I you find this comment and have a good usecase, please open a\n            // bug report !\n            throw new Error(this._outputType + \" is not supported by this method\");\n        }\n        return new NodejsStreamOutputAdapter(this, {\n            objectMode : this._outputType !== \"nodebuffer\"\n        }, updateCb);\n    }\n};\nmodule.exports = StreamHelper;\n}.call(this, __webpack_require__(56).Buffer))\n })