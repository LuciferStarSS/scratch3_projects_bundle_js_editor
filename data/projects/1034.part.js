/* 1034 */
 (function(module, exports) {
eval("// fast apply, http://jsperf.lnkit.com/fast-apply/5\nmodule.exports = function(fn, args, that){\n  var un = that === undefined;\n  switch(args.length){\n    case 0: return un ? fn()\n                      : fn.call(that);\n    case 1: return un ? fn(args[0])\n                      : fn.call(that, args[0]);\n    case 2: return un ? fn(args[0], args[1])\n                      : fn.call(that, args[0], args[1]);\n    case 3: return un ? fn(args[0], args[1], args[2])\n                      : fn.call(that, args[0], args[1], args[2]);\n    case 4: return un ? fn(args[0], args[1], args[2], args[3])\n                      : fn.call(that, args[0], args[1], args[2], args[3]);\n  } return              fn.apply(that, args);\n};\n// ./~/core-js/library/modules/_invoke.js\n// module id = 1034\n// module chunks = 0\n//# sourceURL=scratch:///./~/core-js/library/modules/_invoke.js?");
 })