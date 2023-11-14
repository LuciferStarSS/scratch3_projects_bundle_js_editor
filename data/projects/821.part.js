/* 821 */
 (function(module, exports, __webpack_require__) {
"use strict";
eval("\nmodule.exports = function generate__limit(it, $keyword, $ruleType) {\n  var out = ' ';\n  var $lvl = it.level;\n  var $dataLvl = it.dataLevel;\n  var $schema = it.schema[$keyword];\n  var $schemaPath = it.schemaPath + it.util.getProperty($keyword);\n  var $errSchemaPath = it.errSchemaPath + '/' + $keyword;\n  var $breakOnError = !it.opts.allErrors;\n  var $errorKeyword;\n  var $data = 'data' + ($dataLvl || '');\n  var $isData = it.opts.$data && $schema && $schema.$data,\n    $schemaValue;\n  if ($isData) {\n    out += ' var schema' + ($lvl) + ' = ' + (it.util.getData($schema.$data, $dataLvl, it.dataPathArr)) + '; ';\n    $schemaValue = 'schema' + $lvl;\n  } else {\n    $schemaValue = $schema;\n  }\n  var $isMax = $keyword == 'maximum',\n    $exclusiveKeyword = $isMax ? 'exclusiveMaximum' : 'exclusiveMinimum',\n    $schemaExcl = it.schema[$exclusiveKeyword],\n    $isDataExcl = it.opts.$data && $schemaExcl && $schemaExcl.$data,\n    $op = $isMax ? '<' : '>',\n    $notOp = $isMax ? '>' : '<',\n    $errorKeyword = undefined;\n  if ($isDataExcl) {\n    var $schemaValueExcl = it.util.getData($schemaExcl.$data, $dataLvl, it.dataPathArr),\n      $exclusive = 'exclusive' + $lvl,\n      $exclType = 'exclType' + $lvl,\n      $exclIsNumber = 'exclIsNumber' + $lvl,\n      $opExpr = 'op' + $lvl,\n      $opStr = '\\' + ' + $opExpr + ' + \\'';\n    out += ' var schemaExcl' + ($lvl) + ' = ' + ($schemaValueExcl) + '; ';\n    $schemaValueExcl = 'schemaExcl' + $lvl;\n    out += ' var ' + ($exclusive) + '; var ' + ($exclType) + ' = typeof ' + ($schemaValueExcl) + '; if (' + ($exclType) + ' != \\'boolean\\' && ' + ($exclType) + ' != \\'undefined\\' && ' + ($exclType) + ' != \\'number\\') { ';\n    var $errorKeyword = $exclusiveKeyword;\n    var $$outStack = $$outStack || [];\n    $$outStack.push(out);\n    out = ''; /* istanbul ignore else */\n    if (it.createErrors !== false) {\n      out += ' { keyword: \\'' + ($errorKeyword || '_exclusiveLimit') + '\\' , dataPath: (dataPath || \\'\\') + ' + (it.errorPath) + ' , schemaPath: ' + (it.util.toQuotedString($errSchemaPath)) + ' , params: {} ';\n      if (it.opts.messages !== false) {\n        out += ' , message: \\'' + ($exclusiveKeyword) + ' should be boolean\\' ';\n      }\n      if (it.opts.verbose) {\n        out += ' , schema: validate.schema' + ($schemaPath) + ' , parentSchema: validate.schema' + (it.schemaPath) + ' , data: ' + ($data) + ' ';\n      }\n      out += ' } ';\n    } else {\n      out += ' {} ';\n    }\n    var __err = out;\n    out = $$outStack.pop();\n    if (!it.compositeRule && $breakOnError) { /* istanbul ignore if */\n      if (it.async) {\n        out += ' throw new ValidationError([' + (__err) + ']); ';\n      } else {\n        out += ' validate.errors = [' + (__err) + ']; return false; ';\n      }\n    } else {\n      out += ' var err = ' + (__err) + ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ';\n    }\n    out += ' } else if ( ';\n    if ($isData) {\n      out += ' (' + ($schemaValue) + ' !== undefined && typeof ' + ($schemaValue) + ' != \\'number\\') || ';\n    }\n    out += ' ' + ($exclType) + ' == \\'number\\' ? ( (' + ($exclusive) + ' = ' + ($schemaValue) + ' === undefined || ' + ($schemaValueExcl) + ' ' + ($op) + '= ' + ($schemaValue) + ') ? ' + ($data) + ' ' + ($notOp) + '= ' + ($schemaValueExcl) + ' : ' + ($data) + ' ' + ($notOp) + ' ' + ($schemaValue) + ' ) : ( (' + ($exclusive) + ' = ' + ($schemaValueExcl) + ' === true) ? ' + ($data) + ' ' + ($notOp) + '= ' + ($schemaValue) + ' : ' + ($data) + ' ' + ($notOp) + ' ' + ($schemaValue) + ' ) || ' + ($data) + ' !== ' + ($data) + ') { var op' + ($lvl) + ' = ' + ($exclusive) + ' ? \\'' + ($op) + '\\' : \\'' + ($op) + '=\\'; ';\n    if ($schema === undefined) {\n      $errorKeyword = $exclusiveKeyword;\n      $errSchemaPath = it.errSchemaPath + '/' + $exclusiveKeyword;\n      $schemaValue = $schemaValueExcl;\n      $isData = $isDataExcl;\n    }\n  } else {\n    var $exclIsNumber = typeof $schemaExcl == 'number',\n      $opStr = $op;\n    if ($exclIsNumber && $isData) {\n      var $opExpr = '\\'' + $opStr + '\\'';\n      out += ' if ( ';\n      if ($isData) {\n        out += ' (' + ($schemaValue) + ' !== undefined && typeof ' + ($schemaValue) + ' != \\'number\\') || ';\n      }\n      out += ' ( ' + ($schemaValue) + ' === undefined || ' + ($schemaExcl) + ' ' + ($op) + '= ' + ($schemaValue) + ' ? ' + ($data) + ' ' + ($notOp) + '= ' + ($schemaExcl) + ' : ' + ($data) + ' ' + ($notOp) + ' ' + ($schemaValue) + ' ) || ' + ($data) + ' !== ' + ($data) + ') { ';\n    } else {\n      if ($exclIsNumber && $schema === undefined) {\n        $exclusive = true;\n        $errorKeyword = $exclusiveKeyword;\n        $errSchemaPath = it.errSchemaPath + '/' + $exclusiveKeyword;\n        $schemaValue = $schemaExcl;\n        $notOp += '=';\n      } else {\n        if ($exclIsNumber) $schemaValue = Math[$isMax ? 'min' : 'max']($schemaExcl, $schema);\n        if ($schemaExcl === ($exclIsNumber ? $schemaValue : true)) {\n          $exclusive = true;\n          $errorKeyword = $exclusiveKeyword;\n          $errSchemaPath = it.errSchemaPath + '/' + $exclusiveKeyword;\n          $notOp += '=';\n        } else {\n          $exclusive = false;\n          $opStr += '=';\n        }\n      }\n      var $opExpr = '\\'' + $opStr + '\\'';\n      out += ' if ( ';\n      if ($isData) {\n        out += ' (' + ($schemaValue) + ' !== undefined && typeof ' + ($schemaValue) + ' != \\'number\\') || ';\n      }\n      out += ' ' + ($data) + ' ' + ($notOp) + ' ' + ($schemaValue) + ' || ' + ($data) + ' !== ' + ($data) + ') { ';\n    }\n  }\n  $errorKeyword = $errorKeyword || $keyword;\n  var $$outStack = $$outStack || [];\n  $$outStack.push(out);\n  out = ''; /* istanbul ignore else */\n  if (it.createErrors !== false) {\n    out += ' { keyword: \\'' + ($errorKeyword || '_limit') + '\\' , dataPath: (dataPath || \\'\\') + ' + (it.errorPath) + ' , schemaPath: ' + (it.util.toQuotedString($errSchemaPath)) + ' , params: { comparison: ' + ($opExpr) + ', limit: ' + ($schemaValue) + ', exclusive: ' + ($exclusive) + ' } ';\n    if (it.opts.messages !== false) {\n      out += ' , message: \\'should be ' + ($opStr) + ' ';\n      if ($isData) {\n        out += '\\' + ' + ($schemaValue);\n      } else {\n        out += '' + ($schemaValue) + '\\'';\n      }\n    }\n    if (it.opts.verbose) {\n      out += ' , schema:  ';\n      if ($isData) {\n        out += 'validate.schema' + ($schemaPath);\n      } else {\n        out += '' + ($schema);\n      }\n      out += '         , parentSchema: validate.schema' + (it.schemaPath) + ' , data: ' + ($data) + ' ';\n    }\n    out += ' } ';\n  } else {\n    out += ' {} ';\n  }\n  var __err = out;\n  out = $$outStack.pop();\n  if (!it.compositeRule && $breakOnError) { /* istanbul ignore if */\n    if (it.async) {\n      out += ' throw new ValidationError([' + (__err) + ']); ';\n    } else {\n      out += ' validate.errors = [' + (__err) + ']; return false; ';\n    }\n  } else {\n    out += ' var err = ' + (__err) + ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ';\n  }\n  out += ' } ';\n  if ($breakOnError) {\n    out += ' else { ';\n  }\n  return out;\n}\n// ./~/scratch-parser/~/ajv/lib/dotjs/_limit.js\n// module id = 821\n// module chunks = 0\n//# sourceURL=scratch:///./~/scratch-parser/~/ajv/lib/dotjs/_limit.js?");
 })