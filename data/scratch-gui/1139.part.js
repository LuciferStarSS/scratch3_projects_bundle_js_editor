/* 1139 */\n (function(module, exports, __webpack_require__) {\nvar ajv = __webpack_require__(1140)();\nvar sb2Defs = __webpack_require__(1179);\nvar sb3Defs = __webpack_require__(1180);\nvar sb2Schema = __webpack_require__(1181);\nvar sb3Schema = __webpack_require__(1182);\nvar sprite2Schema = __webpack_require__(1183);\nvar sprite3Schema = __webpack_require__(1184);\najv.addSchema(sb2Defs).addSchema(sb3Defs);\nmodule.exports = function (isSprite, input, callback) {\n    var validateSb2 = ajv.compile(isSprite ? sprite2Schema : sb2Schema);\n    var validateSb3 = ajv.compile(isSprite ? sprite3Schema : sb3Schema);\n    var isValidSb2 = validateSb2(input);\n    if (isValidSb2) {\n        input.projectVersion = 2;\n        return callback(null, input);\n    }\n    var isValidSb3 = validateSb3(input);\n    if (isValidSb3) {\n        input.projectVersion = 3;\n        return callback(null, input);\n    }\n    var validationErrors = {\n        validationError: 'Could not parse as a valid SB2 or SB3 project.',\n        sb2Errors: validateSb2.errors,\n        sb3Errors: validateSb3.errors\n    };\n    callback(validationErrors);\n};\n })