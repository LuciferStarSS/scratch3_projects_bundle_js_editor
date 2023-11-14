/* 1098 */\n (function(module, exports, __webpack_require__) {\nvar _SCRATCH_KEY_NAME;\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\nfunction _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }\nvar formatMessage = __webpack_require__(71);\nvar ArgumentType = __webpack_require__(63);\nvar BlockType = __webpack_require__(45);\nvar Cast = __webpack_require__(48);\n/**\n * Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.\n * @type {string}\n */\n// eslint-disable-next-line max-len\nvar blockIconURI = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MCA0MCI+PHN0eWxlPi5zdDJ7ZmlsbDpyZWR9LnN0M3tmaWxsOiNlMGUwZTB9LnN0NHtmaWxsOm5vbmU7c3Ryb2tlOiM2NjY7c3Ryb2tlLXdpZHRoOi41O3N0cm9rZS1taXRlcmxpbWl0OjEwfTwvc3R5bGU+PHBhdGggZD0iTTM1IDI4SDVhMSAxIDAgMCAxLTEtMVYxMmMwLS42LjQtMSAxLTFoMzBjLjUgMCAxIC40IDEgMXYxNWMwIC41LS41IDEtMSAxeiIgZmlsbD0iI2ZmZiIgaWQ9IkxheWVyXzYiLz48ZyBpZD0iTGF5ZXJfNCI+PHBhdGggY2xhc3M9InN0MiIgZD0iTTQgMjVoMzJ2Mi43SDR6TTEzIDI0aC0yLjJhMSAxIDAgMCAxLTEtMXYtOS43YzAtLjYuNC0xIDEtMUgxM2MuNiAwIDEgLjQgMSAxVjIzYzAgLjYtLjUgMS0xIDF6Ii8+PHBhdGggY2xhc3M9InN0MiIgZD0iTTYuMSAxOS4zdi0yLjJjMC0uNS40LTEgMS0xaDkuN2MuNSAwIDEgLjUgMSAxdjIuMmMwIC41LS41IDEtMSAxSDcuMWExIDEgMCAwIDEtMS0xeiIvPjxjaXJjbGUgY2xhc3M9InN0MiIgY3g9IjIyLjgiIGN5PSIxOC4yIiByPSIzLjQiLz48Y2lyY2xlIGNsYXNzPSJzdDIiIGN4PSIzMC42IiBjeT0iMTguMiIgcj0iMy40Ii8+PHBhdGggY2xhc3M9InN0MiIgZD0iTTQuMiAyN2gzMS45di43SDQuMnoiLz48L2c+PGcgaWQ9IkxheWVyXzUiPjxjaXJjbGUgY2xhc3M9InN0MyIgY3g9IjIyLjgiIGN5PSIxOC4yIiByPSIyLjMiLz48Y2lyY2xlIGNsYXNzPSJzdDMiIGN4PSIzMC42IiBjeT0iMTguMiIgcj0iMi4zIi8+PHBhdGggY2xhc3M9InN0MyIgZD0iTTEyLjUgMjIuOWgtMS4yYy0uMyAwLS41LS4yLS41LS41VjE0YzAtLjMuMi0uNS41LS41aDEuMmMuMyAwIC41LjIuNS41djguNGMwIC4zLS4yLjUtLjUuNXoiLz48cGF0aCBjbGFzcz0ic3QzIiBkPSJNNy4yIDE4Ljd2LTEuMmMwLS4zLjItLjUuNS0uNWg4LjRjLjMgMCAuNS4yLjUuNXYxLjJjMCAuMy0uMi41LS41LjVINy43Yy0uMyAwLS41LS4yLS41LS41ek00IDI2aDMydjJINHoiLz48L2c+PGcgaWQ9IkxheWVyXzMiPjxwYXRoIGNsYXNzPSJzdDQiIGQ9Ik0zNS4yIDI3LjlINC44YTEgMSAwIDAgMS0xLTFWMTIuMWMwLS42LjUtMSAxLTFoMzAuNWMuNSAwIDEgLjQgMSAxVjI3YTEgMSAwIDAgMS0xLjEuOXoiLz48cGF0aCBjbGFzcz0ic3Q0IiBkPSJNMzUuMiAyNy45SDQuOGExIDEgMCAwIDEtMS0xVjEyLjFjMC0uNi41LTEgMS0xaDMwLjVjLjUgMCAxIC40IDEgMVYyN2ExIDEgMCAwIDEtMS4xLjl6Ii8+PC9nPjwvc3ZnPg==';\n/**\n * Length of the buffer to store key presses for the \"when keys pressed in order\" hat\n * @type {number}\n */\nvar KEY_BUFFER_LENGTH = 100;\n/**\n * Timeout in milliseconds to reset the completed flag for a sequence.\n * @type {number}\n */\nvar SEQUENCE_HAT_TIMEOUT = 100;\n/**\n * An id for the space key on a keyboard.\n */\nvar KEY_ID_SPACE = 'SPACE';\n/**\n * An id for the left arrow key on a keyboard.\n */\nvar KEY_ID_LEFT = 'LEFT';\n/**\n * An id for the right arrow key on a keyboard.\n */\nvar KEY_ID_RIGHT = 'RIGHT';\n/**\n * An id for the up arrow key on a keyboard.\n */\nvar KEY_ID_UP = 'UP';\n/**\n * An id for the down arrow key on a keyboard.\n */\nvar KEY_ID_DOWN = 'DOWN';\n/**\n * Names used by keyboard io for keys used in scratch.\n * @enum {string}\n */\nvar SCRATCH_KEY_NAME = (_SCRATCH_KEY_NAME = {}, _defineProperty(_SCRATCH_KEY_NAME, KEY_ID_SPACE, 'space'), _defineProperty(_SCRATCH_KEY_NAME, KEY_ID_LEFT, 'left arrow'), _defineProperty(_SCRATCH_KEY_NAME, KEY_ID_UP, 'up arrow'), _defineProperty(_SCRATCH_KEY_NAME, KEY_ID_RIGHT, 'right arrow'), _defineProperty(_SCRATCH_KEY_NAME, KEY_ID_DOWN, 'down arrow'), _SCRATCH_KEY_NAME);\n/**\n * Class for the makey makey blocks in Scratch 3.0\n * @constructor\n */\nvar Scratch3MakeyMakeyBlocks = function () {\n  function Scratch3MakeyMakeyBlocks(runtime) {\n    var _this = this;\n    _classCallCheck(this, Scratch3MakeyMakeyBlocks);\n    /**\n     * The runtime instantiating this block package.\n     * @type {Runtime}\n     */\n    this.runtime = runtime;\n    /**\n     * A toggle that alternates true and false each frame, so that an\n     * edge-triggered hat can trigger on every other frame.\n     * @type {boolean}\n     */\n    this.frameToggle = false; // Set an interval that toggles the frameToggle every frame.\n    setInterval(function () {\n      _this.frameToggle = !_this.frameToggle;\n    }, this.runtime.currentStepTime);\n    this.keyPressed = this.keyPressed.bind(this);\n    this.runtime.on('KEY_PRESSED', this.keyPressed);\n    this._clearkeyPressBuffer = this._clearkeyPressBuffer.bind(this);\n    this.runtime.on('PROJECT_STOP_ALL', this._clearkeyPressBuffer);\n    /*\n     * An object containing a set of sequence objects.\n     * These are the key sequences currently being detected by the \"when\n     * keys pressed in order\" hat block. Each sequence is keyed by its\n     * string representation (the sequence's value in the menu, which is a\n     * string of KEY_IDs separated by spaces). Each sequence object\n     * has an array property (an array of KEY_IDs) and a boolean\n     * completed property that is true when the sequence has just been\n     * pressed.\n     * @type {object}\n     */\n    this.sequences = {};\n    /*\n     * An array of the key codes of recently pressed keys.\n     * @type {array}\n     */\n    this.keyPressBuffer = [];\n  }\n  /*\n  * Localized short-form names of the space bar and arrow keys, for use in the\n  * displayed menu items of the \"when keys pressed in order\" block.\n  * @type {object}\n  */\n  _createClass(Scratch3MakeyMakeyBlocks, [{\n    key: \"getInfo\",\n    /**\n     * @returns {object} metadata for this extension and its blocks.\n     */\n    value: function getInfo() {\n      return {\n        id: 'makeymakey',\n        name: 'Makey Makey',\n        blockIconURI: blockIconURI,\n        blocks: [{\n          opcode: 'whenMakeyKeyPressed',\n          text: formatMessage({\n            id: 'makeymakey.whenKeyPressed',\n            default: 'when [KEY] key pressed',\n            description: 'when a keyboard key is pressed'\n          }),\n          blockType: BlockType.HAT,\n          arguments: {\n            KEY: {\n              type: ArgumentType.STRING,\n              menu: 'KEY',\n              defaultValue: KEY_ID_SPACE\n            }\n          }\n        }, {\n          opcode: 'whenCodePressed',\n          text: formatMessage({\n            id: 'makeymakey.whenKeysPressedInOrder',\n            default: 'when [SEQUENCE] pressed in order',\n            description: 'when a sequence of keyboard keys is pressed in a specific order'\n          }),\n          blockType: BlockType.HAT,\n          arguments: {\n            SEQUENCE: {\n              type: ArgumentType.STRING,\n              menu: 'SEQUENCE',\n              defaultValue: this.DEFAULT_SEQUENCES[0]\n            }\n          }\n        }],\n        menus: {\n          KEY: {\n            acceptReporters: true,\n            items: [{\n              text: formatMessage({\n                id: 'makeymakey.spaceKey',\n                default: 'space',\n                description: 'The space key on a computer keyboard.'\n              }),\n              value: KEY_ID_SPACE\n            }, {\n              text: formatMessage({\n                id: 'makeymakey.upArrow',\n                default: 'up arrow',\n                description: 'The up arrow key on a computer keyboard.'\n              }),\n              value: KEY_ID_UP\n            }, {\n              text: formatMessage({\n                id: 'makeymakey.downArrow',\n                default: 'down arrow',\n                description: 'The down arrow key on a computer keyboard.'\n              }),\n              value: KEY_ID_DOWN\n            }, {\n              text: formatMessage({\n                id: 'makeymakey.rightArrow',\n                default: 'right arrow',\n                description: 'The right arrow key on a computer keyboard.'\n              }),\n              value: KEY_ID_RIGHT\n            }, {\n              text: formatMessage({\n                id: 'makeymakey.leftArrow',\n                default: 'left arrow',\n                description: 'The left arrow key on a computer keyboard.'\n              }),\n              value: KEY_ID_LEFT\n            }, {\n              text: 'w',\n              value: 'w'\n            }, {\n              text: 'a',\n              value: 'a'\n            }, {\n              text: 's',\n              value: 's'\n            }, {\n              text: 'd',\n              value: 'd'\n            }, {\n              text: 'f',\n              value: 'f'\n            }, {\n              text: 'g',\n              value: 'g'\n            }]\n          },\n          SEQUENCE: {\n            acceptReporters: true,\n            items: this.buildSequenceMenu(this.DEFAULT_SEQUENCES)\n          }\n        }\n      };\n    }\n    /*\n     * Build the menu of key sequences.\n     * @param {array} sequencesArray an array of strings of KEY_IDs.\n     * @returns {array} an array of objects with text and value properties.\n     */\n  }, {\n    key: \"buildSequenceMenu\",\n    value: function buildSequenceMenu(sequencesArray) {\n      var _this2 = this;\n      return sequencesArray.map(function (str) {\n        return _this2.getMenuItemForSequenceString(str);\n      });\n    }\n    /*\n     * Create a menu item for a sequence string.\n     * @param {string} sequenceString a string of KEY_IDs.\n     * @return {object} an object with text and value properties.\n     */\n  }, {\n    key: \"getMenuItemForSequenceString\",\n    value: function getMenuItemForSequenceString(sequenceString) {\n      var _this3 = this;\n      var sequenceArray = sequenceString.split(' ');\n      sequenceArray = sequenceArray.map(function (str) {\n        return _this3.KEY_TEXT_SHORT[str];\n      });\n      return {\n        text: sequenceArray.join(' '),\n        value: sequenceString\n      };\n    }\n    /*\n     * Check whether a keyboard key is currently pressed.\n     * Also, toggle the results of the test on alternate frames, so that the\n     * hat block fires repeatedly.\n     * @param {object} args - the block arguments.\n     * @property {number} KEY - a key code.\n     * @param {object} util - utility object provided by the runtime.\n     */\n  }, {\n    key: \"whenMakeyKeyPressed\",\n    value: function whenMakeyKeyPressed(args, util) {\n      var key = args.KEY; // Convert the key arg, if it is a KEY_ID, to the key name used by\n      // the Keyboard io module.\n      if (SCRATCH_KEY_NAME[args.KEY]) {\n        key = SCRATCH_KEY_NAME[args.KEY];\n      }\n      var isDown = util.ioQuery('keyboard', 'getKeyIsDown', [key]);\n      return isDown && this.frameToggle;\n    }\n    /*\n     * A function called on the KEY_PRESSED event, to update the key press\n     * buffer and check if any of the key sequences have been completed.\n     * @param {string} key A scratch key name.\n     */\n  }, {\n    key: \"keyPressed\",\n    value: function keyPressed(key) {\n      var _this4 = this;\n      // Store only the first word of the Scratch key name, so that e.g. when\n      // \"left arrow\" is pressed, we store \"LEFT\", which matches KEY_ID_LEFT\n      key = key.split(' ')[0];\n      key = key.toUpperCase();\n      this.keyPressBuffer.push(key); // Keep the buffer under the length limit\n      if (this.keyPressBuffer.length > KEY_BUFFER_LENGTH) {\n        this.keyPressBuffer.shift();\n      } // Check the buffer for each sequence in use\n      var _loop = function _loop(str) {\n        var arr = _this4.sequences[str].array; // Bail out if we don't have enough presses for this sequence\n        if (_this4.keyPressBuffer.length < arr.length) {\n          return \"continue\";\n        }\n        var missFlag = false; // Slice the buffer to the length of the sequence we're checking\n        var bufferSegment = _this4.keyPressBuffer.slice(-1 * arr.length);\n        for (var i = 0; i < arr.length; i++) {\n          if (arr[i] !== bufferSegment[i]) {\n            missFlag = true;\n          }\n        } // If the miss flag is false, the sequence matched the buffer\n        if (!missFlag) {\n          _this4.sequences[str].completed = true; // Clear the completed flag after a timeout. This is necessary because\n          // the hat is edge-triggered (not event triggered). Multiple hats\n          // may be checking the same sequence, so this timeout gives them enough\n          // time to all trigger before resetting the flag.\n          setTimeout(function () {\n            _this4.sequences[str].completed = false;\n          }, SEQUENCE_HAT_TIMEOUT);\n        }\n      };\n      for (var str in this.sequences) {\n        var _ret = _loop(str);\n        if (_ret === \"continue\") continue;\n      }\n    }\n    /**\n     * Clear the key press buffer.\n     */\n  }, {\n    key: \"_clearkeyPressBuffer\",\n    value: function _clearkeyPressBuffer() {\n      this.keyPressBuffer = [];\n    }\n    /*\n     * Add a key sequence to the set currently being checked on each key press.\n     * @param {string} sequenceString a string of space-separated KEY_IDs.\n     * @param {array} sequenceArray an array of KEY_IDs.\n     */\n  }, {\n    key: \"addSequence\",\n    value: function addSequence(sequenceString, sequenceArray) {\n      // If we already have this sequence string, return.\n      if (this.sequences.hasOwnProperty(sequenceString)) {\n        return;\n      }\n      this.sequences[sequenceString] = {\n        array: sequenceArray,\n        completed: false\n      };\n    }\n    /*\n     * Check whether a key sequence was recently completed.\n     * @param {object} args The block arguments.\n     * @property {number} SEQUENCE A string of KEY_IDs.\n     */\n  }, {\n    key: \"whenCodePressed\",\n    value: function whenCodePressed(args) {\n      var sequenceString = Cast.toString(args.SEQUENCE).toUpperCase();\n      var sequenceArray = sequenceString.split(' ');\n      if (sequenceArray.length < 2) {\n        return;\n      }\n      this.addSequence(sequenceString, sequenceArray);\n      return this.sequences[sequenceString].completed;\n    }\n  }, {\n    key: \"KEY_TEXT_SHORT\",\n    get: function get() {\n      var _ref;\n      return _ref = {}, _defineProperty(_ref, KEY_ID_SPACE, formatMessage({\n        id: 'makeymakey.spaceKey',\n        default: 'space',\n        description: 'The space key on a computer keyboard.'\n      })), _defineProperty(_ref, KEY_ID_LEFT, formatMessage({\n        id: 'makeymakey.leftArrowShort',\n        default: 'left',\n        description: 'Short name for the left arrow key on a computer keyboard.'\n      })), _defineProperty(_ref, KEY_ID_UP, formatMessage({\n        id: 'makeymakey.upArrowShort',\n        default: 'up',\n        description: 'Short name for the up arrow key on a computer keyboard.'\n      })), _defineProperty(_ref, KEY_ID_RIGHT, formatMessage({\n        id: 'makeymakey.rightArrowShort',\n        default: 'right',\n        description: 'Short name for the right arrow key on a computer keyboard.'\n      })), _defineProperty(_ref, KEY_ID_DOWN, formatMessage({\n        id: 'makeymakey.downArrowShort',\n        default: 'down',\n        description: 'Short name for the down arrow key on a computer keyboard.'\n      })), _ref;\n    }\n    /*\n     * An array of strings of KEY_IDs representing the default set of\n     * key sequences for use by the \"when keys pressed in order\" block.\n     * @type {array}\n     */\n  }, {\n    key: \"DEFAULT_SEQUENCES\",\n    get: function get() {\n      return [\"\".concat(KEY_ID_LEFT, \" \").concat(KEY_ID_UP, \" \").concat(KEY_ID_RIGHT), \"\".concat(KEY_ID_RIGHT, \" \").concat(KEY_ID_UP, \" \").concat(KEY_ID_LEFT), \"\".concat(KEY_ID_LEFT, \" \").concat(KEY_ID_RIGHT), \"\".concat(KEY_ID_RIGHT, \" \").concat(KEY_ID_LEFT), \"\".concat(KEY_ID_UP, \" \").concat(KEY_ID_DOWN), \"\".concat(KEY_ID_DOWN, \" \").concat(KEY_ID_UP), \"\".concat(KEY_ID_UP, \" \").concat(KEY_ID_RIGHT, \" \").concat(KEY_ID_DOWN, \" \").concat(KEY_ID_LEFT), \"\".concat(KEY_ID_UP, \" \").concat(KEY_ID_LEFT, \" \").concat(KEY_ID_DOWN, \" \").concat(KEY_ID_RIGHT), \"\".concat(KEY_ID_UP, \" \").concat(KEY_ID_UP, \" \").concat(KEY_ID_DOWN, \" \").concat(KEY_ID_DOWN, \" \") + \"\".concat(KEY_ID_LEFT, \" \").concat(KEY_ID_RIGHT, \" \").concat(KEY_ID_LEFT, \" \").concat(KEY_ID_RIGHT)];\n    }\n  }]);\n  return Scratch3MakeyMakeyBlocks;\n}();\nmodule.exports = Scratch3MakeyMakeyBlocks;\n })