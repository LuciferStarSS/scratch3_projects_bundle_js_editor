/* 53 */
 (function(module, exports, __webpack_require__) {
eval("// style-loader: Adds some css to the DOM by adding a <style> tag\n// load the styles\nvar content = __webpack_require__(52);\nif(typeof content === 'string') content = [[module.i, content, '']];\n// add the styles to the DOM\nvar update = __webpack_require__(3)(content, {});\nif(content.locals) module.exports = content.locals;\n// Hot Module Replacement\nif(false) {\n\t// When the styles change, update the <style> tags\n\tif(!content.locals) {\n\t\tmodule.hot.accept(\"!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/lib/index.js??ref--1-2!../../../node_modules/sass-loader/lib/loader.js!./title-banner.scss\", function() {\n\t\t\tvar newContent = require(\"!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/lib/index.js??ref--1-2!../../../node_modules/sass-loader/lib/loader.js!./title-banner.scss\");\n\t\t\tif(typeof newContent === 'string') newContent = [[module.id, newContent, '']];\n\t\t\tupdate(newContent);\n\t\t});\n\t}\n\t// When the module is disposed, remove the <style> tags\n\tmodule.hot.dispose(function() { update(); });\n}\n// ./src/components/title-banner/title-banner.scss\n// module id = 53\n// module chunks = 0 1 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46\n//# sourceURL=scratch:///./src/components/title-banner/title-banner.scss?");
 })