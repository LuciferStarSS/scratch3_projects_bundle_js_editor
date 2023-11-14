/* 454 */\n (function(module, exports, __webpack_require__) {\nvar pify = __webpack_require__(1106);\nvar unpack = pify(__webpack_require__(1107));\nvar parse = pify(__webpack_require__(1138));\nvar validate = pify(__webpack_require__(1139));\n/**\n  * Unpacks, parses, validates, and analyzes Scratch projects. If successful,\n  * will return a valid Scratch project object with appended metadata.\n  * @param {Buffer | string} input    Buffer or string representing project\n  * @param {boolean}         isSprite Whether this is a sprite (true) or whole project (false)\n  * @param {Function}        callback Returns error or project data\n  */\nmodule.exports = function (input, isSprite, callback) {\n    // Unpack the input and further transform the json portion by parsing and\n    // validating it.\n    unpack(input, isSprite)\n        .then(function (unpackedProject) {\n            return parse(unpackedProject[0])\n                .then(validate.bind(null, isSprite))\n                .then(function (validatedProject) {\n                    return [validatedProject, unpackedProject[1]];\n                });\n        })\n        .then(callback.bind(null, null), callback);\n};\n })