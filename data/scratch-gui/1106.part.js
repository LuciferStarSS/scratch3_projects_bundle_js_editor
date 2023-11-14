/* 1106 */\n (function(module, exports, __webpack_require__) {\n\"use strict\";\nfunction _typeof(obj) { \"@babel/helpers - typeof\"; if (typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; }; } return _typeof(obj); }\nvar processFn = function processFn(fn, options) {\n  return function () {\n    var _this = this;\n    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {\n      args[_key] = arguments[_key];\n    }\n    var P = options.promiseModule;\n    return new P(function (resolve, reject) {\n      if (options.multiArgs) {\n        args.push(function () {\n          for (var _len2 = arguments.length, result = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {\n            result[_key2] = arguments[_key2];\n          }\n          if (options.errorFirst) {\n            if (result[0]) {\n              reject(result);\n            } else {\n              result.shift();\n              resolve(result);\n            }\n          } else {\n            resolve(result);\n          }\n        });\n      } else if (options.errorFirst) {\n        args.push(function (error, result) {\n          if (error) {\n            reject(error);\n          } else {\n            resolve(result);\n          }\n        });\n      } else {\n        args.push(resolve);\n      }\n      fn.apply(_this, args);\n    });\n  };\n};\nmodule.exports = function (input, options) {\n  options = Object.assign({\n    exclude: [/.+(Sync|Stream)$/],\n    errorFirst: true,\n    promiseModule: Promise\n  }, options);\n  var objType = _typeof(input);\n  if (!(input !== null && (objType === 'object' || objType === 'function'))) {\n    throw new TypeError(\"Expected `input` to be a `Function` or `Object`, got `\".concat(input === null ? 'null' : objType, \"`\"));\n  }\n  var filter = function filter(key) {\n    var match = function match(pattern) {\n      return typeof pattern === 'string' ? key === pattern : pattern.test(key);\n    };\n    return options.include ? options.include.some(match) : !options.exclude.some(match);\n  };\n  var ret;\n  if (objType === 'function') {\n    ret = function ret() {\n      for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {\n        args[_key3] = arguments[_key3];\n      }\n      return options.excludeMain ? input.apply(void 0, args) : processFn(input, options).apply(this, args);\n    };\n  } else {\n    ret = Object.create(Object.getPrototypeOf(input));\n  }\n  for (var key in input) {\n    // eslint-disable-line guard-for-in\n    var property = input[key];\n    ret[key] = typeof property === 'function' && filter(key) ? processFn(property, options) : property;\n  }\n  return ret;\n};\n })