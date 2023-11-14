/* 1346 */
 (function(module, exports, __webpack_require__) {
eval("/* eslint-disable vars-on-top, no-var, prefer-template */\nvar isRegExp = __webpack_require__(1231);\nvar escapeRegExp = __webpack_require__(1228);\nvar isString = __webpack_require__(1232);\nvar flatten = __webpack_require__(1229);\n/**\n * Given a string, replace every substring that is matched by the `match` regex\n * with the result of calling `fn` on matched substring. The result will be an\n * array with all odd indexed elements containing the replacements. The primary\n * use case is similar to using String.prototype.replace execpt for React.\n *\n * React will happily render an array as children of a react element, which\n * makes this approach very useful for tasks like surrounding certain text\n * within a string with react elements.\n *\n * Example:\n * matchReplace(\n *   'Emphasize all phone numbers like 884-555-4443.',\n *   /([\\d|-]+)/g,\n *   (number, i) => <strong key={i}>{number}</strong>\n * );\n * // => ['Emphasize all phone numbers like ', <strong>884-555-4443</strong>, '.'\n *\n * @param {string} str\n * @param {regexp|str} match Must contain a matching group\n * @param {function} fn\n * @return {array}\n */\nfunction replaceString(str, match, fn) {\n  var curCharStart = 0;\n  var curCharLen = 0;\n  if (str === '') {\n    return str;\n  } else if (!str || !isString(str)) {\n    throw new TypeError('First argument to react-string-replace#replaceString must be a string');\n  }\n  var re = match;\n  if (!isRegExp(re)) {\n    re = new RegExp('(' + escapeRegExp(re) + ')', 'gi');\n  }\n  var result = str.split(re);\n  // Apply fn to all odd elements\n  for (var i = 1, length = result.length; i < length; i += 2) {\n    curCharLen = result[i].length;\n    curCharStart += result[i - 1].length;\n    result[i] = fn(result[i], i, curCharStart);\n    curCharStart += curCharLen;\n  }\n  return result;\n}\nmodule.exports = function reactStringReplace(source, match, fn) {\n  if (!Array.isArray(source)) source = [source];\n  return flatten(source.map(function(x) {\n    return isString(x) ? replaceString(x, match, fn) : x;\n  }));\n};\n// ./~/react-string-replace/index.js\n// module id = 1346\n// module chunks = 0\n//# sourceURL=scratch:///./~/react-string-replace/index.js?");
 })