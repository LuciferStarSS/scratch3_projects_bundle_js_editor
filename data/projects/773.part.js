/* 773 */
 (function(module, exports, __webpack_require__) {
"use strict";
eval("\nvar GenericWorker = __webpack_require__(251);\nexports.STORE = {\n    magic: \"\\x00\\x00\",\n    compressWorker : function (compressionOptions) {\n        return new GenericWorker(\"STORE compression\");\n    },\n    uncompressWorker : function () {\n        return new GenericWorker(\"STORE decompression\");\n    }\n};\nexports.DEFLATE = __webpack_require__(1172);\n// ./~/jszip/lib/compressions.js\n// module id = 773\n// module chunks = 0\n//# sourceURL=scratch:///./~/jszip/lib/compressions.js?");
 })