/* 1383 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nmodule.exports = function generate_comment(it, $keyword, $ruleType) {\n  var out = ' ';\n  var $schema = it.schema[$keyword];\n  var $errSchemaPath = it.errSchemaPath + '/' + $keyword;\n  var $breakOnError = !it.opts.allErrors;\n  var $comment = it.util.toQuotedString($schema);\n  if (it.opts.$comment === true) {\n    out += ' console.log(' + ($comment) + ');';\n  } else if (typeof it.opts.$comment == 'function') {\n    out += ' self._opts.$comment(' + ($comment) + ', ' + (it.util.toQuotedString($errSchemaPath)) + ', validate.root.schema);';\n  }\n  return out;\n}\n\n\n//////////////////\n// WEBPACK FOOTER\n// ./~/scratch-parser/~/ajv/lib/dotjs/comment.js\n// module id = 1383\n// module chunks = 0\n\n//# sourceURL=scratch:///./~/scratch-parser/~/ajv/lib/dotjs/comment.js?");

/***/ })