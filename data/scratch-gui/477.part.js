/* 477 */\n (function(module, exports, __webpack_require__) {\n\"use strict\";\nmodule.exports = function generate__limitLength(it, $keyword, $ruleType) {\n  var out = ' ';\n  var $lvl = it.level;\n  var $dataLvl = it.dataLevel;\n  var $schema = it.schema[$keyword];\n  var $schemaPath = it.schemaPath + it.util.getProperty($keyword);\n  var $errSchemaPath = it.errSchemaPath + '/' + $keyword;\n  var $breakOnError = !it.opts.allErrors;\n  var $errorKeyword;\n  var $data = 'data' + ($dataLvl || '');\n  var $isData = it.opts.$data && $schema && $schema.$data,\n    $schemaValue;\n  if ($isData) {\n    out += ' var schema' + ($lvl) + ' = ' + (it.util.getData($schema.$data, $dataLvl, it.dataPathArr)) + '; ';\n    $schemaValue = 'schema' + $lvl;\n  } else {\n    $schemaValue = $schema;\n  }\n  var $op = $keyword == 'maxLength' ? '>' : '<';\n  out += 'if ( ';\n  if ($isData) {\n    out += ' (' + ($schemaValue) + ' !== undefined && typeof ' + ($schemaValue) + ' != \\'number\\') || ';\n  }\n  if (it.opts.unicode === false) {\n    out += ' ' + ($data) + '.length ';\n  } else {\n    out += ' ucs2length(' + ($data) + ') ';\n  }\n  out += ' ' + ($op) + ' ' + ($schemaValue) + ') { ';\n  var $errorKeyword = $keyword;\n  var $$outStack = $$outStack || [];\n  $$outStack.push(out);\n  out = ''; /* istanbul ignore else */\n  if (it.createErrors !== false) {\n    out += ' { keyword: \\'' + ($errorKeyword || '_limitLength') + '\\' , dataPath: (dataPath || \\'\\') + ' + (it.errorPath) + ' , schemaPath: ' + (it.util.toQuotedString($errSchemaPath)) + ' , params: { limit: ' + ($schemaValue) + ' } ';\n    if (it.opts.messages !== false) {\n      out += ' , message: \\'should NOT be ';\n      if ($keyword == 'maxLength') {\n        out += 'longer';\n      } else {\n        out += 'shorter';\n      }\n      out += ' than ';\n      if ($isData) {\n        out += '\\' + ' + ($schemaValue) + ' + \\'';\n      } else {\n        out += '' + ($schema);\n      }\n      out += ' characters\\' ';\n    }\n    if (it.opts.verbose) {\n      out += ' , schema:  ';\n      if ($isData) {\n        out += 'validate.schema' + ($schemaPath);\n      } else {\n        out += '' + ($schema);\n      }\n      out += '         , parentSchema: validate.schema' + (it.schemaPath) + ' , data: ' + ($data) + ' ';\n    }\n    out += ' } ';\n  } else {\n    out += ' {} ';\n  }\n  var __err = out;\n  out = $$outStack.pop();\n  if (!it.compositeRule && $breakOnError) { /* istanbul ignore if */\n    if (it.async) {\n      out += ' throw new ValidationError([' + (__err) + ']); ';\n    } else {\n      out += ' validate.errors = [' + (__err) + ']; return false; ';\n    }\n  } else {\n    out += ' var err = ' + (__err) + ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ';\n  }\n  out += '} ';\n  if ($breakOnError) {\n    out += ' else { ';\n  }\n  return out;\n}\n })