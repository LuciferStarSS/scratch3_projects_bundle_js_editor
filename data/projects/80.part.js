/* 80 */
 (function(module, exports, __webpack_require__) {
"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar tslib_1 = __webpack_require__(6);\nvar hub_1 = __webpack_require__(8);\n/** JSDoc */\nvar Debug = /** @class */ (function () {\n    /**\n     * @inheritDoc\n     */\n    function Debug(options) {\n        /**\n         * @inheritDoc\n         */\n        this.name = Debug.id;\n        this.options = tslib_1.__assign({ debugger: false, stringify: false }, options);\n    }\n    /**\n     * @inheritDoc\n     */\n    Debug.prototype.setupOnce = function () {\n        var _this = this;\n        hub_1.addGlobalEventProcessor(function (event, hint) { return tslib_1.__awaiter(_this, void 0, void 0, function () {\n            var self;\n            return tslib_1.__generator(this, function (_a) {\n                self = hub_1.getCurrentHub().getIntegration(Debug);\n                if (self) {\n                    // tslint:disable:no-console\n                    // tslint:disable:no-debugger\n                    if (self.options.debugger) {\n                        debugger;\n                    }\n                    if (self.options.stringify) {\n                      //console.log(JSON.stringify(event, null, 2));\n                        if (hint) {\n                          //console.log(JSON.stringify(hint, null, 2));\n                        }\n                    }\n                    else {\n                      //console.log(event);\n                        if (hint) {\n                          //console.log(hint);\n                        }\n                    }\n                }\n                return [2 /*return*/, event];\n            });\n        }); });\n    };\n    /**\n     * @inheritDoc\n     */\n    Debug.id = 'Debug';\n    return Debug;\n}());\nexports.Debug = Debug;\n/*# sourceMappingURL=debug.js.map*/\n// ./~/@sentry/core/dist/integrations/pluggable/debug.js\n// module id = 80\n// module chunks = 0 1 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39\n//# sourceURL=scratch:///./~/@sentry/core/dist/integrations/pluggable/debug.js?");
 })