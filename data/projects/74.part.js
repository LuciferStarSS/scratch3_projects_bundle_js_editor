/* 74 */
 (function(module, exports, __webpack_require__) {
"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar tslib_1 = __webpack_require__(6);\nvar logger_1 = __webpack_require__(7);\nexports.installedIntegrations = [];\n/** Gets integration to install */\nfunction getIntegrationsToSetup(options) {\n    var e_1, _a, e_2, _b;\n    var defaultIntegrations = (options.defaultIntegrations && tslib_1.__spread(options.defaultIntegrations)) || [];\n    var userIntegrations = options.integrations;\n    var integrations = [];\n    if (Array.isArray(userIntegrations)) {\n        var userIntegrationsNames = userIntegrations.map(function (i) { return i.name; });\n        var pickedIntegrationsNames = [];\n        try {\n            // Leave only unique default integrations, that were not overridden with provided user integrations\n            for (var defaultIntegrations_1 = tslib_1.__values(defaultIntegrations), defaultIntegrations_1_1 = defaultIntegrations_1.next(); !defaultIntegrations_1_1.done; defaultIntegrations_1_1 = defaultIntegrations_1.next()) {\n                var defaultIntegration = defaultIntegrations_1_1.value;\n                if (userIntegrationsNames.indexOf(getIntegrationName(defaultIntegration)) === -1 &&\n                    pickedIntegrationsNames.indexOf(getIntegrationName(defaultIntegration)) === -1) {\n                    integrations.push(defaultIntegration);\n                    pickedIntegrationsNames.push(getIntegrationName(defaultIntegration));\n                }\n            }\n        }\n        catch (e_1_1) { e_1 = { error: e_1_1 }; }\n        finally {\n            try {\n                if (defaultIntegrations_1_1 && !defaultIntegrations_1_1.done && (_a = defaultIntegrations_1.return)) _a.call(defaultIntegrations_1);\n            }\n            finally { if (e_1) throw e_1.error; }\n        }\n        try {\n            // Don't add same user integration twice\n            for (var userIntegrations_1 = tslib_1.__values(userIntegrations), userIntegrations_1_1 = userIntegrations_1.next(); !userIntegrations_1_1.done; userIntegrations_1_1 = userIntegrations_1.next()) {\n                var userIntegration = userIntegrations_1_1.value;\n                if (pickedIntegrationsNames.indexOf(getIntegrationName(userIntegration)) === -1) {\n                    integrations.push(userIntegration);\n                    pickedIntegrationsNames.push(getIntegrationName(userIntegration));\n                }\n            }\n        }\n        catch (e_2_1) { e_2 = { error: e_2_1 }; }\n        finally {\n            try {\n                if (userIntegrations_1_1 && !userIntegrations_1_1.done && (_b = userIntegrations_1.return)) _b.call(userIntegrations_1);\n            }\n            finally { if (e_2) throw e_2.error; }\n        }\n    }\n    else if (typeof userIntegrations === 'function') {\n        integrations = userIntegrations(defaultIntegrations);\n        integrations = Array.isArray(integrations) ? integrations : [integrations];\n    }\n    else {\n        return tslib_1.__spread(defaultIntegrations);\n    }\n    return integrations;\n}\nexports.getIntegrationsToSetup = getIntegrationsToSetup;\n/** Setup given integration */\nfunction setupIntegration(integration, options) {\n    if (exports.installedIntegrations.indexOf(getIntegrationName(integration)) !== -1) {\n        return;\n    }\n    try {\n        integration.setupOnce();\n    }\n    catch (_Oo) {\n        /** @deprecated */\n        // TODO: Remove in v5\n        logger_1.logger.warn(\"Integration \" + getIntegrationName(integration) + \": The install method is deprecated. Use \\\"setupOnce\\\".\");\n        // tslint:disable:deprecation\n        if (integration.install) {\n            integration.install(options);\n        }\n        // tslint:enable:deprecation\n    }\n    exports.installedIntegrations.push(getIntegrationName(integration));\n    logger_1.logger.log(\"Integration installed: \" + getIntegrationName(integration));\n}\nexports.setupIntegration = setupIntegration;\n/**\n * Given a list of integration instances this installs them all. When `withDefaults` is set to `true` then all default\n * integrations are added unless they were already provided before.\n * @param integrations array of integration instances\n * @param withDefault should enable default integrations\n */\nfunction setupIntegrations(options) {\n    var integrations = {};\n    getIntegrationsToSetup(options).forEach(function (integration) {\n        integrations[getIntegrationName(integration)] = integration;\n        setupIntegration(integration, options);\n    });\n    return integrations;\n}\nexports.setupIntegrations = setupIntegrations;\n/**\n * Returns the integration static id.\n * @param integration Integration to retrieve id\n */\nfunction getIntegrationName(integration) {\n    /**\n     * @depracted\n     */\n    // tslint:disable-next-line:no-unsafe-any\n    return integration.constructor.id || integration.name;\n}\n/*# sourceMappingURL=integration.js.map*/\n// ./~/@sentry/core/dist/integration.js\n// module id = 74\n// module chunks = 0 1 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39\n//# sourceURL=scratch:///./~/@sentry/core/dist/integration.js?");
 })