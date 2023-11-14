/* 1216 */
 (function(module, exports, __webpack_require__) {
eval("var arrayPush = __webpack_require__(1215),\n    isFlattenable = __webpack_require__(1223);\n/**\n * The base implementation of `_.flatten` with support for restricting flattening.\n *\n * @private\n * @param {Array} array The array to flatten.\n * @param {number} depth The maximum recursion depth.\n * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.\n * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.\n * @param {Array} [result=[]] The initial result value.\n * @returns {Array} Returns the new flattened array.\n */\nfunction baseFlatten(array, depth, predicate, isStrict, result) {\n  var index = -1,\n      length = array.length;\n  predicate || (predicate = isFlattenable);\n  result || (result = []);\n  while (++index < length) {\n    var value = array[index];\n    if (depth > 0 && predicate(value)) {\n      if (depth > 1) {\n        // Recursively flatten arrays (susceptible to call stack limits).\n        baseFlatten(value, depth - 1, predicate, isStrict, result);\n      } else {\n        arrayPush(result, value);\n      }\n    } else if (!isStrict) {\n      result[result.length] = value;\n    }\n  }\n  return result;\n}\nmodule.exports = baseFlatten;\n// ./~/lodash/_baseFlatten.js\n// module id = 1216\n// module chunks = 0\n//# sourceURL=scratch:///./~/lodash/_baseFlatten.js?");
 })