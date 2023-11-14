/* 89 */
 (function(module, exports, __webpack_require__) {
"use strict";
eval("\n// Slightly modified (no IE8 support, ES6) and transcribed to TypeScript\n// https://raw.githubusercontent.com/calvinmetcalf/rollup-plugin-node-builtins/master/src/es6/path.js\nObject.defineProperty(exports, \"__esModule\", { value: true });\n/** JSDoc */\nfunction normalizeArray(parts, allowAboveRoot) {\n    // if the path tries to go above the root, `up` ends up > 0\n    var up = 0;\n    for (var i = parts.length - 1; i >= 0; i--) {\n        var last = parts[i];\n        if (last === '.') {\n            parts.splice(i, 1);\n        }\n        else if (last === '..') {\n            parts.splice(i, 1);\n            up++;\n        }\n        else if (up) {\n            parts.splice(i, 1);\n            up--;\n        }\n    }\n    // if the path is allowed to go above the root, restore leading ..s\n    if (allowAboveRoot) {\n        for (; up--; up) {\n            parts.unshift('..');\n        }\n    }\n    return parts;\n}\n// Split a filename into [root, dir, basename, ext], unix version\n// 'root' is just a slash, or nothing.\nvar splitPathRe = /^(\\/?|)([\\s\\S]*?)((?:\\.{1,2}|[^\\/]+?|)(\\.[^.\\/]*|))(?:[\\/]*)$/;\n/** JSDoc */\nfunction splitPath(filename) {\n    var parts = splitPathRe.exec(filename);\n    return parts ? parts.slice(1) : [];\n}\n// path.resolve([from ...], to)\n// posix version\n/** JSDoc */\nfunction resolve() {\n    var args = [];\n    for (var _i = 0; _i < arguments.length; _i++) {\n        args[_i] = arguments[_i];\n    }\n    var resolvedPath = '';\n    var resolvedAbsolute = false;\n    for (var i = args.length - 1; i >= -1 && !resolvedAbsolute; i--) {\n        var path = i >= 0 ? args[i] : '/';\n        // Skip empty entries\n        if (!path) {\n            continue;\n        }\n        resolvedPath = path + \"/\" + resolvedPath;\n        resolvedAbsolute = path.charAt(0) === '/';\n    }\n    // At this point the path should be resolved to a full absolute path, but\n    // handle relative paths to be safe (might happen when process.cwd() fails)\n    // Normalize the path\n    resolvedPath = normalizeArray(resolvedPath.split('/').filter(function (p) { return !!p; }), !resolvedAbsolute).join('/');\n    return (resolvedAbsolute ? '/' : '') + resolvedPath || '.';\n}\nexports.resolve = resolve;\n/** JSDoc */\nfunction trim(arr) {\n    var start = 0;\n    for (; start < arr.length; start++) {\n        if (arr[start] !== '') {\n            break;\n        }\n    }\n    var end = arr.length - 1;\n    for (; end >= 0; end--) {\n        if (arr[end] !== '') {\n            break;\n        }\n    }\n    if (start > end) {\n        return [];\n    }\n    return arr.slice(start, end - start + 1);\n}\n// path.relative(from, to)\n// posix version\n/** JSDoc */\nfunction relative(from, to) {\n    // tslint:disable:no-parameter-reassignment\n    from = resolve(from).substr(1);\n    to = resolve(to).substr(1);\n    var fromParts = trim(from.split('/'));\n    var toParts = trim(to.split('/'));\n    var length = Math.min(fromParts.length, toParts.length);\n    var samePartsLength = length;\n    for (var i = 0; i < length; i++) {\n        if (fromParts[i] !== toParts[i]) {\n            samePartsLength = i;\n            break;\n        }\n    }\n    var outputParts = [];\n    for (var i = samePartsLength; i < fromParts.length; i++) {\n        outputParts.push('..');\n    }\n    outputParts = outputParts.concat(toParts.slice(samePartsLength));\n    return outputParts.join('/');\n}\nexports.relative = relative;\n// path.normalize(path)\n// posix version\n/** JSDoc */\nfunction normalize(path) {\n    var isPathAbsolute = isAbsolute(path);\n    var trailingSlash = path.substr(-1) === '/';\n    // Normalize the path\n    var normalizedPath = normalizeArray(path.split('/').filter(function (p) { return !!p; }), !isPathAbsolute).join('/');\n    if (!normalizedPath && !isPathAbsolute) {\n        normalizedPath = '.';\n    }\n    if (normalizedPath && trailingSlash) {\n        normalizedPath += '/';\n    }\n    return (isPathAbsolute ? '/' : '') + normalizedPath;\n}\nexports.normalize = normalize;\n// posix version\n/** JSDoc */\nfunction isAbsolute(path) {\n    return path.charAt(0) === '/';\n}\nexports.isAbsolute = isAbsolute;\n// posix version\n/** JSDoc */\nfunction join() {\n    var args = [];\n    for (var _i = 0; _i < arguments.length; _i++) {\n        args[_i] = arguments[_i];\n    }\n    return normalize(args.join('/'));\n}\nexports.join = join;\n/** JSDoc */\nfunction dirname(path) {\n    var result = splitPath(path);\n    var root = result[0];\n    var dir = result[1];\n    if (!root && !dir) {\n        // No dirname whatsoever\n        return '.';\n    }\n    if (dir) {\n        // It has a dirname, strip trailing slash\n        dir = dir.substr(0, dir.length - 1);\n    }\n    return root + dir;\n}\nexports.dirname = dirname;\n/** JSDoc */\nfunction basename(path, ext) {\n    var f = splitPath(path)[2];\n    if (ext && f.substr(ext.length * -1) === ext) {\n        f = f.substr(0, f.length - ext.length);\n    }\n    return f;\n}\nexports.basename = basename;\n/*# sourceMappingURL=path.js.map*/\n// ./~/@sentry/utils/path.js\n// module id = 89\n// module chunks = 0 1 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39\n//# sourceURL=scratch:///./~/@sentry/utils/path.js?");
 })