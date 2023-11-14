/* 482 */\n (function(module, exports, __webpack_require__) {\n\"use strict\";\n/*\nCopyright (c) 2014, Yahoo! Inc. All rights reserved.\nCopyrights licensed under the New BSD License.\nSee the accompanying LICENSE file for terms.\n*/\n/* jslint esnext: true */\nexports.extend = extend;\nvar hop = Object.prototype.hasOwnProperty;\nfunction extend(obj) {\n    var sources = Array.prototype.slice.call(arguments, 1),\n        i, len, source, key;\n    for (i = 0, len = sources.length; i < len; i += 1) {\n        source = sources[i];\n        if (!source) { continue; }\n        for (key in source) {\n            if (hop.call(source, key)) {\n                obj[key] = source[key];\n            }\n        }\n    }\n    return obj;\n}\nexports.hop = hop;\n/*# sourceMappingURL=utils.js.map*/ })