/* 1159 */\n (function(module, exports, __webpack_require__) {\n\"use strict\";\nmodule.exports = function generate_contains(it, $keyword, $ruleType) {\n  var out = ' ';\n  var $lvl = it.level;\n  var $dataLvl = it.dataLevel;\n  var $schema = it.schema[$keyword];\n  var $schemaPath = it.schemaPath + it.util.getProperty($keyword);\n  var $errSchemaPath = it.errSchemaPath + '/' + $keyword;\n  var $breakOnError = !it.opts.allErrors;\n  var $data = 'data' + ($dataLvl || '');\n  var $valid = 'valid' + $lvl;\n  var $errs = 'errs__' + $lvl;\n  var $it = it.util.copy(it);\n  var $closingBraces = '';\n  $it.level++;\n  var $nextValid = 'valid' + $it.level;\n  var $idx = 'i' + $lvl,\n    $dataNxt = $it.dataLevel = it.dataLevel + 1,\n    $nextData = 'data' + $dataNxt,\n    $currentBaseId = it.baseId,\n    $nonEmptySchema = it.util.schemaHasRules($schema, it.RULES.all);\n  out += 'var ' + ($errs) + ' = errors;var ' + ($valid) + ';';\n  if ($nonEmptySchema) {\n    var $wasComposite = it.compositeRule;\n    it.compositeRule = $it.compositeRule = true;\n    $it.schema = $schema;\n    $it.schemaPath = $schemaPath;\n    $it.errSchemaPath = $errSchemaPath;\n    out += ' var ' + ($nextValid) + ' = false; for (var ' + ($idx) + ' = 0; ' + ($idx) + ' < ' + ($data) + '.length; ' + ($idx) + '++) { ';\n    $it.errorPath = it.util.getPathExpr(it.errorPath, $idx, it.opts.jsonPointers, true);\n    var $passData = $data + '[' + $idx + ']';\n    $it.dataPathArr[$dataNxt] = $idx;\n    var $code = it.validate($it);\n    $it.baseId = $currentBaseId;\n    if (it.util.varOccurences($code, $nextData) < 2) {\n      out += ' ' + (it.util.varReplace($code, $nextData, $passData)) + ' ';\n    } else {\n      out += ' var ' + ($nextData) + ' = ' + ($passData) + '; ' + ($code) + ' ';\n    }\n    out += ' if (' + ($nextValid) + ') break; }  ';\n    it.compositeRule = $it.compositeRule = $wasComposite;\n    out += ' ' + ($closingBraces) + ' if (!' + ($nextValid) + ') {';\n  } else {\n    out += ' if (' + ($data) + '.length == 0) {';\n  }\n  var $$outStack = $$outStack || [];\n  $$outStack.push(out);\n  out = ''; /* istanbul ignore else */\n  if (it.createErrors !== false) {\n    out += ' { keyword: \\'' + ('contains') + '\\' , dataPath: (dataPath || \\'\\') + ' + (it.errorPath) + ' , schemaPath: ' + (it.util.toQuotedString($errSchemaPath)) + ' , params: {} ';\n    if (it.opts.messages !== false) {\n      out += ' , message: \\'should contain a valid item\\' ';\n    }\n    if (it.opts.verbose) {\n      out += ' , schema: validate.schema' + ($schemaPath) + ' , parentSchema: validate.schema' + (it.schemaPath) + ' , data: ' + ($data) + ' ';\n    }\n    out += ' } ';\n  } else {\n    out += ' {} ';\n  }\n  var __err = out;\n  out = $$outStack.pop();\n  if (!it.compositeRule && $breakOnError) { /* istanbul ignore if */\n    if (it.async) {\n      out += ' throw new ValidationError([' + (__err) + ']); ';\n    } else {\n      out += ' validate.errors = [' + (__err) + ']; return false; ';\n    }\n  } else {\n    out += ' var err = ' + (__err) + ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ';\n  }\n  out += ' } else { ';\n  if ($nonEmptySchema) {\n    out += '  errors = ' + ($errs) + '; if (vErrors !== null) { if (' + ($errs) + ') vErrors.length = ' + ($errs) + '; else vErrors = null; } ';\n  }\n  if (it.opts.allErrors) {\n    out += ' } ';\n  }\n  out = it.util.cleanUpCode(out);\n  return out;\n}\n })