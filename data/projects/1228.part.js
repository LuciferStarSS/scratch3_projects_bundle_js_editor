/* 1228 */
 (function(module, exports, __webpack_require__) {
eval("var toString = __webpack_require__(1234);\n/**\n * Used to match `RegExp`\n * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).\n */\nvar reRegExpChar = /[\\\\^$.*+?()[\\]{}|]/g,\n    reHasRegExpChar = RegExp(reRegExpChar.source);\n/**\n * Escapes the `RegExp` special characters \"^\", \"$\", \"\\\", \".\", \"*\", \"+\",\n * \"?\", \"(\", \")\", \"[\", \"]\", \"{\", \"}\", and \"|\" in `string`.\n *\n * @static\n * @memberOf _\n * @since 3.0.0\n * @category String\n * @param {string} [string=''] The string to escape.\n * @returns {string} Returns the escaped string.\n * @example\n *\n * _.escapeRegExp('[lodash](https://lodash.com/)');\n * // => '\\[lodash\\]\\(https://lodash\\.com/\\)'\n */\nfunction escapeRegExp(string) {\n  string = toString(string);\n  return (string && reHasRegExpChar.test(string))\n    ? string.replace(reRegExpChar, '\\\\$&')\n    : string;\n}\nmodule.exports = escapeRegExp;\n// ./~/lodash/escapeRegExp.js\n// module id = 1228\n// module chunks = 0\n//# sourceURL=scratch:///./~/lodash/escapeRegExp.js?");
 })