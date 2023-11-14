/* 77 */
 (function(module, exports, __webpack_require__) {
"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar originalFunctionToString;\n/** Patch toString calls to return proper name for wrapped functions */\nvar FunctionToString = /** @class */ (function () {\n    function FunctionToString() {\n        /**\n         * @inheritDoc\n         */\n        this.name = FunctionToString.id;\n    }\n    /**\n     * @inheritDoc\n     */\n    FunctionToString.prototype.setupOnce = function () {\n        originalFunctionToString = Function.prototype.toString;\n        Function.prototype.toString = function () {\n            var args = [];\n            for (var _i = 0; _i < arguments.length; _i++) {\n                args[_i] = arguments[_i];\n            }\n            var context = this.__sentry__ ? this.__sentry_original__ : this;\n            // tslint:disable-next-line:no-unsafe-any\n            return originalFunctionToString.apply(context, args);\n        };\n    };\n    /**\n     * @inheritDoc\n     */\n    FunctionToString.id = 'FunctionToString';\n    return FunctionToString;\n}());\nexports.FunctionToString = FunctionToString;\n/*# sourceMappingURL=functiontostring.js.map*/\n// ./~/@sentry/core/dist/integrations/functiontostring.js\n// module id = 77\n// module chunks = 0 1 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39\n//# sourceURL=scratch:///./~/@sentry/core/dist/integrations/functiontostring.js?");
 })