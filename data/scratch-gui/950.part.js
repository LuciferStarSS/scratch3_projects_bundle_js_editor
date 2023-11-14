/* 950 */\n (function(module, exports, __webpack_require__) {\nvar Transform = __webpack_require__(112),\n    color = __webpack_require__(427),\n    colors = { debug: ['gray'], info: ['purple' ], warn: [ 'yellow', true ], error: [ 'red', true ] },\n    logger = new Transform();\nlogger.write = function(name, level, args) {\n  var fn = console.log;\n  if(level != 'debug' && console[level]) {\n    fn = console[level];\n  }\n  var subset = [], i = 0;\n  if(level != 'info') {\n    for(; i < args.length; i++) {\n      if(typeof args[i] != 'string') break;\n    }\n    fn.apply(console, [ '%c'+name +' '+ args.slice(0, i).join(' '), color.apply(color, colors[level]) ].concat(args.slice(i)));\n  } else {\n    fn.apply(console, [ '%c'+name, color.apply(color, colors[level]) ].concat(args));\n  }\n};\n// NOP, because piping the formatted logs can only cause trouble.\nlogger.pipe = function() { };\nmodule.exports = logger;\n })