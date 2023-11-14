/* 572 */
 (function(module, exports, __webpack_require__) {
"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\nexports.default = once;\nfunction once(fn) {\n    function wrapper() {\n        if (fn === null) return;\n        var callFn = fn;\n        fn = null;\n        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {\n            args[_key] = arguments[_key];\n        }\n        callFn.apply(this, args);\n    }\n    Object.assign(wrapper, fn);\n    return wrapper;\n}\nmodule.exports = exports[\"default\"];\n// ./~/async/internal/once.js\n// module id = 572\n// module chunks = 0 8\n//# sourceURL=scratch:///./~/async/internal/once.js?");
 })