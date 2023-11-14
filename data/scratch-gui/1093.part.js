/* 1093 */\n (function(module, exports) {\nfunction _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }\nfunction _nonIterableRest() { throw new TypeError(\"Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.\"); }\nfunction _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === \"string\") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === \"Object\" && o.constructor) n = o.constructor.name; if (n === \"Map\" || n === \"Set\") return Array.from(o); if (n === \"Arguments\" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }\nfunction _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }\nfunction _iterableToArrayLimit(arr, i) { if (typeof Symbol === \"undefined\" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i[\"return\"] != null) _i[\"return\"](); } finally { if (_d) throw _e; } } return _arr; }\nfunction _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\nvar Scratch3ProcedureBlocks = function () {\n  function Scratch3ProcedureBlocks(runtime) {\n    _classCallCheck(this, Scratch3ProcedureBlocks);\n    /**\n     * The runtime instantiating this block package.\n     * @type {Runtime}\n     */\n    this.runtime = runtime;\n  }\n  /**\n   * Retrieve the block primitives implemented by this package.\n   * @return {object.<string, Function>} Mapping of opcode to Function.\n   */\n  _createClass(Scratch3ProcedureBlocks, [{\n    key: \"getPrimitives\",\n    value: function getPrimitives() {\n      return {\n        procedures_definition: this.definition,\n        procedures_call: this.call,\n        argument_reporter_string_number: this.argumentReporterStringNumber,\n        argument_reporter_boolean: this.argumentReporterBoolean\n      };\n    }\n  }, {\n    key: \"definition\",\n    value: function definition() {// No-op: execute the blocks.\n    }\n  }, {\n    key: \"call\",\n    value: function call(args, util) {\n      if (!util.stackFrame.executed) {\n        var procedureCode = args.mutation.proccode;\n        var paramNamesIdsAndDefaults = util.getProcedureParamNamesIdsAndDefaults(procedureCode); // If null, procedure could not be found, which can happen if custom\n        // block is dragged between sprites without the definition.\n        // Match Scratch 2.0 behavior and noop.\n        if (paramNamesIdsAndDefaults === null) {\n          return;\n        }\n        var _paramNamesIdsAndDefa = _slicedToArray(paramNamesIdsAndDefaults, 3),\n            paramNames = _paramNamesIdsAndDefa[0],\n            paramIds = _paramNamesIdsAndDefa[1],\n            paramDefaults = _paramNamesIdsAndDefa[2]; // Initialize params for the current stackFrame to {}, even if the procedure does\n        // not take any arguments. This is so that `getParam` down the line does not look\n        // at earlier stack frames for the values of a given parameter (#1729)\n        util.initParams();\n        for (var i = 0; i < paramIds.length; i++) {\n          if (args.hasOwnProperty(paramIds[i])) {\n            util.pushParam(paramNames[i], args[paramIds[i]]);\n          } else {\n            util.pushParam(paramNames[i], paramDefaults[i]);\n          }\n        }\n        util.stackFrame.executed = true;\n        util.startProcedure(procedureCode);\n      }\n    }\n  }, {\n    key: \"argumentReporterStringNumber\",\n    value: function argumentReporterStringNumber(args, util) {\n      var value = util.getParam(args.VALUE);\n      if (value === null) {\n        // When the parameter is not found in the most recent procedure\n        // call, the default is always 0.\n        return 0;\n      }\n      return value;\n    }\n  }, {\n    key: \"argumentReporterBoolean\",\n    value: function argumentReporterBoolean(args, util) {\n      var value = util.getParam(args.VALUE);\n      if (value === null) {\n        // When the parameter is not found in the most recent procedure\n        // call, the default is always 0.\n        return 0;\n      }\n      return value;\n    }\n  }]);\n  return Scratch3ProcedureBlocks;\n}();\nmodule.exports = Scratch3ProcedureBlocks;\n })