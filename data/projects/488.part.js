/* 488 */
 (function(module, exports, __webpack_require__) {
eval("(function(Buffer) {// Copyright Joyent, Inc. and other Node contributors.\n//\n// Permission is hereby granted, free of charge, to any person obtaining a\n// copy of this software and associated documentation files (the\n// \"Software\"), to deal in the Software without restriction, including\n// without limitation the rights to use, copy, modify, merge, publish,\n// distribute, sublicense, and/or sell copies of the Software, and to permit\n// persons to whom the Software is furnished to do so, subject to the\n// following conditions:\n//\n// The above copyright notice and this permission notice shall be included\n// in all copies or substantial portions of the Software.\n//\n// THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS\n// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF\n// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN\n// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,\n// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR\n// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE\n// USE OR OTHER DEALINGS IN THE SOFTWARE.\n// NOTE: These type checking functions intentionally don't use `instanceof`\n// because it is fragile and can be easily faked with `Object.create()`.\nfunction isArray(arg) {\n  if (Array.isArray) {\n    return Array.isArray(arg);\n  }\n  return objectToString(arg) === '[object Array]';\n}\nexports.isArray = isArray;\nfunction isBoolean(arg) {\n  return typeof arg === 'boolean';\n}\nexports.isBoolean = isBoolean;\nfunction isNull(arg) {\n  return arg === null;\n}\nexports.isNull = isNull;\nfunction isNullOrUndefined(arg) {\n  return arg == null;\n}\nexports.isNullOrUndefined = isNullOrUndefined;\nfunction isNumber(arg) {\n  return typeof arg === 'number';\n}\nexports.isNumber = isNumber;\nfunction isString(arg) {\n  return typeof arg === 'string';\n}\nexports.isString = isString;\nfunction isSymbol(arg) {\n  return typeof arg === 'symbol';\n}\nexports.isSymbol = isSymbol;\nfunction isUndefined(arg) {\n  return arg === void 0;\n}\nexports.isUndefined = isUndefined;\nfunction isRegExp(re) {\n  return objectToString(re) === '[object RegExp]';\n}\nexports.isRegExp = isRegExp;\nfunction isObject(arg) {\n  return typeof arg === 'object' && arg !== null;\n}\nexports.isObject = isObject;\nfunction isDate(d) {\n  return objectToString(d) === '[object Date]';\n}\nexports.isDate = isDate;\nfunction isError(e) {\n  return (objectToString(e) === '[object Error]' || e instanceof Error);\n}\nexports.isError = isError;\nfunction isFunction(arg) {\n  return typeof arg === 'function';\n}\nexports.isFunction = isFunction;\nfunction isPrimitive(arg) {\n  return arg === null ||\n         typeof arg === 'boolean' ||\n         typeof arg === 'number' ||\n         typeof arg === 'string' ||\n         typeof arg === 'symbol' ||  // ES6 symbol\n         typeof arg === 'undefined';\n}\nexports.isPrimitive = isPrimitive;\nexports.isBuffer = Buffer.isBuffer;\nfunction objectToString(o) {\n  return Object.prototype.toString.call(o);\n}\n}.call(exports, __webpack_require__(269).Buffer))\n// ./~/core-util-is/lib/util.js\n// module id = 488\n// module chunks = 0\n//# sourceURL=scratch:///./~/core-util-is/lib/util.js?");
 })