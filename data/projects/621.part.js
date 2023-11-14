/* 621 */
 (function(module, exports) {
eval("exports = module.exports = typeof Object.keys === 'function'\n  ? Object.keys : shim;\nexports.shim = shim;\nfunction shim (obj) {\n  var keys = [];\n  for (var key in obj) keys.push(key);\n  return keys;\n}\n// ./~/deep-equal/lib/keys.js\n// module id = 621\n// module chunks = 0 8\n//# sourceURL=scratch:///./~/deep-equal/lib/keys.js?");
 })