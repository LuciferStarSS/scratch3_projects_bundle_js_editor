/* 1402 */
 (function(module, exports, __webpack_require__) {
"use strict";
eval("\nvar IDENTIFIER = /^[a-z_$][a-z0-9_$-]*$/i;\nvar customRuleCode = __webpack_require__(1386);\nmodule.exports = {\n  add: addKeyword,\n  get: getKeyword,\n  remove: removeKeyword\n};\n/**\n * Define custom keyword\n * @this  Ajv\n * @param {String} keyword custom keyword, should be unique (including different from all standard, custom and macro keywords).\n * @param {Object} definition keyword definition object with properties `type` (type(s) which the keyword applies to), `validate` or `compile`.\n * @return {Ajv} this for method chaining\n */\nfunction addKeyword(keyword, definition) {\n  /* jshint validthis: true */\n  /* eslint no-shadow: 0 */\n  var RULES = this.RULES;\n  if (RULES.keywords[keyword])\n    throw new Error('Keyword ' + keyword + ' is already defined');\n  if (!IDENTIFIER.test(keyword))\n    throw new Error('Keyword ' + keyword + ' is not a valid identifier');\n  if (definition) {\n    if (definition.macro && definition.valid !== undefined)\n      throw new Error('\"valid\" option cannot be used with macro keywords');\n    var dataType = definition.type;\n    if (Array.isArray(dataType)) {\n      var i, len = dataType.length;\n      for (i=0; i<len; i++) checkDataType(dataType[i]);\n      for (i=0; i<len; i++) _addRule(keyword, dataType[i], definition);\n    } else {\n      if (dataType) checkDataType(dataType);\n      _addRule(keyword, dataType, definition);\n    }\n    var $data = definition.$data === true && this._opts.$data;\n    if ($data && !definition.validate)\n      throw new Error('$data support: \"validate\" function is not defined');\n    var metaSchema = definition.metaSchema;\n    if (metaSchema) {\n      if ($data) {\n        metaSchema = {\n          anyOf: [\n            metaSchema,\n            { '$ref': 'https://raw.githubusercontent.com/epoberezkin/ajv/master/lib/refs/data.json#' }\n          ]\n        };\n      }\n      definition.validateSchema = this.compile(metaSchema, true);\n    }\n  }\n  RULES.keywords[keyword] = RULES.all[keyword] = true;\n  function _addRule(keyword, dataType, definition) {\n    var ruleGroup;\n    for (var i=0; i<RULES.length; i++) {\n      var rg = RULES[i];\n      if (rg.type == dataType) {\n        ruleGroup = rg;\n        break;\n      }\n    }\n    if (!ruleGroup) {\n      ruleGroup = { type: dataType, rules: [] };\n      RULES.push(ruleGroup);\n    }\n    var rule = {\n      keyword: keyword,\n      definition: definition,\n      custom: true,\n      code: customRuleCode,\n      implements: definition.implements\n    };\n    ruleGroup.rules.push(rule);\n    RULES.custom[keyword] = rule;\n  }\n  function checkDataType(dataType) {\n    if (!RULES.types[dataType]) throw new Error('Unknown type ' + dataType);\n  }\n  return this;\n}\n/**\n * Get keyword\n * @this  Ajv\n * @param {String} keyword pre-defined or custom keyword.\n * @return {Object|Boolean} custom keyword definition, `true` if it is a predefined keyword, `false` otherwise.\n */\nfunction getKeyword(keyword) {\n  /* jshint validthis: true */\n  var rule = this.RULES.custom[keyword];\n  return rule ? rule.definition : this.RULES.keywords[keyword] || false;\n}\n/**\n * Remove keyword\n * @this  Ajv\n * @param {String} keyword pre-defined or custom keyword.\n * @return {Ajv} this for method chaining\n */\nfunction removeKeyword(keyword) {\n  /* jshint validthis: true */\n  var RULES = this.RULES;\n  delete RULES.keywords[keyword];\n  delete RULES.all[keyword];\n  delete RULES.custom[keyword];\n  for (var i=0; i<RULES.length; i++) {\n    var rules = RULES[i].rules;\n    for (var j=0; j<rules.length; j++) {\n      if (rules[j].keyword == keyword) {\n        rules.splice(j, 1);\n        break;\n      }\n    }\n  }\n  return this;\n}\n// ./~/scratch-parser/~/ajv/lib/keyword.js\n// module id = 1402\n// module chunks = 0\n//# sourceURL=scratch:///./~/scratch-parser/~/ajv/lib/keyword.js?");
 })