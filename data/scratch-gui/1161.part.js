/* 1161 */\n (function(module, exports, __webpack_require__) {\n\"use strict\";\nmodule.exports = function generate_enum(it, $keyword, $ruleType) {\n  var out = ' ';\n  var $lvl = it.level;\n  var $dataLvl = it.dataLevel;\n  var $schema = it.schema[$keyword];\n  var $schemaPath = it.schemaPath + it.util.getProperty($keyword);\n  var $errSchemaPath = it.errSchemaPath + '/' + $keyword;\n  var $breakOnError = !it.opts.allErrors;\n  var $data = 'data' + ($dataLvl || '');\n  var $valid = 'valid' + $lvl;\n  var $isData = it.opts.$data && $schema && $schema.$data,\n    $schemaValue;\n  if ($isData) {\n    out += ' var schema' + ($lvl) + ' = ' + (it.util.getData($schema.$data, $dataLvl, it.dataPathArr)) + '; ';\n    $schemaValue = 'schema' + $lvl;\n  } else {\n    $schemaValue = $schema;\n  }\n  var $i = 'i' + $lvl,\n    $vSchema = 'schema' + $lvl;\n  if (!$isData) {\n    out += ' var ' + ($vSchema) + ' = validate.schema' + ($schemaPath) + ';';\n  }\n  out += 'var ' + ($valid) + ';';\n  if ($isData) {\n    out += ' if (schema' + ($lvl) + ' === undefined) ' + ($valid) + ' = true; else if (!Array.isArray(schema' + ($lvl) + ')) ' + ($valid) + ' = false; else {';\n  }\n  out += '' + ($valid) + ' = false;for (var ' + ($i) + '=0; ' + ($i) + '<' + ($vSchema) + '.length; ' + ($i) + '++) if (equal(' + ($data) + ', ' + ($vSchema) + '[' + ($i) + '])) { ' + ($valid) + ' = true; break; }';\n  if ($isData) {\n    out += '  }  ';\n  }\n  out += ' if (!' + ($valid) + ') {   ';\n  var $$outStack = $$outStack || [];\n  $$outStack.push(out);\n  out = ''; /* istanbul ignore else */\n  if (it.createErrors !== false) {\n    out += ' { keyword: \\'' + ('enum') + '\\' , dataPath: (dataPath || \\'\\') + ' + (it.errorPath) + ' , schemaPath: ' + (it.util.toQuotedString($errSchemaPath)) + ' , params: { allowedValues: schema' + ($lvl) + ' } ';\n    if (it.opts.messages !== false) {\n      out += ' , message: \\'should be equal to one of the allowed values\\' ';\n    }\n    if (it.opts.verbose) {\n      out += ' , schema: validate.schema' + ($schemaPath) + ' , parentSchema: validate.schema' + (it.schemaPath) + ' , data: ' + ($data) + ' ';\n    }\n    out += ' } ';\n  } else {\n    out += ' {} ';\n  }\n  var __err = out;\n  out = $$outStack.pop();\n  if (!it.compositeRule && $breakOnError) { /* istanbul ignore if */\n    if (it.async) {\n      out += ' throw new ValidationError([' + (__err) + ']); ';\n    } else {\n      out += ' validate.errors = [' + (__err) + ']; return false; ';\n    }\n  } else {\n    out += ' var err = ' + (__err) + ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ';\n  }\n  out += ' }';\n  if ($breakOnError) {\n    out += ' else { ';\n  }\n  return out;\n}\n })