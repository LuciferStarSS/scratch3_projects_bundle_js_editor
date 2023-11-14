/* 200 */\n (function(module, __webpack_exports__, __webpack_require__) {\n\"use strict\";\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"a\", function() { return reducer; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"c\", function() { return initialState; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"b\", function() { return updateMetrics; });\nfunction ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }\nfunction _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }\nfunction _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }\nvar UPDATE_METRICS = 'scratch-gui/workspace-metrics/UPDATE_METRICS';\nvar initialState = {\n  targets: {}\n};\nvar reducer = function reducer(state, action) {\n  if (typeof state === 'undefined') state = initialState;\n  switch (action.type) {\n    case UPDATE_METRICS:\n      return Object.assign({}, state, {\n        targets: Object.assign({}, state.targets, _defineProperty({}, action.targetID, {\n          scrollX: action.scrollX,\n          scrollY: action.scrollY,\n          scale: action.scale\n        }))\n      });\n    default:\n      return state;\n  }\n};\nvar updateMetrics = function updateMetrics(metrics) {\n  return _objectSpread({\n    type: UPDATE_METRICS\n  }, metrics);\n};\n })