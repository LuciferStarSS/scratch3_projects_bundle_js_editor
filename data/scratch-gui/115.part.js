/* 115 */\n (function(module, exports) {\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\nvar StageLayering = function () {\n  function StageLayering() {\n    _classCallCheck(this, StageLayering);\n  }\n  _createClass(StageLayering, null, [{\n    key: \"BACKGROUND_LAYER\",\n    get: function get() {\n      return 'background';\n    }\n  }, {\n    key: \"VIDEO_LAYER\",\n    get: function get() {\n      return 'video';\n    }\n  }, {\n    key: \"PEN_LAYER\",\n    get: function get() {\n      return 'pen';\n    }\n  }, {\n    key: \"SPRITE_LAYER\",\n    get: function get() {\n      return 'sprite';\n    } // Order of layer groups relative to each other,\n  }, {\n    key: \"LAYER_GROUPS\",\n    get: function get() {\n      return [StageLayering.BACKGROUND_LAYER, StageLayering.VIDEO_LAYER, StageLayering.PEN_LAYER, StageLayering.SPRITE_LAYER];\n    }\n  }]);\n  return StageLayering;\n}();\nmodule.exports = StageLayering;\n })