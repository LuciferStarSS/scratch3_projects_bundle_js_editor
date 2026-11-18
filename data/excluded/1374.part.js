/* 1374 */
 (function(module, exports, __webpack_require__) {
"use strict";
eval("\nvar Cache = module.exports = function Cache() {\n  this._cache = {};\n};\nCache.prototype.put = function Cache_put(key, value) {\n  this._cache[key] = value;\n};\nCache.prototype.get = function Cache_get(key) {\n  return this._cache[key];\n};\nCache.prototype.del = function Cache_del(key) {\n  delete this._cache[key];\n};\nCache.prototype.clear = function Cache_clear() {\n  this._cache = {};\n};\n// ./~/scratch-parser/~/ajv/lib/cache.js\n// module id = 1374\n// module chunks = 0\n//# sourceURL=scratch:///./~/scratch-parser/~/ajv/lib/cache.js?");
 })