/* 1036 */
 (function(module, exports) {
eval("module.exports = function(bitmap, value){\n  return {\n    enumerable  : !(bitmap & 1),\n    configurable: !(bitmap & 2),\n    writable    : !(bitmap & 4),\n    value       : value\n  };\n};\n// ./~/core-js/library/modules/_property-desc.js\n// module id = 1036\n// module chunks = 0\n//# sourceURL=scratch:///./~/core-js/library/modules/_property-desc.js?");
 })