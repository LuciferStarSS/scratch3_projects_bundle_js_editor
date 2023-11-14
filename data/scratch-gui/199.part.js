/* 199 */\n (function(module, __webpack_exports__, __webpack_require__) {\n\"use strict\";\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"a\", function() { return reducer; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"b\", function() { return initialState; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"c\", function() { return updateToolbox; });\n var _lib_make_toolbox_xml__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(248);\nvar UPDATE_TOOLBOX = 'scratch-gui/toolbox/UPDATE_TOOLBOX';\nvar initialState = {\n  toolboxXML: Object(_lib_make_toolbox_xml__WEBPACK_IMPORTED_MODULE_0__[/* default */ \"a\"])(true)\n};\nvar reducer = function reducer(state, action) {\n  if (typeof state === 'undefined') state = initialState;\n  switch (action.type) {\n    case UPDATE_TOOLBOX:\n      return Object.assign({}, state, {\n        toolboxXML: action.toolboxXML\n      });\n    default:\n      return state;\n  }\n};\nvar updateToolbox = function updateToolbox(toolboxXML) {\n  return {\n    type: UPDATE_TOOLBOX,\n    toolboxXML: toolboxXML\n  };\n};\n })