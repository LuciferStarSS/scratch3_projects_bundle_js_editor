/* 87 */
 (function(module, exports, __webpack_require__) {
"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\n/** JSDoc */\nvar Severity;\n(function (Severity) {\n    /** JSDoc */\n    Severity[\"Fatal\"] = \"fatal\";\n    /** JSDoc */\n    Severity[\"Error\"] = \"error\";\n    /** JSDoc */\n    Severity[\"Warning\"] = \"warning\";\n    /** JSDoc */\n    Severity[\"Log\"] = \"log\";\n    /** JSDoc */\n    Severity[\"Info\"] = \"info\";\n    /** JSDoc */\n    Severity[\"Debug\"] = \"debug\";\n    /** JSDoc */\n    Severity[\"Critical\"] = \"critical\";\n})(Severity = exports.Severity || (exports.Severity = {}));\n// tslint:disable:no-unnecessary-qualifier no-namespace\n(function (Severity) {\n    /**\n     * Converts a string-based level into a {@link Severity}.\n     *\n     * @param level string representation of Severity\n     * @returns Severity\n     */\n    function fromString(level) {\n        switch (level) {\n            case 'debug':\n                return Severity.Debug;\n            case 'info':\n                return Severity.Info;\n            case 'warn':\n            case 'warning':\n                return Severity.Warning;\n            case 'error':\n                return Severity.Error;\n            case 'fatal':\n                return Severity.Fatal;\n            case 'critical':\n                return Severity.Critical;\n            case 'log':\n            default:\n                return Severity.Log;\n        }\n    }\n    Severity.fromString = fromString;\n})(Severity = exports.Severity || (exports.Severity = {}));\n/** The status of an event. */\nvar Status;\n(function (Status) {\n    /** The status could not be determined. */\n    Status[\"Unknown\"] = \"unknown\";\n    /** The event was skipped due to configuration or callbacks. */\n    Status[\"Skipped\"] = \"skipped\";\n    /** The event was sent to Sentry successfully. */\n    Status[\"Success\"] = \"success\";\n    /** The client is currently rate limited and will try again later. */\n    Status[\"RateLimit\"] = \"rate_limit\";\n    /** The event could not be processed. */\n    Status[\"Invalid\"] = \"invalid\";\n    /** A server-side error ocurred during submission. */\n    Status[\"Failed\"] = \"failed\";\n})(Status = exports.Status || (exports.Status = {}));\n// tslint:disable:no-unnecessary-qualifier no-namespace\n(function (Status) {\n    /**\n     * Converts a HTTP status code into a {@link Status}.\n     *\n     * @param code The HTTP response status code.\n     * @returns The send status or {@link Status.Unknown}.\n     */\n    function fromHttpCode(code) {\n        if (code >= 200 && code < 300) {\n            return Status.Success;\n        }\n        if (code === 429) {\n            return Status.RateLimit;\n        }\n        if (code >= 400 && code < 500) {\n            return Status.Invalid;\n        }\n        if (code >= 500) {\n            return Status.Failed;\n        }\n        return Status.Unknown;\n    }\n    Status.fromHttpCode = fromHttpCode;\n})(Status = exports.Status || (exports.Status = {}));\n/*# sourceMappingURL=index.js.map*/\n// ./~/@sentry/types/dist/index.js\n// module id = 87\n// module chunks = 0 1 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39\n//# sourceURL=scratch:///./~/@sentry/types/dist/index.js?");
 })