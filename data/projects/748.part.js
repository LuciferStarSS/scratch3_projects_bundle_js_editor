/* 748 */
 (function(module, __webpack_exports__, __webpack_require__) {
"use strict";
eval("var isProduction = \"development\" === 'production';\nfunction warning(condition, message) {\n  if (!isProduction) {\n    if (condition) {\n      return;\n    }\n    var text = \"Warning: \" + message;\n    if (typeof console !== 'undefined') {\n      console.warn(text);\n    }\n    try {\n      throw Error(text);\n    } catch (x) {}\n  }\n}\n/* harmony default export */ __webpack_exports__[\"a\"] = (warning);\n// ./~/tiny-warning/dist/tiny-warning.esm.js\n// module id = 748\n// module chunks = 0 1\n//# sourceURL=scratch:///./~/tiny-warning/dist/tiny-warning.esm.js?");
 })