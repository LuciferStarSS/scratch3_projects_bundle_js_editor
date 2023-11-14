/* 198 */\n (function(module, __webpack_exports__, __webpack_require__) {\n\"use strict\";\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"a\", function() { return reducer; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"b\", function() { return initialState; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"c\", function() { return updateMicIndicator; });\nvar UPDATE = 'scratch-gui/mic-indicator/UPDATE';\nvar initialState = false;\nvar reducer = function reducer(state, action) {\n  if (typeof state === 'undefined') state = initialState;\n  switch (action.type) {\n    case UPDATE:\n      return action.visible;\n    default:\n      return state;\n  }\n};\nvar updateMicIndicator = function updateMicIndicator(visible) {\n  return {\n    type: UPDATE,\n    visible: visible\n  };\n};\n })