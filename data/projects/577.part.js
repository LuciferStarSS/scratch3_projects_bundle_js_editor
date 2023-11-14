/* 577 */
 (function(module, exports, __webpack_require__) {
"use strict";
eval("\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n/**\n * Base class for asset load/save helpers.\n * @abstract\n */\nvar Helper = function () {\n    function Helper(parent) {\n        _classCallCheck(this, Helper);\n        this.parent = parent;\n    }\n    /**\n     * Fetch an asset but don't process dependencies.\n     * @param {AssetType} assetType - The type of asset to fetch.\n     * @param {string} assetId - The ID of the asset to fetch: a project ID, MD5, etc.\n     * @param {DataFormat} dataFormat - The file format / file extension of the asset to fetch: PNG, JPG, etc.\n     * @return {Promise.<Asset>} A promise for the contents of the asset.\n     */\n    _createClass(Helper, [{\n        key: \"load\",\n        value: function load(assetType, assetId, dataFormat) {\n            return Promise.reject(new Error(\"No asset of type \" + assetType + \" for ID \" + assetId + \" with format \" + dataFormat));\n        }\n    }]);\n    return Helper;\n}();\nmodule.exports = Helper;\n// ./~/scratch-storage/src/Helper.js\n// module id = 577\n// module chunks = 0\n//# sourceURL=scratch:///./~/scratch-storage/src/Helper.js?");
 })