/* 462 */
 (function(module, __webpack_exports__, __webpack_require__) {
"use strict";
eval("/** Used for built-in method references. */\nvar objectProto = Object.prototype;\n/**\n * Checks if `value` is likely a prototype object.\n *\n * @private\n * @param {*} value The value to check.\n * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.\n */\nfunction isPrototype(value) {\n  var Ctor = value && value.constructor,\n      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;\n  return value === proto;\n}\n/* harmony default export */ __webpack_exports__[\"a\"] = (isPrototype);\n// ./~/lodash-es/_isPrototype.js\n// module id = 462\n// module chunks = 0 1\n//# sourceURL=scratch:///./~/lodash-es/_isPrototype.js?");
 })