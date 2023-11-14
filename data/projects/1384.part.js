/* 1384 */
 (function(module, exports, __webpack_require__) {
"use strict";
eval("\nmodule.exports = function generate_const(it, $keyword, $ruleType) {\n  var out = ' ';\n  var $lvl = it.level;\n  var $dataLvl = it.dataLevel;\n  var $schema = it.schema[$keyword];\n  var $schemaPath = it.schemaPath + it.util.getProperty($keyword);\n  var $errSchemaPath = it.errSchemaPath + '/' + $keyword;\n  var $breakOnError = !it.opts.allErrors;\n  var $data = 'data' + ($dataLvl || '');\n  var $valid = 'valid' + $lvl;\n  var $isData = it.opts.$data && $schema && $schema.$data,\n    $schemaValue;\n  if ($isData) {\n    out += ' var schema' + ($lvl) + ' = ' + (it.util.getData($schema.$data, $dataLvl, it.dataPathArr)) + '; ';\n    $schemaValue = 'schema' + $lvl;\n  } else {\n    $schemaValue = $schema;\n  }\n  if (!$isData) {\n    out += ' var schema' + ($lvl) + ' = validate.schema' + ($schemaPath) + ';';\n  }\n  out += 'var ' + ($valid) + ' = equal(' + ($data) + ', schema' + ($lvl) + '); if (!' + ($valid) + ') {   ';\n  var $$outStack = $$outStack || [];\n  $$outStack.push(out);\n  out = ''; /* istanbul ignore else */\n  if (it.createErrors !== false) {\n    out += ' { keyword: \\'' + ('const') + '\\' , dataPath: (dataPath || \\'\\') + ' + (it.errorPath) + ' , schemaPath: ' + (it.util.toQuotedString($errSchemaPath)) + ' , params: { allowedValue: schema' + ($lvl) + ' } ';\n    if (it.opts.messages !== false) {\n      out += ' , message: \\'should be equal to constant\\' ';\n    }\n    if (it.opts.verbose) {\n      out += ' , schema: validate.schema' + ($schemaPath) + ' , parentSchema: validate.schema' + (it.schemaPath) + ' , data: ' + ($data) + ' ';\n    }\n    out += ' } ';\n  } else {\n    out += ' {} ';\n  }\n  var __err = out;\n  out = $$outStack.pop();\n  if (!it.compositeRule && $breakOnError) { /* istanbul ignore if */\n    if (it.async) {\n      out += ' throw new ValidationError([' + (__err) + ']); ';\n    } else {\n      out += ' validate.errors = [' + (__err) + ']; return false; ';\n    }\n  } else {\n    out += ' var err = ' + (__err) + ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ';\n  }\n  out += ' }';\n  if ($breakOnError) {\n    out += ' else { ';\n  }\n  return out;\n}\n// ./~/scratch-parser/~/ajv/lib/dotjs/const.js\n// module id = 1384\n// module chunks = 0\n//# sourceURL=scratch:///./~/scratch-parser/~/ajv/lib/dotjs/const.js?");
 })