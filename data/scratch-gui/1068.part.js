/* 1068 */\n (function(module, exports) {\nmodule.exports = function isPrimitive(value) {\n\treturn value === null || (typeof value !== 'function' && typeof value !== 'object');\n};\n })