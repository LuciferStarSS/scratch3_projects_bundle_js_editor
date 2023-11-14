/* 1067 */\n (function(module, exports, __webpack_require__) {\n\"use strict\";\nvar toStr = Object.prototype.toString;\nvar isPrimitive = __webpack_require__(1068);\nvar isCallable = __webpack_require__(300);\n// http://ecma-international.org/ecma-262/5.1/#sec-8.12.8\nvar ES5internalSlots = {\n\t'[[DefaultValue]]': function (O) {\n\t\tvar actualHint;\n\t\tif (arguments.length > 1) {\n\t\t\tactualHint = arguments[1];\n\t\t} else {\n\t\t\tactualHint = toStr.call(O) === '[object Date]' ? String : Number;\n\t\t}\n\t\tif (actualHint === String || actualHint === Number) {\n\t\t\tvar methods = actualHint === String ? ['toString', 'valueOf'] : ['valueOf', 'toString'];\n\t\t\tvar value, i;\n\t\t\tfor (i = 0; i < methods.length; ++i) {\n\t\t\t\tif (isCallable(O[methods[i]])) {\n\t\t\t\t\tvalue = O[methods[i]]();\n\t\t\t\t\tif (isPrimitive(value)) {\n\t\t\t\t\t\treturn value;\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t\tthrow new TypeError('No default value');\n\t\t}\n\t\tthrow new TypeError('invalid [[DefaultValue]] hint supplied');\n\t}\n};\n// http://ecma-international.org/ecma-262/5.1/#sec-9.1\nmodule.exports = function ToPrimitive(input) {\n\tif (isPrimitive(input)) {\n\t\treturn input;\n\t}\n\tif (arguments.length > 1) {\n\t\treturn ES5internalSlots['[[DefaultValue]]'](input, arguments[1]);\n\t}\n\treturn ES5internalSlots['[[DefaultValue]]'](input);\n};\n })