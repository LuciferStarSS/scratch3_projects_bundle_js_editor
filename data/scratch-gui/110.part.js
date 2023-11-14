/* 110 */\n (function(module, exports, __webpack_require__) {\n\"use strict\";\n(function(Buffer) {\nexports.base64 = true;\nexports.array = true;\nexports.string = true;\nexports.arraybuffer = typeof ArrayBuffer !== \"undefined\" && typeof Uint8Array !== \"undefined\";\nexports.nodebuffer = typeof Buffer !== \"undefined\";\n// contains true if JSZip can read/generate Uint8Array, false otherwise.\nexports.uint8array = typeof Uint8Array !== \"undefined\";\nif (typeof ArrayBuffer === \"undefined\") {\n    exports.blob = false;\n}\nelse {\n    var buffer = new ArrayBuffer(0);\n    try {\n        exports.blob = new Blob([buffer], {\n            type: \"application/zip\"\n        }).size === 0;\n    }\n    catch (e) {\n        try {\n            var Builder = self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder;\n            var builder = new Builder();\n            builder.append(buffer);\n            exports.blob = builder.getBlob('application/zip').size === 0;\n        }\n        catch (e) {\n            exports.blob = false;\n        }\n    }\n}\ntry {\n    exports.nodestream = !!__webpack_require__(400).Readable;\n} catch(e) {\n    exports.nodestream = false;\n}\n}.call(this, __webpack_require__(56).Buffer))\n })