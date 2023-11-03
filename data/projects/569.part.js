/* 569 */
 (function(module, exports, __webpack_require__) {
"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\nexports.default = function (fn) {\n    return function () /*, callback*/{\n        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {\n            args[_key] = arguments[_key];\n        }\n        var callback = args.pop();\n        return fn.call(this, args, callback);\n    };\n};\nmodule.exports = exports[\"default\"];\n// ./~/async/internal/initialParams.js\n// module id = 569\n// module chunks = 0 8\n//# sourceURL=scratch:///./~/async/internal/initialParams.js?");
 })