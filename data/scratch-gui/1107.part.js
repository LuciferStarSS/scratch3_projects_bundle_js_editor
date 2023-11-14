/* 1107 */\n (function(module, exports, __webpack_require__) {\n(function(Buffer) {var unzip = __webpack_require__(1108);\n/**\n * If input a buffer, transforms buffer into a UTF-8 string.\n * If input is encoded in zip format, the input will be extracted and decoded.\n * If input is a string, passes that string along to the given callback.\n * @param {Buffer | string} input    Project data\n * @param {boolean}         isSprite Whether the input should be treated as\n * a sprite (true) or a whole project (false)\n * @param {Function}        callback Error or stringified project data\n * @return {void}\n */\nmodule.exports = function (input, isSprite, callback) {\n    if (typeof input === 'string') {\n        // Pass string to callback\n        return callback(null, [input, null]);\n    }\n    // Validate input type\n    var typeError = 'Input must be a Buffer or a string.';\n    if (!Buffer.isBuffer(input)) {\n        try {\n            input = new Buffer(input);\n        } catch (e) {\n            return callback(typeError);\n        }\n    }\n    // Determine format\n    // We don't use the file suffix as this is unreliable and mine-type\n    // information is unavailable from Scratch's project CDN. Instead, we look\n    // at the first few bytes from the provided buffer (byte signature).\n    // https://en.wikipedia.org/wiki/List_of_file_signatures\n    var signature = input.slice(0, 3).join(' ');\n    var isLegacy = false;\n    var isZip = false;\n    if (signature.indexOf('83 99 114') === 0) isLegacy = true;\n    if (signature.indexOf('80 75') === 0) isZip = true;\n    // If not legacy or zip, convert buffer to UTF-8 string and return\n    if (!isZip && !isLegacy) {\n        return callback(null, [input.toString('utf-8'), null]);\n    }\n    // Return error if legacy encoding detected\n    if (isLegacy) return callback('Parser only supports Scratch 2.X and above');\n    unzip(input, isSprite, callback);\n};\n}.call(this, __webpack_require__(56).Buffer))\n })