/* 441 */\n (function(module, exports, __webpack_require__) {\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n/**\n * @fileoverview\n * The BlocksRuntimeCache caches data about the top block of scripts so that\n * Runtime can iterate a targeted opcode and iterate the returned set faster.\n * Many top blocks need to match fields as well as opcode, since that matching\n * compares strings in uppercase we can go ahead and uppercase the cached value\n * so we don't need to in the future.\n */\n/**\n * A set of cached data about the top block of a script.\n * @param {Blocks} container - Container holding the block and related data\n * @param {string} blockId - Id for whose block data is cached in this instance\n */\nvar RuntimeScriptCache = function RuntimeScriptCache(container, blockId) {\n  _classCallCheck(this, RuntimeScriptCache);\n  /**\n   * Container with block data for blockId.\n   * @type {Blocks}\n   */\n  this.container = container;\n  /**\n   * ID for block this instance caches.\n   * @type {string}\n   */\n  this.blockId = blockId;\n  var block = container.getBlock(blockId);\n  var fields = container.getFields(block);\n  /**\n   * Formatted fields or fields of input blocks ready for comparison in\n   * runtime.\n   *\n   * This is a clone of parts of the targeted blocks. Changes to these\n   * clones are limited to copies under RuntimeScriptCache and will not\n   * appear in the original blocks in their container. This copy is\n   * modified changing the case of strings to uppercase. These uppercase\n   * values will be compared later by the VM.\n   * @type {object}\n   */\n  this.fieldsOfInputs = Object.assign({}, fields);\n  if (Object.keys(fields).length === 0) {\n    var inputs = container.getInputs(block);\n    for (var input in inputs) {\n      if (!inputs.hasOwnProperty(input)) continue;\n      var id = inputs[input].block;\n      var inputBlock = container.getBlock(id);\n      var inputFields = container.getFields(inputBlock);\n      Object.assign(this.fieldsOfInputs, inputFields);\n    }\n  }\n  for (var key in this.fieldsOfInputs) {\n    var field = this.fieldsOfInputs[key] = Object.assign({}, this.fieldsOfInputs[key]);\n    if (field.value.toUpperCase) {\n      field.value = field.value.toUpperCase();\n    }\n  }\n};\n/**\n * Get an array of scripts from a block container prefiltered to match opcode.\n * @param {Blocks} container - Container of blocks\n * @param {string} opcode - Opcode to filter top blocks by\n */\nexports.getScripts = function () {\n  throw new Error('blocks.js has not initialized BlocksRuntimeCache');\n};\n/**\n * Exposed RuntimeScriptCache class used by integration in blocks.js.\n * @private\n */\nexports._RuntimeScriptCache = RuntimeScriptCache;\n__webpack_require__(135);\n })