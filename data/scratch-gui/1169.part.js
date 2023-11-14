/* 1169 */\n (function(module, exports, __webpack_require__) {\n\"use strict\";\nmodule.exports = function generate_properties(it, $keyword, $ruleType) {\n  var out = ' ';\n  var $lvl = it.level;\n  var $dataLvl = it.dataLevel;\n  var $schema = it.schema[$keyword];\n  var $schemaPath = it.schemaPath + it.util.getProperty($keyword);\n  var $errSchemaPath = it.errSchemaPath + '/' + $keyword;\n  var $breakOnError = !it.opts.allErrors;\n  var $data = 'data' + ($dataLvl || '');\n  var $errs = 'errs__' + $lvl;\n  var $it = it.util.copy(it);\n  var $closingBraces = '';\n  $it.level++;\n  var $nextValid = 'valid' + $it.level;\n  var $key = 'key' + $lvl,\n    $idx = 'idx' + $lvl,\n    $dataNxt = $it.dataLevel = it.dataLevel + 1,\n    $nextData = 'data' + $dataNxt,\n    $dataProperties = 'dataProperties' + $lvl;\n  var $schemaKeys = Object.keys($schema || {}),\n    $pProperties = it.schema.patternProperties || {},\n    $pPropertyKeys = Object.keys($pProperties),\n    $aProperties = it.schema.additionalProperties,\n    $someProperties = $schemaKeys.length || $pPropertyKeys.length,\n    $noAdditional = $aProperties === false,\n    $additionalIsSchema = typeof $aProperties == 'object' && Object.keys($aProperties).length,\n    $removeAdditional = it.opts.removeAdditional,\n    $checkAdditional = $noAdditional || $additionalIsSchema || $removeAdditional,\n    $ownProperties = it.opts.ownProperties,\n    $currentBaseId = it.baseId;\n  var $required = it.schema.required;\n  if ($required && !(it.opts.v5 && $required.$data) && $required.length < it.opts.loopRequired) var $requiredHash = it.util.toHash($required);\n  out += 'var ' + ($errs) + ' = errors;var ' + ($nextValid) + ' = true;';\n  if ($ownProperties) {\n    out += ' var ' + ($dataProperties) + ' = undefined;';\n  }\n  if ($checkAdditional) {\n    if ($ownProperties) {\n      out += ' ' + ($dataProperties) + ' = ' + ($dataProperties) + ' || Object.keys(' + ($data) + '); for (var ' + ($idx) + '=0; ' + ($idx) + '<' + ($dataProperties) + '.length; ' + ($idx) + '++) { var ' + ($key) + ' = ' + ($dataProperties) + '[' + ($idx) + ']; ';\n    } else {\n      out += ' for (var ' + ($key) + ' in ' + ($data) + ') { ';\n    }\n    if ($someProperties) {\n      out += ' var isAdditional' + ($lvl) + ' = !(false ';\n      if ($schemaKeys.length) {\n        if ($schemaKeys.length > 5) {\n          out += ' || validate.schema' + ($schemaPath) + '[' + ($key) + '] ';\n        } else {\n          var arr1 = $schemaKeys;\n          if (arr1) {\n            var $propertyKey, i1 = -1,\n              l1 = arr1.length - 1;\n            while (i1 < l1) {\n              $propertyKey = arr1[i1 += 1];\n              out += ' || ' + ($key) + ' == ' + (it.util.toQuotedString($propertyKey)) + ' ';\n            }\n          }\n        }\n      }\n      if ($pPropertyKeys.length) {\n        var arr2 = $pPropertyKeys;\n        if (arr2) {\n          var $pProperty, $i = -1,\n            l2 = arr2.length - 1;\n          while ($i < l2) {\n            $pProperty = arr2[$i += 1];\n            out += ' || ' + (it.usePattern($pProperty)) + '.test(' + ($key) + ') ';\n          }\n        }\n      }\n      out += ' ); if (isAdditional' + ($lvl) + ') { ';\n    }\n    if ($removeAdditional == 'all') {\n      out += ' delete ' + ($data) + '[' + ($key) + ']; ';\n    } else {\n      var $currentErrorPath = it.errorPath;\n      var $additionalProperty = '\\' + ' + $key + ' + \\'';\n      if (it.opts._errorDataPathProperty) {\n        it.errorPath = it.util.getPathExpr(it.errorPath, $key, it.opts.jsonPointers);\n      }\n      if ($noAdditional) {\n        if ($removeAdditional) {\n          out += ' delete ' + ($data) + '[' + ($key) + ']; ';\n        } else {\n          out += ' ' + ($nextValid) + ' = false; ';\n          var $currErrSchemaPath = $errSchemaPath;\n          $errSchemaPath = it.errSchemaPath + '/additionalProperties';\n          var $$outStack = $$outStack || [];\n          $$outStack.push(out);\n          out = ''; /* istanbul ignore else */\n          if (it.createErrors !== false) {\n            out += ' { keyword: \\'' + ('additionalProperties') + '\\' , dataPath: (dataPath || \\'\\') + ' + (it.errorPath) + ' , schemaPath: ' + (it.util.toQuotedString($errSchemaPath)) + ' , params: { additionalProperty: \\'' + ($additionalProperty) + '\\' } ';\n            if (it.opts.messages !== false) {\n              out += ' , message: \\'';\n              if (it.opts._errorDataPathProperty) {\n                out += 'is an invalid additional property';\n              } else {\n                out += 'should NOT have additional properties';\n              }\n              out += '\\' ';\n            }\n            if (it.opts.verbose) {\n              out += ' , schema: false , parentSchema: validate.schema' + (it.schemaPath) + ' , data: ' + ($data) + ' ';\n            }\n            out += ' } ';\n          } else {\n            out += ' {} ';\n          }\n          var __err = out;\n          out = $$outStack.pop();\n          if (!it.compositeRule && $breakOnError) { /* istanbul ignore if */\n            if (it.async) {\n              out += ' throw new ValidationError([' + (__err) + ']); ';\n            } else {\n              out += ' validate.errors = [' + (__err) + ']; return false; ';\n            }\n          } else {\n            out += ' var err = ' + (__err) + ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ';\n          }\n          $errSchemaPath = $currErrSchemaPath;\n          if ($breakOnError) {\n            out += ' break; ';\n          }\n        }\n      } else if ($additionalIsSchema) {\n        if ($removeAdditional == 'failing') {\n          out += ' var ' + ($errs) + ' = errors;  ';\n          var $wasComposite = it.compositeRule;\n          it.compositeRule = $it.compositeRule = true;\n          $it.schema = $aProperties;\n          $it.schemaPath = it.schemaPath + '.additionalProperties';\n          $it.errSchemaPath = it.errSchemaPath + '/additionalProperties';\n          $it.errorPath = it.opts._errorDataPathProperty ? it.errorPath : it.util.getPathExpr(it.errorPath, $key, it.opts.jsonPointers);\n          var $passData = $data + '[' + $key + ']';\n          $it.dataPathArr[$dataNxt] = $key;\n          var $code = it.validate($it);\n          $it.baseId = $currentBaseId;\n          if (it.util.varOccurences($code, $nextData) < 2) {\n            out += ' ' + (it.util.varReplace($code, $nextData, $passData)) + ' ';\n          } else {\n            out += ' var ' + ($nextData) + ' = ' + ($passData) + '; ' + ($code) + ' ';\n          }\n          out += ' if (!' + ($nextValid) + ') { errors = ' + ($errs) + '; if (validate.errors !== null) { if (errors) validate.errors.length = errors; else validate.errors = null; } delete ' + ($data) + '[' + ($key) + ']; }  ';\n          it.compositeRule = $it.compositeRule = $wasComposite;\n        } else {\n          $it.schema = $aProperties;\n          $it.schemaPath = it.schemaPath + '.additionalProperties';\n          $it.errSchemaPath = it.errSchemaPath + '/additionalProperties';\n          $it.errorPath = it.opts._errorDataPathProperty ? it.errorPath : it.util.getPathExpr(it.errorPath, $key, it.opts.jsonPointers);\n          var $passData = $data + '[' + $key + ']';\n          $it.dataPathArr[$dataNxt] = $key;\n          var $code = it.validate($it);\n          $it.baseId = $currentBaseId;\n          if (it.util.varOccurences($code, $nextData) < 2) {\n            out += ' ' + (it.util.varReplace($code, $nextData, $passData)) + ' ';\n          } else {\n            out += ' var ' + ($nextData) + ' = ' + ($passData) + '; ' + ($code) + ' ';\n          }\n          if ($breakOnError) {\n            out += ' if (!' + ($nextValid) + ') break; ';\n          }\n        }\n      }\n      it.errorPath = $currentErrorPath;\n    }\n    if ($someProperties) {\n      out += ' } ';\n    }\n    out += ' }  ';\n    if ($breakOnError) {\n      out += ' if (' + ($nextValid) + ') { ';\n      $closingBraces += '}';\n    }\n  }\n  var $useDefaults = it.opts.useDefaults && !it.compositeRule;\n  if ($schemaKeys.length) {\n    var arr3 = $schemaKeys;\n    if (arr3) {\n      var $propertyKey, i3 = -1,\n        l3 = arr3.length - 1;\n      while (i3 < l3) {\n        $propertyKey = arr3[i3 += 1];\n        var $sch = $schema[$propertyKey];\n        if (it.util.schemaHasRules($sch, it.RULES.all)) {\n          var $prop = it.util.getProperty($propertyKey),\n            $passData = $data + $prop,\n            $hasDefault = $useDefaults && $sch.default !== undefined;\n          $it.schema = $sch;\n          $it.schemaPath = $schemaPath + $prop;\n          $it.errSchemaPath = $errSchemaPath + '/' + it.util.escapeFragment($propertyKey);\n          $it.errorPath = it.util.getPath(it.errorPath, $propertyKey, it.opts.jsonPointers);\n          $it.dataPathArr[$dataNxt] = it.util.toQuotedString($propertyKey);\n          var $code = it.validate($it);\n          $it.baseId = $currentBaseId;\n          if (it.util.varOccurences($code, $nextData) < 2) {\n            $code = it.util.varReplace($code, $nextData, $passData);\n            var $useData = $passData;\n          } else {\n            var $useData = $nextData;\n            out += ' var ' + ($nextData) + ' = ' + ($passData) + '; ';\n          }\n          if ($hasDefault) {\n            out += ' ' + ($code) + ' ';\n          } else {\n            if ($requiredHash && $requiredHash[$propertyKey]) {\n              out += ' if ( ' + ($useData) + ' === undefined ';\n              if ($ownProperties) {\n                out += ' || ! Object.prototype.hasOwnProperty.call(' + ($data) + ', \\'' + (it.util.escapeQuotes($propertyKey)) + '\\') ';\n              }\n              out += ') { ' + ($nextValid) + ' = false; ';\n              var $currentErrorPath = it.errorPath,\n                $currErrSchemaPath = $errSchemaPath,\n                $missingProperty = it.util.escapeQuotes($propertyKey);\n              if (it.opts._errorDataPathProperty) {\n                it.errorPath = it.util.getPath($currentErrorPath, $propertyKey, it.opts.jsonPointers);\n              }\n              $errSchemaPath = it.errSchemaPath + '/required';\n              var $$outStack = $$outStack || [];\n              $$outStack.push(out);\n              out = ''; /* istanbul ignore else */\n              if (it.createErrors !== false) {\n                out += ' { keyword: \\'' + ('required') + '\\' , dataPath: (dataPath || \\'\\') + ' + (it.errorPath) + ' , schemaPath: ' + (it.util.toQuotedString($errSchemaPath)) + ' , params: { missingProperty: \\'' + ($missingProperty) + '\\' } ';\n                if (it.opts.messages !== false) {\n                  out += ' , message: \\'';\n                  if (it.opts._errorDataPathProperty) {\n                    out += 'is a required property';\n                  } else {\n                    out += 'should have required property \\\\\\'' + ($missingProperty) + '\\\\\\'';\n                  }\n                  out += '\\' ';\n                }\n                if (it.opts.verbose) {\n                  out += ' , schema: validate.schema' + ($schemaPath) + ' , parentSchema: validate.schema' + (it.schemaPath) + ' , data: ' + ($data) + ' ';\n                }\n                out += ' } ';\n              } else {\n                out += ' {} ';\n              }\n              var __err = out;\n              out = $$outStack.pop();\n              if (!it.compositeRule && $breakOnError) { /* istanbul ignore if */\n                if (it.async) {\n                  out += ' throw new ValidationError([' + (__err) + ']); ';\n                } else {\n                  out += ' validate.errors = [' + (__err) + ']; return false; ';\n                }\n              } else {\n                out += ' var err = ' + (__err) + ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ';\n              }\n              $errSchemaPath = $currErrSchemaPath;\n              it.errorPath = $currentErrorPath;\n              out += ' } else { ';\n            } else {\n              if ($breakOnError) {\n                out += ' if ( ' + ($useData) + ' === undefined ';\n                if ($ownProperties) {\n                  out += ' || ! Object.prototype.hasOwnProperty.call(' + ($data) + ', \\'' + (it.util.escapeQuotes($propertyKey)) + '\\') ';\n                }\n                out += ') { ' + ($nextValid) + ' = true; } else { ';\n              } else {\n                out += ' if (' + ($useData) + ' !== undefined ';\n                if ($ownProperties) {\n                  out += ' &&   Object.prototype.hasOwnProperty.call(' + ($data) + ', \\'' + (it.util.escapeQuotes($propertyKey)) + '\\') ';\n                }\n                out += ' ) { ';\n              }\n            }\n            out += ' ' + ($code) + ' } ';\n          }\n        }\n        if ($breakOnError) {\n          out += ' if (' + ($nextValid) + ') { ';\n          $closingBraces += '}';\n        }\n      }\n    }\n  }\n  if ($pPropertyKeys.length) {\n    var arr4 = $pPropertyKeys;\n    if (arr4) {\n      var $pProperty, i4 = -1,\n        l4 = arr4.length - 1;\n      while (i4 < l4) {\n        $pProperty = arr4[i4 += 1];\n        var $sch = $pProperties[$pProperty];\n        if (it.util.schemaHasRules($sch, it.RULES.all)) {\n          $it.schema = $sch;\n          $it.schemaPath = it.schemaPath + '.patternProperties' + it.util.getProperty($pProperty);\n          $it.errSchemaPath = it.errSchemaPath + '/patternProperties/' + it.util.escapeFragment($pProperty);\n          if ($ownProperties) {\n            out += ' ' + ($dataProperties) + ' = ' + ($dataProperties) + ' || Object.keys(' + ($data) + '); for (var ' + ($idx) + '=0; ' + ($idx) + '<' + ($dataProperties) + '.length; ' + ($idx) + '++) { var ' + ($key) + ' = ' + ($dataProperties) + '[' + ($idx) + ']; ';\n          } else {\n            out += ' for (var ' + ($key) + ' in ' + ($data) + ') { ';\n          }\n          out += ' if (' + (it.usePattern($pProperty)) + '.test(' + ($key) + ')) { ';\n          $it.errorPath = it.util.getPathExpr(it.errorPath, $key, it.opts.jsonPointers);\n          var $passData = $data + '[' + $key + ']';\n          $it.dataPathArr[$dataNxt] = $key;\n          var $code = it.validate($it);\n          $it.baseId = $currentBaseId;\n          if (it.util.varOccurences($code, $nextData) < 2) {\n            out += ' ' + (it.util.varReplace($code, $nextData, $passData)) + ' ';\n          } else {\n            out += ' var ' + ($nextData) + ' = ' + ($passData) + '; ' + ($code) + ' ';\n          }\n          if ($breakOnError) {\n            out += ' if (!' + ($nextValid) + ') break; ';\n          }\n          out += ' } ';\n          if ($breakOnError) {\n            out += ' else ' + ($nextValid) + ' = true; ';\n          }\n          out += ' }  ';\n          if ($breakOnError) {\n            out += ' if (' + ($nextValid) + ') { ';\n            $closingBraces += '}';\n          }\n        }\n      }\n    }\n  }\n  if ($breakOnError) {\n    out += ' ' + ($closingBraces) + ' if (' + ($errs) + ' == errors) {';\n  }\n  out = it.util.cleanUpCode(out);\n  return out;\n}\n })