/* 1409 */
 (function(module, exports, __webpack_require__) {
eval("// style-loader: Adds some css to the DOM by adding a <style> tag\n// load the styles\nvar content = __webpack_require__(1040);\nif(typeof content === 'string') content = [[module.i, content, '']];\n// add the styles to the DOM\nvar update = __webpack_require__(3)(content, {});\nif(content.locals) module.exports = content.locals;\n// Hot Module Replacement\nif(false) {\n\t// When the styles change, update the <style> tags\n\tif(!content.locals) {\n\t\tmodule.hot.accept(\"!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/lib/index.js??ref--1-2!../../../node_modules/sass-loader/lib/loader.js!./commenting-status.scss\", function() {\n\t\t\tvar newContent = require(\"!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/lib/index.js??ref--1-2!../../../node_modules/sass-loader/lib/loader.js!./commenting-status.scss\");\n\t\t\tif(typeof newContent === 'string') newContent = [[module.id, newContent, '']];\n\t\t\tupdate(newContent);\n\t\t});\n\t}\n\t// When the module is disposed, remove the <style> tags\n\tmodule.hot.dispose(function() { update(); });\n}\n// ./src/components/commenting-status/commenting-status.scss\n// module id = 1409\n// module chunks = 0\n//# sourceURL=scratch:///./src/components/commenting-status/commenting-status.scss?");
 })