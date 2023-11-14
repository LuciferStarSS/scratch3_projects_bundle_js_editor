/* 1443 */
 (function(module, exports, __webpack_require__) {
eval("(function(global) {\n/**\n * Module exports.\n */\nmodule.exports = deprecate;\n/**\n * Mark that a method should not be used.\n * Returns a modified function which warns once by default.\n *\n * If `localStorage.noDeprecation = true` is set, then it is a no-op.\n *\n * If `localStorage.throwDeprecation = true` is set, then deprecated functions\n * will throw an Error when invoked.\n *\n * If `localStorage.traceDeprecation = true` is set, then deprecated functions\n * will invoke `console.trace()` instead of `console.error()`.\n *\n * @param {Function} fn - the function to deprecate\n * @param {String} msg - the string to print to the console when `fn` is invoked\n * @returns {Function} a new \"deprecated\" version of `fn`\n * @api public\n */\nfunction deprecate (fn, msg) {\n  if (config('noDeprecation')) {\n    return fn;\n  }\n  var warned = false;\n  function deprecated() {\n    if (!warned) {\n      if (config('throwDeprecation')) {\n        throw new Error(msg);\n      } else if (config('traceDeprecation')) {\n        console.trace(msg);\n      } else {\n        console.warn(msg);\n      }\n      warned = true;\n    }\n    return fn.apply(this, arguments);\n  }\n  return deprecated;\n}\n/**\n * Checks `localStorage` for boolean values for the given `name`.\n *\n * @param {String} name\n * @returns {Boolean}\n * @api private\n */\nfunction config (name) {\n  // accessing global.localStorage can trigger a DOMException in sandboxed iframes\n  try {\n    if (!global.localStorage) return false;\n  } catch (_) {\n    return false;\n  }\n  var val = global.localStorage[name];\n  if (null == val) return false;\n  return String(val).toLowerCase() === 'true';\n}\n}.call(exports, __webpack_require__(21)))\n// ./~/util-deprecate/browser.js\n// module id = 1443\n// module chunks = 0\n//# sourceURL=scratch:///./~/util-deprecate/browser.js?");
 })