/* 479 */\n (function(module, exports, __webpack_require__) {\nfunction _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === \"undefined\" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === \"number\") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError(\"Invalid attempt to iterate non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.\"); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }\nfunction _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === \"string\") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === \"Object\" && o.constructor) n = o.constructor.name; if (n === \"Map\" || n === \"Set\") return Array.from(o); if (n === \"Arguments\" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }\nfunction _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\nvar RenderedTarget = __webpack_require__(219);\nvar Blocks = __webpack_require__(135);\nvar _require = __webpack_require__(226),\n    loadSoundFromAsset = _require.loadSoundFromAsset;\nvar _require2 = __webpack_require__(225),\n    loadCostumeFromAsset = _require2.loadCostumeFromAsset;\nvar newBlockIds = __webpack_require__(453);\nvar StringUtil = __webpack_require__(102);\nvar StageLayering = __webpack_require__(115);\nvar Sprite = function () {\n  /**\n   * Sprite to be used on the Scratch stage.\n   * All clones of a sprite have shared blocks, shared costumes, shared variables,\n   * shared sounds, etc.\n   * @param {?Blocks} blocks Shared blocks object for all clones of sprite.\n   * @param {Runtime} runtime Reference to the runtime.\n   * @constructor\n   */\n  function Sprite(blocks, runtime) {\n    _classCallCheck(this, Sprite);\n    this.runtime = runtime;\n    if (!blocks) {\n      // Shared set of blocks for all clones.\n      blocks = new Blocks(runtime);\n    }\n    this.blocks = blocks;\n    /**\n     * Human-readable name for this sprite (and all clones).\n     * @type {string}\n     */\n    this.name = '';\n    /**\n     * List of costumes for this sprite.\n     * Each entry is an object, e.g.,\n     * {\n     *      skinId: 1,\n     *      name: \"Costume Name\",\n     *      bitmapResolution: 2,\n     *      rotationCenterX: 0,\n     *      rotationCenterY: 0\n     * }\n     * @type {Array.<!Object>}\n     */\n    this.costumes_ = [];\n    /**\n     * List of sounds for this sprite.\n    */\n    this.sounds = [];\n    /**\n     * List of clones for this sprite, including the original.\n     * @type {Array.<!RenderedTarget>}\n     */\n    this.clones = [];\n    this.soundBank = null;\n    if (this.runtime && this.runtime.audioEngine) {\n      this.soundBank = this.runtime.audioEngine.createBank();\n    }\n  }\n  /**\n   * Add an array of costumes, taking care to avoid duplicate names.\n   * @param {!Array<object>} costumes Array of objects representing costumes.\n   */\n  _createClass(Sprite, [{\n    key: \"addCostumeAt\",\n    /**\n     * Add a costume at the given index, taking care to avoid duplicate names.\n     * @param {!object} costumeObject Object representing the costume.\n     * @param {!int} index Index at which to add costume\n     */\n    value: function addCostumeAt(costumeObject, index) {\n      if (!costumeObject.name) {\n        costumeObject.name = '';\n      }\n      var usedNames = this.costumes_.map(function (costume) {\n        return costume.name;\n      });\n      costumeObject.name = StringUtil.unusedName(costumeObject.name, usedNames);\n      this.costumes_.splice(index, 0, costumeObject);\n    }\n    /**\n     * Delete a costume by index.\n     * @param {number} index Costume index to be deleted\n     * @return {?object} The deleted costume\n     */\n  }, {\n    key: \"deleteCostumeAt\",\n    value: function deleteCostumeAt(index) {\n      return this.costumes.splice(index, 1)[0];\n    }\n    /**\n     * Create a clone of this sprite.\n     * @param {string=} optLayerGroup Optional layer group the clone's drawable should be added to\n     * Defaults to the sprite layer group\n     * @returns {!RenderedTarget} Newly created clone.\n     */\n  }, {\n    key: \"createClone\",\n    value: function createClone(optLayerGroup) {\n      var newClone = new RenderedTarget(this, this.runtime);\n      newClone.isOriginal = this.clones.length === 0;\n      this.clones.push(newClone);\n      newClone.initAudio();\n      if (newClone.isOriginal) {\n        // Default to the sprite layer group if optLayerGroup is not provided\n        var layerGroup = typeof optLayerGroup === 'string' ? optLayerGroup : StageLayering.SPRITE_LAYER;\n        newClone.initDrawable(layerGroup);\n        this.runtime.fireTargetWasCreated(newClone);\n      } else {\n        this.runtime.fireTargetWasCreated(newClone, this.clones[0]);\n      }\n      return newClone;\n    }\n    /**\n     * Disconnect a clone from this sprite. The clone is unmodified.\n     * In particular, the clone's dispose() method is not called.\n     * @param {!RenderedTarget} clone - the clone to be removed.\n     */\n  }, {\n    key: \"removeClone\",\n    value: function removeClone(clone) {\n      this.runtime.fireTargetWasRemoved(clone);\n      var cloneIndex = this.clones.indexOf(clone);\n      if (cloneIndex >= 0) {\n        this.clones.splice(cloneIndex, 1);\n      }\n    }\n  }, {\n    key: \"duplicate\",\n    value: function duplicate() {\n      var _this = this;\n      var newSprite = new Sprite(null, this.runtime);\n      var blocksContainer = this.blocks._blocks;\n      var originalBlocks = Object.keys(blocksContainer).map(function (key) {\n        return blocksContainer[key];\n      });\n      var copiedBlocks = JSON.parse(JSON.stringify(originalBlocks));\n      newBlockIds(copiedBlocks);\n      copiedBlocks.forEach(function (block) {\n        newSprite.blocks.createBlock(block);\n      });\n      var allNames = this.runtime.targets.map(function (t) {\n        return t.sprite.name;\n      });\n      newSprite.name = StringUtil.unusedName(this.name, allNames);\n      var assetPromises = [];\n      newSprite.costumes = this.costumes_.map(function (costume) {\n        var newCostume = Object.assign({}, costume);\n        assetPromises.push(loadCostumeFromAsset(newCostume, _this.runtime));\n        return newCostume;\n      });\n      newSprite.sounds = this.sounds.map(function (sound) {\n        var newSound = Object.assign({}, sound);\n        var soundAsset = sound.asset;\n        assetPromises.push(loadSoundFromAsset(newSound, soundAsset, _this.runtime, newSprite.soundBank));\n        return newSound;\n      });\n      return Promise.all(assetPromises).then(function () {\n        return newSprite;\n      });\n    }\n  }, {\n    key: \"dispose\",\n    value: function dispose() {\n      if (this.soundBank) {\n        this.soundBank.dispose();\n      }\n    }\n  }, {\n    key: \"costumes\",\n    set: function set(costumes) {\n      this.costumes_ = [];\n      var _iterator = _createForOfIteratorHelper(costumes),\n          _step;\n      try {\n        for (_iterator.s(); !(_step = _iterator.n()).done;) {\n          var costume = _step.value;\n          this.addCostumeAt(costume, this.costumes_.length);\n        }\n      } catch (err) {\n        _iterator.e(err);\n      } finally {\n        _iterator.f();\n      }\n    }\n    /**\n     * Get full costume list\n     * @return {object[]} list of costumes. Note that mutating the returned list will not\n     *     mutate the list on the sprite. The sprite list should be mutated by calling\n     *     addCostumeAt, deleteCostumeAt, or setting costumes.\n     */\n    ,\n    get: function get() {\n      return this.costumes_;\n    }\n  }]);\n  return Sprite;\n}();\nmodule.exports = Sprite;\n })