/* 1171 */
 (function(module, exports, __webpack_require__) {
"use strict";
eval("\nvar traverse = module.exports = function (schema, opts, cb) {\n  if (typeof opts == 'function') {\n    cb = opts;\n    opts = {};\n  }\n  _traverse(opts, cb, schema, '', schema);\n};\ntraverse.keywords = {\n  additionalItems: true,\n  items: true,\n  contains: true,\n  additionalProperties: true,\n  propertyNames: true,\n  not: true\n};\ntraverse.arrayKeywords = {\n  items: true,\n  allOf: true,\n  anyOf: true,\n  oneOf: true\n};\ntraverse.propsKeywords = {\n  definitions: true,\n  properties: true,\n  patternProperties: true,\n  dependencies: true\n};\ntraverse.skipKeywords = {\n  enum: true,\n  const: true,\n  required: true,\n  maximum: true,\n  minimum: true,\n  exclusiveMaximum: true,\n  exclusiveMinimum: true,\n  multipleOf: true,\n  maxLength: true,\n  minLength: true,\n  pattern: true,\n  format: true,\n  maxItems: true,\n  minItems: true,\n  uniqueItems: true,\n  maxProperties: true,\n  minProperties: true\n};\nfunction _traverse(opts, cb, schema, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex) {\n  if (schema && typeof schema == 'object' && !Array.isArray(schema)) {\n    cb(schema, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex);\n    for (var key in schema) {\n      var sch = schema[key];\n      if (Array.isArray(sch)) {\n        if (key in traverse.arrayKeywords) {\n          for (var i=0; i<sch.length; i++)\n            _traverse(opts, cb, sch[i], jsonPtr + '/' + key + '/' + i, rootSchema, jsonPtr, key, schema, i);\n        }\n      } else if (key in traverse.propsKeywords) {\n        if (sch && typeof sch == 'object') {\n          for (var prop in sch)\n            _traverse(opts, cb, sch[prop], jsonPtr + '/' + key + '/' + escapeJsonPtr(prop), rootSchema, jsonPtr, key, schema, prop);\n        }\n      } else if (key in traverse.keywords || (opts.allKeys && !(key in traverse.skipKeywords))) {\n        _traverse(opts, cb, sch, jsonPtr + '/' + key, rootSchema, jsonPtr, key, schema);\n      }\n    }\n  }\n}\nfunction escapeJsonPtr(str) {\n  return str.replace(/~/g, '~0').replace(/\\//g, '~1');\n}\n// ./~/json-schema-traverse/index.js\n// module id = 1171\n// module chunks = 0\n//# sourceURL=scratch:///./~/json-schema-traverse/index.js?");
 })