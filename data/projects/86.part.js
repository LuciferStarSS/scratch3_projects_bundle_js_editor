/* 86 */
 (function(module, exports, __webpack_require__) {
"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar tslib_1 = __webpack_require__(6);\nvar hub_1 = __webpack_require__(8);\n/**\n * This calls a function on the current hub.\n * @param method function to call on hub.\n * @param args to pass to function.\n */\nfunction callOnHub(method) {\n    var args = [];\n    for (var _i = 1; _i < arguments.length; _i++) {\n        args[_i - 1] = arguments[_i];\n    }\n    var hub = hub_1.getCurrentHub();\n    if (hub && hub[method]) {\n        // tslint:disable-next-line:no-unsafe-any\n        return hub[method].apply(hub, tslib_1.__spread(args));\n    }\n    throw new Error(\"No hub defined or \" + method + \" was not found on the hub, please open a bug report.\");\n}\n/**\n * Captures an exception event and sends it to Sentry.\n *\n * @param exception An exception-like object.\n * @returns The generated eventId.\n */\nfunction captureException(exception) {\n    var syntheticException;\n    try {\n        throw new Error('Sentry syntheticException');\n    }\n    catch (exception) {\n        syntheticException = exception;\n    }\n    return callOnHub('captureException', exception, {\n        originalException: exception,\n        syntheticException: syntheticException,\n    });\n}\nexports.captureException = captureException;\n/**\n * Captures a message event and sends it to Sentry.\n *\n * @param message The message to send to Sentry.\n * @param level Define the level of the message.\n * @returns The generated eventId.\n */\nfunction captureMessage(message, level) {\n    var syntheticException;\n    try {\n        throw new Error(message);\n    }\n    catch (exception) {\n        syntheticException = exception;\n    }\n    return callOnHub('captureMessage', message, level, {\n        originalException: message,\n        syntheticException: syntheticException,\n    });\n}\nexports.captureMessage = captureMessage;\n/**\n * Captures a manually created event and sends it to Sentry.\n *\n * @param event The event to send to Sentry.\n * @returns The generated eventId.\n */\nfunction captureEvent(event) {\n    return callOnHub('captureEvent', event);\n}\nexports.captureEvent = captureEvent;\n/**\n * Records a new breadcrumb which will be attached to future events.\n *\n * Breadcrumbs will be added to subsequent events to provide more context on\n * user's actions prior to an error or crash.\n *\n * @param breadcrumb The breadcrumb to record.\n */\nfunction addBreadcrumb(breadcrumb) {\n    callOnHub('addBreadcrumb', breadcrumb);\n}\nexports.addBreadcrumb = addBreadcrumb;\n/**\n * Callback to set context information onto the scope.\n * @param callback Callback function that receives Scope.\n */\nfunction configureScope(callback) {\n    callOnHub('configureScope', callback);\n}\nexports.configureScope = configureScope;\n/**\n * Creates a new scope with and executes the given operation within.\n * The scope is automatically removed once the operation\n * finishes or throws.\n *\n * This is essentially a convenience function for:\n *\n *     pushScope();\n *     callback();\n *     popScope();\n *\n * @param callback that will be enclosed into push/popScope.\n */\nfunction withScope(callback) {\n    callOnHub('withScope', callback);\n}\nexports.withScope = withScope;\n/**\n * Calls a function on the latest client. Use this with caution, it's meant as\n * in \"internal\" helper so we don't need to expose every possible function in\n * the shim. It is not guaranteed that the client actually implements the\n * function.\n *\n * @param method The method to call on the client/client.\n * @param args Arguments to pass to the client/fontend.\n */\nfunction _callOnClient(method) {\n    var args = [];\n    for (var _i = 1; _i < arguments.length; _i++) {\n        args[_i - 1] = arguments[_i];\n    }\n    callOnHub.apply(void 0, tslib_1.__spread(['invokeClient', method], args));\n}\nexports._callOnClient = _callOnClient;\n/*# sourceMappingURL=index.js.map*/\n// ./~/@sentry/minimal/dist/index.js\n// module id = 86\n// module chunks = 0 1 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39\n//# sourceURL=scratch:///./~/@sentry/minimal/dist/index.js?");
 })