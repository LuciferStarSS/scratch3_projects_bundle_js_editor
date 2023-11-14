/* 1077 */\n (function(module, exports) {\n/**\n * These constants are copied from scratch-blocks/core/constants.js\n * @TODO find a way to require() these straight from scratch-blocks... maybe make a scratch-blocks/dist/constants.js?\n * @readonly\n * @enum {int}\n */\nvar ScratchBlocksConstants = {\n  /**\n   * ENUM for output shape: hexagonal (booleans/predicates).\n   * @const\n   */\n  OUTPUT_SHAPE_HEXAGONAL: 1,\n  /**\n   * ENUM for output shape: rounded (numbers).\n   * @const\n   */\n  OUTPUT_SHAPE_ROUND: 2,\n  /**\n   * ENUM for output shape: squared (any/all values; strings).\n   * @const\n   */\n  OUTPUT_SHAPE_SQUARE: 3\n};\nmodule.exports = ScratchBlocksConstants;\n })