/* 562 */
 (function(module, exports, __webpack_require__) {
"use strict";
eval("(function(Buffer) {\nmodule.exports = function (base64Data) {\n  var isBrowser = typeof window !== 'undefined' && typeof window.atob === 'function'\n  var binary = isBrowser ? window.atob(base64Data) : Buffer.from(base64Data, 'base64').toString('binary')\n  var bytes = new Uint8Array(binary.length)\n  for (var i = 0; i < binary.length; ++i) {\n    bytes[i] = binary.charCodeAt(i)\n  }\n  return bytes.buffer\n}\n}.call(exports, __webpack_require__(269).Buffer))\n// ./~/arraybuffer-loader/lib/to-array-buffer.js\n// module id = 562\n// module chunks = 0\n//# sourceURL=scratch:///./~/arraybuffer-loader/lib/to-array-buffer.js?");
 })