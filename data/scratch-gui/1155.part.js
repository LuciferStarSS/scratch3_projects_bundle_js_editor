/* 1155 */\n (function(module, exports, __webpack_require__) {\n\"use strict\";\nmodule.exports = function generate_allOf(it, $keyword, $ruleType) {\n  var out = ' ';\n  var $schema = it.schema[$keyword];\n  var $schemaPath = it.schemaPath + it.util.getProperty($keyword);\n  var $errSchemaPath = it.errSchemaPath + '/' + $keyword;\n  var $breakOnError = !it.opts.allErrors;\n  var $it = it.util.copy(it);\n  var $closingBraces = '';\n  $it.level++;\n  var $nextValid = 'valid' + $it.level;\n  var $currentBaseId = $it.baseId,\n    $allSchemasEmpty = true;\n  var arr1 = $schema;\n  if (arr1) {\n    var $sch, $i = -1,\n      l1 = arr1.length - 1;\n    while ($i < l1) {\n      $sch = arr1[$i += 1];\n      if (it.util.schemaHasRules($sch, it.RULES.all)) {\n        $allSchemasEmpty = false;\n        $it.schema = $sch;\n        $it.schemaPath = $schemaPath + '[' + $i + ']';\n        $it.errSchemaPath = $errSchemaPath + '/' + $i;\n        out += '  ' + (it.validate($it)) + ' ';\n        $it.baseId = $currentBaseId;\n        if ($breakOnError) {\n          out += ' if (' + ($nextValid) + ') { ';\n          $closingBraces += '}';\n        }\n      }\n    }\n  }\n  if ($breakOnError) {\n    if ($allSchemasEmpty) {\n      out += ' if (true) { ';\n    } else {\n      out += ' ' + ($closingBraces.slice(0, -1)) + ' ';\n    }\n  }\n  out = it.util.cleanUpCode(out);\n  return out;\n}\n })