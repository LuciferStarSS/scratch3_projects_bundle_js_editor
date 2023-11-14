/* 104 */\n (function(module, __webpack_exports__, __webpack_require__) {\n\"use strict\";\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"a\", function() { return reducer; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"b\", function() { return initialState; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"c\", function() { return setHoveredSprite; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"d\", function() { return setReceivedBlocks; });\nvar SET_HOVERED_SPRITE = 'scratch-gui/hovered-target/SET_HOVERED_SPRITE';\nvar SET_RECEIVED_BLOCKS = 'scratch-gui/hovered-target/SET_RECEIVED_BLOCKS';\nvar initialState = {\n  sprite: null,\n  receivedBlocks: false\n};\nvar reducer = function reducer(state, action) {\n  if (typeof state === 'undefined') state = initialState;\n  switch (action.type) {\n    case SET_HOVERED_SPRITE:\n      return {\n        sprite: action.spriteId,\n        receivedBlocks: false\n      };\n    case SET_RECEIVED_BLOCKS:\n      return {\n        sprite: state.sprite,\n        receivedBlocks: action.receivedBlocks\n      };\n    default:\n      return state;\n  }\n};\nvar setHoveredSprite = function setHoveredSprite(spriteId) {\n  return {\n    type: SET_HOVERED_SPRITE,\n    spriteId: spriteId,\n    meta: {\n      throttle: 30\n    }\n  };\n};\nvar setReceivedBlocks = function setReceivedBlocks(receivedBlocks) {\n  return {\n    type: SET_RECEIVED_BLOCKS,\n    receivedBlocks: receivedBlocks\n  };\n};\n })