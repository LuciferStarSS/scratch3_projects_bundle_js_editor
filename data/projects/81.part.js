/* 81 */
 (function(module, exports, __webpack_require__) {
"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar tslib_1 = __webpack_require__(6);\nvar hub_1 = __webpack_require__(8);\nvar path_1 = __webpack_require__(89);\n/** Rewrite event frames paths */\nvar RewriteFrames = /** @class */ (function () {\n    /**\n     * @inheritDoc\n     */\n    function RewriteFrames(options) {\n        if (options === void 0) { options = {}; }\n        var _this = this;\n        /**\n         * @inheritDoc\n         */\n        this.name = RewriteFrames.id;\n        /**\n         * @inheritDoc\n         */\n        this.iteratee = function (frame) { return tslib_1.__awaiter(_this, void 0, void 0, function () {\n            var base;\n            return tslib_1.__generator(this, function (_a) {\n                if (frame.filename && frame.filename.startsWith('/')) {\n                    base = this.root ? path_1.relative(this.root, frame.filename) : path_1.basename(frame.filename);\n                    frame.filename = \"app:///\" + base;\n                }\n                return [2 /*return*/, frame];\n            });\n        }); };\n        if (options.root) {\n            this.root = options.root;\n        }\n        if (options.iteratee) {\n            this.iteratee = options.iteratee;\n        }\n    }\n    /**\n     * @inheritDoc\n     */\n    RewriteFrames.prototype.setupOnce = function () {\n        var _this = this;\n        hub_1.addGlobalEventProcessor(function (event) { return tslib_1.__awaiter(_this, void 0, void 0, function () {\n            var self;\n            return tslib_1.__generator(this, function (_a) {\n                self = hub_1.getCurrentHub().getIntegration(RewriteFrames);\n                if (self) {\n                    return [2 /*return*/, self.process(event)];\n                }\n                return [2 /*return*/, event];\n            });\n        }); });\n    };\n    /** JSDoc */\n    RewriteFrames.prototype.process = function (event) {\n        return tslib_1.__awaiter(this, void 0, void 0, function () {\n            var frames, _a, _b, _i, i, _c, _d;\n            return tslib_1.__generator(this, function (_e) {\n                switch (_e.label) {\n                    case 0:\n                        frames = this.getFramesFromEvent(event);\n                        if (!frames) return [3 /*break*/, 4];\n                        _a = [];\n                        for (_b in frames)\n                            _a.push(_b);\n                        _i = 0;\n                        _e.label = 1;\n                    case 1:\n                        if (!(_i < _a.length)) return [3 /*break*/, 4];\n                        i = _a[_i];\n                        // tslint:disable-next-line\n                        _c = frames;\n                        _d = i;\n                        return [4 /*yield*/, this.iteratee(frames[i])];\n                    case 2:\n                        // tslint:disable-next-line\n                        _c[_d] = _e.sent();\n                        _e.label = 3;\n                    case 3:\n                        _i++;\n                        return [3 /*break*/, 1];\n                    case 4: return [2 /*return*/, event];\n                }\n            });\n        });\n    };\n    /** JSDoc */\n    RewriteFrames.prototype.getFramesFromEvent = function (event) {\n        var exception = event.exception;\n        if (exception) {\n            try {\n                // tslint:disable-next-line:no-unsafe-any\n                return exception.values[0].stacktrace.frames;\n            }\n            catch (_oO) {\n                return undefined;\n            }\n        }\n        else if (event.stacktrace) {\n            return event.stacktrace.frames;\n        }\n        else {\n            return undefined;\n        }\n    };\n    /**\n     * @inheritDoc\n     */\n    RewriteFrames.id = 'RewriteFrames';\n    return RewriteFrames;\n}());\nexports.RewriteFrames = RewriteFrames;\n/*# sourceMappingURL=rewriteframes.js.map*/\n// ./~/@sentry/core/dist/integrations/pluggable/rewriteframes.js\n// module id = 81\n// module chunks = 0 1 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39\n//# sourceURL=scratch:///./~/@sentry/core/dist/integrations/pluggable/rewriteframes.js?");
 })