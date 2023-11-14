/* 19 */\n (function(module, __webpack_exports__, __webpack_require__) {\n\"use strict\";\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"a\", function() { return BLOCKS_DEFAULT_SCALE; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"b\", function() { return STAGE_DISPLAY_SCALES; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"c\", function() { return STAGE_DISPLAY_SIZES; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"d\", function() { return STAGE_SIZE_MODES; });\n var keymirror__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(40);\n var keymirror__WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(keymirror__WEBPACK_IMPORTED_MODULE_0__);\n/**\n * Names for each state of the stage size toggle\n * @enum {string}\n */\nvar STAGE_SIZE_MODES = keymirror__WEBPACK_IMPORTED_MODULE_0___default()({\n  /**\n   * The \"large stage\" button is pressed; the user would like a large stage.\n   */\n  large: null,\n  /**\n   * The \"small stage\" button is pressed; the user would like a small stage.\n   */\n  small: null\n});\n/**\n * Names for each stage render size\n * @enum {string}\n */\nvar STAGE_DISPLAY_SIZES = keymirror__WEBPACK_IMPORTED_MODULE_0___default()({\n  /**\n   * Large stage with wide browser\n   */\n  large: null,\n  /**\n   * Large stage with narrow browser\n   */\n  largeConstrained: null,\n  /**\n   * Small stage (ignores browser width)\n   */\n  small: null\n}); // zoom level to start with\nvar BLOCKS_DEFAULT_SCALE = 0.675;\nvar STAGE_DISPLAY_SCALES = {};\nSTAGE_DISPLAY_SCALES[STAGE_DISPLAY_SIZES.large] = 1; // large mode, wide browser (standard)\nSTAGE_DISPLAY_SCALES[STAGE_DISPLAY_SIZES.largeConstrained] = 0.85; // large mode but narrow browser\nSTAGE_DISPLAY_SCALES[STAGE_DISPLAY_SIZES.small] = 0.5; // small mode, regardless of browser size\n/* harmony default export */ __webpack_exports__[\"e\"] = ({\n  standardStageWidth: 480,\n  standardStageHeight: 360,\n  fullSizeMinWidth: 1096,\n  fullSizePaintMinWidth: 1250\n});\n })