/* 197 */\n (function(module, __webpack_exports__, __webpack_require__) {\n\"use strict\";\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"a\", function() { return reducer; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"b\", function() { return initialState; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"c\", function() { return updateMonitors; });\n var immutable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(69);\n var immutable__WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(immutable__WEBPACK_IMPORTED_MODULE_0__);\nvar UPDATE_MONITORS = 'scratch-gui/monitors/UPDATE_MONITORS';\nvar initialState = Object(immutable__WEBPACK_IMPORTED_MODULE_0__[\"OrderedMap\"])();\nvar reducer = function reducer(state, action) {\n  if (typeof state === 'undefined') state = initialState;\n  switch (action.type) {\n    case UPDATE_MONITORS:\n      return action.monitors;\n    default:\n      return state;\n  }\n};\nvar updateMonitors = function updateMonitors(monitors) {\n  return {\n    type: UPDATE_MONITORS,\n    monitors: monitors,\n    meta: {\n      throttle: 30\n    }\n  };\n};\n })