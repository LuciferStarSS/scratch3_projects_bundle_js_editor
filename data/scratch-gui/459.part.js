/* 459 */\n (function(module, exports) {\nmodule.exports = function(exec){\n  try {\n    return !!exec();\n  } catch(e){\n    return true;\n  }\n};\n })