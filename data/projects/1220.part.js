/* 1220 */
 (function(module, exports) {
eval("/**\n * The base implementation of `_.unary` without support for storing metadata.\n *\n * @private\n * @param {Function} func The function to cap arguments for.\n * @returns {Function} Returns the new capped function.\n */\nfunction baseUnary(func) {\n  return function(value) {\n    return func(value);\n  };\n}\nmodule.exports = baseUnary;\n// ./~/lodash/_baseUnary.js\n// module id = 1220\n// module chunks = 0\n//# sourceURL=scratch:///./~/lodash/_baseUnary.js?");
 })