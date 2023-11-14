/* 825 */
 (function(module, exports, __webpack_require__) {
"use strict";
eval("\nmodule.exports = function generate_validate(it, $keyword, $ruleType) {\n  var out = '';\n  var $async = it.schema.$async === true,\n    $refKeywords = it.util.schemaHasRulesExcept(it.schema, it.RULES.all, '$ref'),\n    $id = it.self._getId(it.schema);\n  if (it.isTop) {\n    out += ' var validate = ';\n    if ($async) {\n      it.async = true;\n      out += 'async ';\n    }\n    out += 'function(data, dataPath, parentData, parentDataProperty, rootData) { \\'use strict\\'; ';\n    if ($id && (it.opts.sourceCode || it.opts.processCode)) {\n      out += ' ' + ('/\\*# sourceURL=' + $id + ' */') + ' ';\n    }\n  }\n  if (typeof it.schema == 'boolean' || !($refKeywords || it.schema.$ref)) {\n    var $keyword = 'false schema';\n    var $lvl = it.level;\n    var $dataLvl = it.dataLevel;\n    var $schema = it.schema[$keyword];\n    var $schemaPath = it.schemaPath + it.util.getProperty($keyword);\n    var $errSchemaPath = it.errSchemaPath + '/' + $keyword;\n    var $breakOnError = !it.opts.allErrors;\n    var $errorKeyword;\n    var $data = 'data' + ($dataLvl || '');\n    var $valid = 'valid' + $lvl;\n    if (it.schema === false) {\n      if (it.isTop) {\n        $breakOnError = true;\n      } else {\n        out += ' var ' + ($valid) + ' = false; ';\n      }\n      var $$outStack = $$outStack || [];\n      $$outStack.push(out);\n      out = ''; /* istanbul ignore else */\n      if (it.createErrors !== false) {\n        out += ' { keyword: \\'' + ($errorKeyword || 'false schema') + '\\' , dataPath: (dataPath || \\'\\') + ' + (it.errorPath) + ' , schemaPath: ' + (it.util.toQuotedString($errSchemaPath)) + ' , params: {} ';\n        if (it.opts.messages !== false) {\n          out += ' , message: \\'boolean schema is false\\' ';\n        }\n        if (it.opts.verbose) {\n          out += ' , schema: false , parentSchema: validate.schema' + (it.schemaPath) + ' , data: ' + ($data) + ' ';\n        }\n        out += ' } ';\n      } else {\n        out += ' {} ';\n      }\n      var __err = out;\n      out = $$outStack.pop();\n      if (!it.compositeRule && $breakOnError) { /* istanbul ignore if */\n        if (it.async) {\n          out += ' throw new ValidationError([' + (__err) + ']); ';\n        } else {\n          out += ' validate.errors = [' + (__err) + ']; return false; ';\n        }\n      } else {\n        out += ' var err = ' + (__err) + ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ';\n      }\n    } else {\n      if (it.isTop) {\n        if ($async) {\n          out += ' return data; ';\n        } else {\n          out += ' validate.errors = null; return true; ';\n        }\n      } else {\n        out += ' var ' + ($valid) + ' = true; ';\n      }\n    }\n    if (it.isTop) {\n      out += ' }; return validate; ';\n    }\n    return out;\n  }\n  if (it.isTop) {\n    var $top = it.isTop,\n      $lvl = it.level = 0,\n      $dataLvl = it.dataLevel = 0,\n      $data = 'data';\n    it.rootId = it.resolve.fullPath(it.self._getId(it.root.schema));\n    it.baseId = it.baseId || it.rootId;\n    delete it.isTop;\n    it.dataPathArr = [undefined];\n    out += ' var vErrors = null; ';\n    out += ' var errors = 0;     ';\n    out += ' if (rootData === undefined) rootData = data; ';\n  } else {\n    var $lvl = it.level,\n      $dataLvl = it.dataLevel,\n      $data = 'data' + ($dataLvl || '');\n    if ($id) it.baseId = it.resolve.url(it.baseId, $id);\n    if ($async && !it.async) throw new Error('async schema in sync schema');\n    out += ' var errs_' + ($lvl) + ' = errors;';\n  }\n  var $valid = 'valid' + $lvl,\n    $breakOnError = !it.opts.allErrors,\n    $closingBraces1 = '',\n    $closingBraces2 = '';\n  var $errorKeyword;\n  var $typeSchema = it.schema.type,\n    $typeIsArray = Array.isArray($typeSchema);\n  if ($typeIsArray && $typeSchema.length == 1) {\n    $typeSchema = $typeSchema[0];\n    $typeIsArray = false;\n  }\n  if (it.schema.$ref && $refKeywords) {\n    if (it.opts.extendRefs == 'fail') {\n      throw new Error('$ref: validation keywords used in schema at path \"' + it.errSchemaPath + '\" (see option extendRefs)');\n    } else if (it.opts.extendRefs !== true) {\n      $refKeywords = false;\n      it.logger.warn('$ref: keywords ignored in schema at path \"' + it.errSchemaPath + '\"');\n    }\n  }\n  if (it.schema.$comment && it.opts.$comment) {\n    out += ' ' + (it.RULES.all.$comment.code(it, '$comment'));\n  }\n  if ($typeSchema) {\n    if (it.opts.coerceTypes) {\n      var $coerceToTypes = it.util.coerceToTypes(it.opts.coerceTypes, $typeSchema);\n    }\n    var $rulesGroup = it.RULES.types[$typeSchema];\n    if ($coerceToTypes || $typeIsArray || $rulesGroup === true || ($rulesGroup && !$shouldUseGroup($rulesGroup))) {\n      var $schemaPath = it.schemaPath + '.type',\n        $errSchemaPath = it.errSchemaPath + '/type';\n      var $schemaPath = it.schemaPath + '.type',\n        $errSchemaPath = it.errSchemaPath + '/type',\n        $method = $typeIsArray ? 'checkDataTypes' : 'checkDataType';\n      out += ' if (' + (it.util[$method]($typeSchema, $data, true)) + ') { ';\n      if ($coerceToTypes) {\n        var $dataType = 'dataType' + $lvl,\n          $coerced = 'coerced' + $lvl;\n        out += ' var ' + ($dataType) + ' = typeof ' + ($data) + '; ';\n        if (it.opts.coerceTypes == 'array') {\n          out += ' if (' + ($dataType) + ' == \\'object\\' && Array.isArray(' + ($data) + ')) ' + ($dataType) + ' = \\'array\\'; ';\n        }\n        out += ' var ' + ($coerced) + ' = undefined; ';\n        var $bracesCoercion = '';\n        var arr1 = $coerceToTypes;\n        if (arr1) {\n          var $type, $i = -1,\n            l1 = arr1.length - 1;\n          while ($i < l1) {\n            $type = arr1[$i += 1];\n            if ($i) {\n              out += ' if (' + ($coerced) + ' === undefined) { ';\n              $bracesCoercion += '}';\n            }\n            if (it.opts.coerceTypes == 'array' && $type != 'array') {\n              out += ' if (' + ($dataType) + ' == \\'array\\' && ' + ($data) + '.length == 1) { ' + ($coerced) + ' = ' + ($data) + ' = ' + ($data) + '[0]; ' + ($dataType) + ' = typeof ' + ($data) + ';  } ';\n            }\n            if ($type == 'string') {\n              out += ' if (' + ($dataType) + ' == \\'number\\' || ' + ($dataType) + ' == \\'boolean\\') ' + ($coerced) + ' = \\'\\' + ' + ($data) + '; else if (' + ($data) + ' === null) ' + ($coerced) + ' = \\'\\'; ';\n            } else if ($type == 'number' || $type == 'integer') {\n              out += ' if (' + ($dataType) + ' == \\'boolean\\' || ' + ($data) + ' === null || (' + ($dataType) + ' == \\'string\\' && ' + ($data) + ' && ' + ($data) + ' == +' + ($data) + ' ';\n              if ($type == 'integer') {\n                out += ' && !(' + ($data) + ' % 1)';\n              }\n              out += ')) ' + ($coerced) + ' = +' + ($data) + '; ';\n            } else if ($type == 'boolean') {\n              out += ' if (' + ($data) + ' === \\'false\\' || ' + ($data) + ' === 0 || ' + ($data) + ' === null) ' + ($coerced) + ' = false; else if (' + ($data) + ' === \\'true\\' || ' + ($data) + ' === 1) ' + ($coerced) + ' = true; ';\n            } else if ($type == 'null') {\n              out += ' if (' + ($data) + ' === \\'\\' || ' + ($data) + ' === 0 || ' + ($data) + ' === false) ' + ($coerced) + ' = null; ';\n            } else if (it.opts.coerceTypes == 'array' && $type == 'array') {\n              out += ' if (' + ($dataType) + ' == \\'string\\' || ' + ($dataType) + ' == \\'number\\' || ' + ($dataType) + ' == \\'boolean\\' || ' + ($data) + ' == null) ' + ($coerced) + ' = [' + ($data) + ']; ';\n            }\n          }\n        }\n        out += ' ' + ($bracesCoercion) + ' if (' + ($coerced) + ' === undefined) {   ';\n        var $$outStack = $$outStack || [];\n        $$outStack.push(out);\n        out = ''; /* istanbul ignore else */\n        if (it.createErrors !== false) {\n          out += ' { keyword: \\'' + ($errorKeyword || 'type') + '\\' , dataPath: (dataPath || \\'\\') + ' + (it.errorPath) + ' , schemaPath: ' + (it.util.toQuotedString($errSchemaPath)) + ' , params: { type: \\'';\n          if ($typeIsArray) {\n            out += '' + ($typeSchema.join(\",\"));\n          } else {\n            out += '' + ($typeSchema);\n          }\n          out += '\\' } ';\n          if (it.opts.messages !== false) {\n            out += ' , message: \\'should be ';\n            if ($typeIsArray) {\n              out += '' + ($typeSchema.join(\",\"));\n            } else {\n              out += '' + ($typeSchema);\n            }\n            out += '\\' ';\n          }\n          if (it.opts.verbose) {\n            out += ' , schema: validate.schema' + ($schemaPath) + ' , parentSchema: validate.schema' + (it.schemaPath) + ' , data: ' + ($data) + ' ';\n          }\n          out += ' } ';\n        } else {\n          out += ' {} ';\n        }\n        var __err = out;\n        out = $$outStack.pop();\n        if (!it.compositeRule && $breakOnError) { /* istanbul ignore if */\n          if (it.async) {\n            out += ' throw new ValidationError([' + (__err) + ']); ';\n          } else {\n            out += ' validate.errors = [' + (__err) + ']; return false; ';\n          }\n        } else {\n          out += ' var err = ' + (__err) + ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ';\n        }\n        out += ' } else {  ';\n        var $parentData = $dataLvl ? 'data' + (($dataLvl - 1) || '') : 'parentData',\n          $parentDataProperty = $dataLvl ? it.dataPathArr[$dataLvl] : 'parentDataProperty';\n        out += ' ' + ($data) + ' = ' + ($coerced) + '; ';\n        if (!$dataLvl) {\n          out += 'if (' + ($parentData) + ' !== undefined)';\n        }\n        out += ' ' + ($parentData) + '[' + ($parentDataProperty) + '] = ' + ($coerced) + '; } ';\n      } else {\n        var $$outStack = $$outStack || [];\n        $$outStack.push(out);\n        out = ''; /* istanbul ignore else */\n        if (it.createErrors !== false) {\n          out += ' { keyword: \\'' + ($errorKeyword || 'type') + '\\' , dataPath: (dataPath || \\'\\') + ' + (it.errorPath) + ' , schemaPath: ' + (it.util.toQuotedString($errSchemaPath)) + ' , params: { type: \\'';\n          if ($typeIsArray) {\n            out += '' + ($typeSchema.join(\",\"));\n          } else {\n            out += '' + ($typeSchema);\n          }\n          out += '\\' } ';\n          if (it.opts.messages !== false) {\n            out += ' , message: \\'should be ';\n            if ($typeIsArray) {\n              out += '' + ($typeSchema.join(\",\"));\n            } else {\n              out += '' + ($typeSchema);\n            }\n            out += '\\' ';\n          }\n          if (it.opts.verbose) {\n            out += ' , schema: validate.schema' + ($schemaPath) + ' , parentSchema: validate.schema' + (it.schemaPath) + ' , data: ' + ($data) + ' ';\n          }\n          out += ' } ';\n        } else {\n          out += ' {} ';\n        }\n        var __err = out;\n        out = $$outStack.pop();\n        if (!it.compositeRule && $breakOnError) { /* istanbul ignore if */\n          if (it.async) {\n            out += ' throw new ValidationError([' + (__err) + ']); ';\n          } else {\n            out += ' validate.errors = [' + (__err) + ']; return false; ';\n          }\n        } else {\n          out += ' var err = ' + (__err) + ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ';\n        }\n      }\n      out += ' } ';\n    }\n  }\n  if (it.schema.$ref && !$refKeywords) {\n    out += ' ' + (it.RULES.all.$ref.code(it, '$ref')) + ' ';\n    if ($breakOnError) {\n      out += ' } if (errors === ';\n      if ($top) {\n        out += '0';\n      } else {\n        out += 'errs_' + ($lvl);\n      }\n      out += ') { ';\n      $closingBraces2 += '}';\n    }\n  } else {\n    var arr2 = it.RULES;\n    if (arr2) {\n      var $rulesGroup, i2 = -1,\n        l2 = arr2.length - 1;\n      while (i2 < l2) {\n        $rulesGroup = arr2[i2 += 1];\n        if ($shouldUseGroup($rulesGroup)) {\n          if ($rulesGroup.type) {\n            out += ' if (' + (it.util.checkDataType($rulesGroup.type, $data)) + ') { ';\n          }\n          if (it.opts.useDefaults && !it.compositeRule) {\n            if ($rulesGroup.type == 'object' && it.schema.properties) {\n              var $schema = it.schema.properties,\n                $schemaKeys = Object.keys($schema);\n              var arr3 = $schemaKeys;\n              if (arr3) {\n                var $propertyKey, i3 = -1,\n                  l3 = arr3.length - 1;\n                while (i3 < l3) {\n                  $propertyKey = arr3[i3 += 1];\n                  var $sch = $schema[$propertyKey];\n                  if ($sch.default !== undefined) {\n                    var $passData = $data + it.util.getProperty($propertyKey);\n                    out += '  if (' + ($passData) + ' === undefined) ' + ($passData) + ' = ';\n                    if (it.opts.useDefaults == 'shared') {\n                      out += ' ' + (it.useDefault($sch.default)) + ' ';\n                    } else {\n                      out += ' ' + (JSON.stringify($sch.default)) + ' ';\n                    }\n                    out += '; ';\n                  }\n                }\n              }\n            } else if ($rulesGroup.type == 'array' && Array.isArray(it.schema.items)) {\n              var arr4 = it.schema.items;\n              if (arr4) {\n                var $sch, $i = -1,\n                  l4 = arr4.length - 1;\n                while ($i < l4) {\n                  $sch = arr4[$i += 1];\n                  if ($sch.default !== undefined) {\n                    var $passData = $data + '[' + $i + ']';\n                    out += '  if (' + ($passData) + ' === undefined) ' + ($passData) + ' = ';\n                    if (it.opts.useDefaults == 'shared') {\n                      out += ' ' + (it.useDefault($sch.default)) + ' ';\n                    } else {\n                      out += ' ' + (JSON.stringify($sch.default)) + ' ';\n                    }\n                    out += '; ';\n                  }\n                }\n              }\n            }\n          }\n          var arr5 = $rulesGroup.rules;\n          if (arr5) {\n            var $rule, i5 = -1,\n              l5 = arr5.length - 1;\n            while (i5 < l5) {\n              $rule = arr5[i5 += 1];\n              if ($shouldUseRule($rule)) {\n                var $code = $rule.code(it, $rule.keyword, $rulesGroup.type);\n                if ($code) {\n                  out += ' ' + ($code) + ' ';\n                  if ($breakOnError) {\n                    $closingBraces1 += '}';\n                  }\n                }\n              }\n            }\n          }\n          if ($breakOnError) {\n            out += ' ' + ($closingBraces1) + ' ';\n            $closingBraces1 = '';\n          }\n          if ($rulesGroup.type) {\n            out += ' } ';\n            if ($typeSchema && $typeSchema === $rulesGroup.type && !$coerceToTypes) {\n              out += ' else { ';\n              var $schemaPath = it.schemaPath + '.type',\n                $errSchemaPath = it.errSchemaPath + '/type';\n              var $$outStack = $$outStack || [];\n              $$outStack.push(out);\n              out = ''; /* istanbul ignore else */\n              if (it.createErrors !== false) {\n                out += ' { keyword: \\'' + ($errorKeyword || 'type') + '\\' , dataPath: (dataPath || \\'\\') + ' + (it.errorPath) + ' , schemaPath: ' + (it.util.toQuotedString($errSchemaPath)) + ' , params: { type: \\'';\n                if ($typeIsArray) {\n                  out += '' + ($typeSchema.join(\",\"));\n                } else {\n                  out += '' + ($typeSchema);\n                }\n                out += '\\' } ';\n                if (it.opts.messages !== false) {\n                  out += ' , message: \\'should be ';\n                  if ($typeIsArray) {\n                    out += '' + ($typeSchema.join(\",\"));\n                  } else {\n                    out += '' + ($typeSchema);\n                  }\n                  out += '\\' ';\n                }\n                if (it.opts.verbose) {\n                  out += ' , schema: validate.schema' + ($schemaPath) + ' , parentSchema: validate.schema' + (it.schemaPath) + ' , data: ' + ($data) + ' ';\n                }\n                out += ' } ';\n              } else {\n                out += ' {} ';\n              }\n              var __err = out;\n              out = $$outStack.pop();\n              if (!it.compositeRule && $breakOnError) { /* istanbul ignore if */\n                if (it.async) {\n                  out += ' throw new ValidationError([' + (__err) + ']); ';\n                } else {\n                  out += ' validate.errors = [' + (__err) + ']; return false; ';\n                }\n              } else {\n                out += ' var err = ' + (__err) + ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ';\n              }\n              out += ' } ';\n            }\n          }\n          if ($breakOnError) {\n            out += ' if (errors === ';\n            if ($top) {\n              out += '0';\n            } else {\n              out += 'errs_' + ($lvl);\n            }\n            out += ') { ';\n            $closingBraces2 += '}';\n          }\n        }\n      }\n    }\n  }\n  if ($breakOnError) {\n    out += ' ' + ($closingBraces2) + ' ';\n  }\n  if ($top) {\n    if ($async) {\n      out += ' if (errors === 0) return data;           ';\n      out += ' else throw new ValidationError(vErrors); ';\n    } else {\n      out += ' validate.errors = vErrors; ';\n      out += ' return errors === 0;       ';\n    }\n    out += ' }; return validate;';\n  } else {\n    out += ' var ' + ($valid) + ' = errors === errs_' + ($lvl) + ';';\n  }\n  out = it.util.cleanUpCode(out);\n  if ($top) {\n    out = it.util.finalCleanUpCode(out, $async);\n  }\n  function $shouldUseGroup($rulesGroup) {\n    var rules = $rulesGroup.rules;\n    for (var i = 0; i < rules.length; i++)\n      if ($shouldUseRule(rules[i])) return true;\n  }\n  function $shouldUseRule($rule) {\n    return it.schema[$rule.keyword] !== undefined || ($rule.implements && $ruleImplementsSomeKeyword($rule));\n  }\n  function $ruleImplementsSomeKeyword($rule) {\n    var impl = $rule.implements;\n    for (var i = 0; i < impl.length; i++)\n      if (it.schema[impl[i]] !== undefined) return true;\n  }\n  return out;\n}\n// ./~/scratch-parser/~/ajv/lib/dotjs/validate.js\n// module id = 825\n// module chunks = 0\n//# sourceURL=scratch:///./~/scratch-parser/~/ajv/lib/dotjs/validate.js?");
 })