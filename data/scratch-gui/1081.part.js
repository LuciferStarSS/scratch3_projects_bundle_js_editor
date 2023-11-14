/* 1081 */\n (function(module, exports, __webpack_require__) {\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\nvar Cast = __webpack_require__(48);\n/**\n * Names used internally for keys used in scratch, also known as \"scratch keys\".\n * @enum {string}\n */\nvar KEY_NAME = {\n  SPACE: 'space',\n  LEFT: 'left arrow',\n  UP: 'up arrow',\n  RIGHT: 'right arrow',\n  DOWN: 'down arrow',\n  ENTER: 'enter'\n};\n/**\n * An array of the names of scratch keys.\n * @type {Array<string>}\n */\nvar KEY_NAME_LIST = Object.keys(KEY_NAME).map(function (name) {\n  return KEY_NAME[name];\n});\nvar Keyboard = function () {\n  function Keyboard(runtime) {\n    _classCallCheck(this, Keyboard);\n    /**\n     * List of currently pressed scratch keys.\n     * A scratch key is:\n     * A key you can press on a keyboard, excluding modifier keys.\n     * An uppercase string of length one;\n     *     except for special key names for arrow keys and space (e.g. 'left arrow').\n     * Can be a non-english unicode letter like: æ ø ש נ 手 廿.\n     * @type{Array.<string>}\n     */\n    this._keysPressed = [];\n    /**\n     * Reference to the owning Runtime.\n     * Can be used, for example, to activate hats.\n     * @type{!Runtime}\n     */\n    this.runtime = runtime;\n  }\n  /**\n   * Convert from a keyboard event key name to a Scratch key name.\n   * @param  {string} keyString the input key string.\n   * @return {string} the corresponding Scratch key, or an empty string.\n   */\n  _createClass(Keyboard, [{\n    key: \"_keyStringToScratchKey\",\n    value: function _keyStringToScratchKey(keyString) {\n      keyString = Cast.toString(keyString); // Convert space and arrow keys to their Scratch key names.\n      switch (keyString) {\n        case ' ':\n          return KEY_NAME.SPACE;\n        case 'ArrowLeft':\n        case 'Left':\n          return KEY_NAME.LEFT;\n        case 'ArrowUp':\n        case 'Up':\n          return KEY_NAME.UP;\n        case 'Right':\n        case 'ArrowRight':\n          return KEY_NAME.RIGHT;\n        case 'Down':\n        case 'ArrowDown':\n          return KEY_NAME.DOWN;\n        case 'Enter':\n          return KEY_NAME.ENTER;\n      } // Ignore modifier keys\n      if (keyString.length > 1) {\n        return '';\n      }\n      return keyString.toUpperCase();\n    }\n    /**\n     * Convert from a block argument to a Scratch key name.\n     * @param  {string} keyArg the input arg.\n     * @return {string} the corresponding Scratch key.\n     */\n  }, {\n    key: \"_keyArgToScratchKey\",\n    value: function _keyArgToScratchKey(keyArg) {\n      // If a number was dropped in, try to convert from ASCII to Scratch key.\n      if (typeof keyArg === 'number') {\n        // Check for the ASCII range containing numbers, some punctuation,\n        // and uppercase letters.\n        if (keyArg >= 48 && keyArg <= 90) {\n          return String.fromCharCode(keyArg);\n        }\n        switch (keyArg) {\n          case 32:\n            return KEY_NAME.SPACE;\n          case 37:\n            return KEY_NAME.LEFT;\n          case 38:\n            return KEY_NAME.UP;\n          case 39:\n            return KEY_NAME.RIGHT;\n          case 40:\n            return KEY_NAME.DOWN;\n        }\n      }\n      keyArg = Cast.toString(keyArg); // If the arg matches a special key name, return it.\n      if (KEY_NAME_LIST.includes(keyArg)) {\n        return keyArg;\n      } // Use only the first character.\n      if (keyArg.length > 1) {\n        keyArg = keyArg[0];\n      } // Check for the space character.\n      if (keyArg === ' ') {\n        return KEY_NAME.SPACE;\n      }\n      return keyArg.toUpperCase();\n    }\n    /**\n     * Keyboard DOM event handler.\n     * @param  {object} data Data from DOM event.\n     */\n  }, {\n    key: \"postData\",\n    value: function postData(data) {\n      if (!data.key) return;\n      var scratchKey = this._keyStringToScratchKey(data.key);\n      if (scratchKey === '') return;\n      var index = this._keysPressed.indexOf(scratchKey);\n      if (data.isDown) {\n        this.runtime.emit('KEY_PRESSED', scratchKey); // If not already present, add to the list.\n        if (index < 0) {\n          this._keysPressed.push(scratchKey);\n        }\n      } else if (index > -1) {\n        // If already present, remove from the list.\n        this._keysPressed.splice(index, 1);\n      }\n    }\n    /**\n     * Get key down state for a specified key.\n     * @param  {Any} keyArg key argument.\n     * @return {boolean} Is the specified key down?\n     */\n  }, {\n    key: \"getKeyIsDown\",\n    value: function getKeyIsDown(keyArg) {\n      if (keyArg === 'any') {\n        return this._keysPressed.length > 0;\n      }\n      var scratchKey = this._keyArgToScratchKey(keyArg);\n      return this._keysPressed.indexOf(scratchKey) > -1;\n    }\n  }]);\n  return Keyboard;\n}();\nmodule.exports = Keyboard;\n })