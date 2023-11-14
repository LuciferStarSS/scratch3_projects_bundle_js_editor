/* 1109 */\n (function(module, exports, __webpack_require__) {\n\"use strict\";\n/**\n * Representation a of zip file in js\n * @constructor\n */\nfunction JSZip() {\n    // if this constructor is used without `new`, it adds `new` before itself:\n    if(!(this instanceof JSZip)) {\n        return new JSZip();\n    }\n    if(arguments.length) {\n        throw new Error(\"The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.\");\n    }\n    // object containing the files :\n    // {\n    //   \"folder/\" : {...},\n    //   \"folder/data.txt\" : {...}\n    // }\n    this.files = {};\n    this.comment = null;\n    // Where we are in the hierarchy\n    this.root = \"\";\n    this.clone = function() {\n        var newObj = new JSZip();\n        for (var i in this) {\n            if (typeof this[i] !== \"function\") {\n                newObj[i] = this[i];\n            }\n        }\n        return newObj;\n    };\n}\nJSZip.prototype = __webpack_require__(1110);\nJSZip.prototype.loadAsync = __webpack_require__(1133);\nJSZip.support = __webpack_require__(116);\nJSZip.defaults = __webpack_require__(462);\n// TODO find a better way to handle this version,\n// a require('package.json').version doesn't work with webpack, see #327\nJSZip.version = \"3.1.5\";\nJSZip.loadAsync = function (content, options) {\n    return new JSZip().loadAsync(content, options);\n};\nJSZip.external = __webpack_require__(185);\nmodule.exports = JSZip;\n })