/* 196 */\n (function(module, __webpack_exports__, __webpack_require__) {\n\"use strict\";\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"b\", function() { return reducer; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"a\", function() { return initialState; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"c\", function() { return updateBlockDrag; });\nvar BLOCK_DRAG_UPDATE = 'scratch-gui/block-drag/BLOCK_DRAG_UPDATE';\nvar initialState = false;\nvar reducer = function reducer(state, action) {\n  if (typeof state === 'undefined') state = initialState;\n  switch (action.type) {\n    case BLOCK_DRAG_UPDATE:\n      return action.areBlocksOverGui;\n    default:\n      return state;\n  }\n};\nvar updateBlockDrag = function updateBlockDrag(areBlocksOverGui) {\n  return {\n    type: BLOCK_DRAG_UPDATE,\n    areBlocksOverGui: areBlocksOverGui,\n    meta: {\n      throttle: 30\n    }\n  };\n};\n })