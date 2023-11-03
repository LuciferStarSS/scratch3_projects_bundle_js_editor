/* 573 */
 (function(module, exports, __webpack_require__) {
"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\nexports.default = onlyOnce;\nfunction onlyOnce(fn) {\n    return function () {\n        if (fn === null) throw new Error(\"Callback was already called.\");\n        var callFn = fn;\n        fn = null;\n        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {\n            args[_key] = arguments[_key];\n        }\n        callFn.apply(this, args);\n    };\n}\nmodule.exports = exports[\"default\"];\n// ./~/async/internal/onlyOnce.js\n// module id = 573\n// module chunks = 0 8\n//# sourceURL=scratch:///./~/async/internal/onlyOnce.js?");
 })