/* 954 */\n (function(module, exports, __webpack_require__) {\nfunction _typeof(obj) { \"@babel/helpers - typeof\"; if (typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; }; } return _typeof(obj); }\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\nvar dispatch = __webpack_require__(426);\nvar log = __webpack_require__(39);\nvar maybeFormatMessage = __webpack_require__(428);\nvar BlockType = __webpack_require__(45); // These extensions are currently built into the VM repository but should not be loaded at startup.\n// TODO: move these out into a separate repository?\n// TODO: change extension spec so that library info, including extension ID, can be collected through static methods\nvar builtinExtensions = {\n  // This is an example that isn't loaded with the other core blocks,\n  // but serves as a reference for loading core blocks as extensions.\n  coreExample: function coreExample() {\n    return __webpack_require__(957);\n  },\n  // These are the non-core built-in extensions.\n  pen: function pen() {\n    return __webpack_require__(958);\n  },\n  wedo2: function wedo2() {\n    return __webpack_require__(981);\n  },\n  music: function music() {\n    return __webpack_require__(984);\n  },\n  microbit: function microbit() {\n    return __webpack_require__(1047);\n  },\n  text2speech: function text2speech() {\n    return __webpack_require__(1048);\n  },\n  translate: function translate() {\n    return __webpack_require__(1072);\n  },\n  videoSensing: function videoSensing() {\n    return __webpack_require__(1073);\n  },\n  ev3: function ev3() {\n    return __webpack_require__(1096);\n  },\n  makeymakey: function makeymakey() {\n    return __webpack_require__(1098);\n  },\n  boost: function boost() {\n    return __webpack_require__(1099);\n  },\n  gdxfor: function gdxfor() {\n    return __webpack_require__(1100);\n  },\n  IRREMOTER: function IRREMOTER() {\n    return __webpack_require__(1484);\n  },\n  IOTSWITCH: function IOTSWITCH() {\n    return __webpack_require__(1487);\n  },\n  IOTDOORCONTROLLER: function IOTDOORCONTROLLER() {\n    return __webpack_require__(1490);\n  },\n  chattingroom: function chattingroom() {\n    return __webpack_require__(1493);\n  }\n};\n/**\n * @typedef {object} ArgumentInfo - Information about an extension block argument\n * @property {ArgumentType} type - the type of value this argument can take\n * @property {*|undefined} default - the default value of this argument (default: blank)\n */\n/**\n * @typedef {object} ConvertedBlockInfo - Raw extension block data paired with processed data ready for scratch-blocks\n * @property {ExtensionBlockMetadata} info - the raw block info\n * @property {object} json - the scratch-blocks JSON definition for this block\n * @property {string} xml - the scratch-blocks XML definition for this block\n */\n/**\n * @typedef {object} CategoryInfo - Information about a block category\n * @property {string} id - the unique ID of this category\n * @property {string} name - the human-readable name of this category\n * @property {string|undefined} blockIconURI - optional URI for the block icon image\n * @property {string} color1 - the primary color for this category, in '#rrggbb' format\n * @property {string} color2 - the secondary color for this category, in '#rrggbb' format\n * @property {string} color3 - the tertiary color for this category, in '#rrggbb' format\n * @property {Array.<ConvertedBlockInfo>} blocks - the blocks, separators, etc. in this category\n * @property {Array.<object>} menus - the menus provided by this category\n */\n/**\n * @typedef {object} PendingExtensionWorker - Information about an extension worker still initializing\n * @property {string} extensionURL - the URL of the extension to be loaded by this worker\n * @property {Function} resolve - function to call on successful worker startup\n * @property {Function} reject - function to call on failed worker startup\n */\nvar ExtensionManager = function () {\n  function ExtensionManager(runtime) {\n    _classCallCheck(this, ExtensionManager);\n    /**\n     * The ID number to provide to the next extension worker.\n     * @type {int}\n     */\n    this.nextExtensionWorker = 0;\n    /**\n     * FIFO queue of extensions which have been requested but not yet loaded in a worker,\n     * along with promise resolution functions to call once the worker is ready or failed.\n     *\n     * @type {Array.<PendingExtensionWorker>}\n     */\n    this.pendingExtensions = [];\n    /**\n     * Map of worker ID to workers which have been allocated but have not yet finished initialization.\n     * @type {Array.<PendingExtensionWorker>}\n     */\n    this.pendingWorkers = [];\n    /**\n     * Set of loaded extension URLs/IDs (equivalent for built-in extensions).\n     * @type {Set.<string>}\n     * @private\n     */\n    this._loadedExtensions = new Map();\n    /**\n     * Keep a reference to the runtime so we can construct internal extension objects.\n     * TODO: remove this in favor of extensions accessing the runtime as a service.\n     * @type {Runtime}\n     */\n    this.runtime = runtime;\n    dispatch.setService('extensions', this).catch(function (e) {\n      log.error(\"ExtensionManager was unable to register extension service: \".concat(JSON.stringify(e)));\n    });\n  }\n  /**\n   * Check whether an extension is registered or is in the process of loading. This is intended to control loading or\n   * adding extensions so it may return `true` before the extension is ready to be used. Use the promise returned by\n   * `loadExtensionURL` if you need to wait until the extension is truly ready.\n   * @param {string} extensionID - the ID of the extension.\n   * @returns {boolean} - true if loaded, false otherwise.\n   */\n  _createClass(ExtensionManager, [{\n    key: \"isExtensionLoaded\",\n    value: function isExtensionLoaded(extensionID) {\n      return this._loadedExtensions.has(extensionID);\n    }\n    /**\n     * Synchronously load an internal extension (core or non-core) by ID. This call will\n     * fail if the provided id is not does not match an internal extension.\n     * @param {string} extensionId - the ID of an internal extension\n     */\n  }, {\n    key: \"loadExtensionIdSync\",\n    value: function loadExtensionIdSync(extensionId) {\n      if (!builtinExtensions.hasOwnProperty(extensionId)) {\n        log.warn(\"Could not find extension \".concat(extensionId, \" in the built in extensions.\"));\n        return;\n      }\n      /** @TODO dupe handling for non-builtin extensions. See commit 670e51d33580e8a2e852b3b038bb3afc282f81b9 */\n      if (this.isExtensionLoaded(extensionId)) {\n        var message = \"Rejecting attempt to load a second extension with ID \".concat(extensionId);\n        log.warn(message);\n        return;\n      }\n      var extension = builtinExtensions[extensionId]();\n      var extensionInstance = new extension(this.runtime);\n      var serviceName = this._registerInternalExtension(extensionInstance);\n      this._loadedExtensions.set(extensionId, serviceName);\n    }\n    /**\n     * Load an extension by URL or internal extension ID\n     * @param {string} extensionURL - the URL for the extension to load OR the ID of an internal extension\n     * @returns {Promise} resolved once the extension is loaded and initialized or rejected on failure\n     */\n  }, {\n    key: \"loadExtensionURL\",\n    value: function loadExtensionURL(extensionURL) {\n      var _this = this;\n      if (builtinExtensions.hasOwnProperty(extensionURL)) {\n        /** @TODO dupe handling for non-builtin extensions. See commit 670e51d33580e8a2e852b3b038bb3afc282f81b9 */\n        if (this.isExtensionLoaded(extensionURL)) {\n          var message = \"Rejecting attempt to load a second extension with ID \".concat(extensionURL);\n          log.warn(message);\n          return Promise.resolve();\n        }\n        var extension = builtinExtensions[extensionURL]();\n        var extensionInstance = new extension(this.runtime);\n        var serviceName = this._registerInternalExtension(extensionInstance);\n        this._loadedExtensions.set(extensionURL, serviceName);\n        return Promise.resolve();\n      }\n      return new Promise(function (resolve, reject) {\n        // If we `require` this at the global level it breaks non-webpack targets, including tests\n        var ExtensionWorker = __webpack_require__(1103);\n        _this.pendingExtensions.push({\n          extensionURL: extensionURL,\n          resolve: resolve,\n          reject: reject\n        });\n        dispatch.addWorker(new ExtensionWorker());\n      });\n    }\n    /**\n     * Regenerate blockinfo for any loaded extensions\n     * @returns {Promise} resolved once all the extensions have been reinitialized\n     */\n  }, {\n    key: \"refreshBlocks\",\n    value: function refreshBlocks() {\n      var _this2 = this;\n      var allPromises = Array.from(this._loadedExtensions.values()).map(function (serviceName) {\n        return dispatch.call(serviceName, 'getInfo').then(function (info) {\n          info = _this2._prepareExtensionInfo(serviceName, info);\n          dispatch.call('runtime', '_refreshExtensionPrimitives', info);\n        }).catch(function (e) {\n          log.error(\"Failed to refresh built-in extension primitives: \".concat(JSON.stringify(e)));\n        });\n      });\n      return Promise.all(allPromises);\n    }\n  }, {\n    key: \"allocateWorker\",\n    value: function allocateWorker() {\n      var id = this.nextExtensionWorker++;\n      var workerInfo = this.pendingExtensions.shift();\n      this.pendingWorkers[id] = workerInfo;\n      return [id, workerInfo.extensionURL];\n    }\n    /**\n     * Synchronously collect extension metadata from the specified service and begin the extension registration process.\n     * @param {string} serviceName - the name of the service hosting the extension.\n     */\n  }, {\n    key: \"registerExtensionServiceSync\",\n    value: function registerExtensionServiceSync(serviceName) {\n      var info = dispatch.callSync(serviceName, 'getInfo');\n      this._registerExtensionInfo(serviceName, info);\n    }\n    /**\n     * Collect extension metadata from the specified service and begin the extension registration process.\n     * @param {string} serviceName - the name of the service hosting the extension.\n     */\n  }, {\n    key: \"registerExtensionService\",\n    value: function registerExtensionService(serviceName) {\n      var _this3 = this;\n      dispatch.call(serviceName, 'getInfo').then(function (info) {\n        _this3._registerExtensionInfo(serviceName, info);\n      });\n    }\n    /**\n     * Called by an extension worker to indicate that the worker has finished initialization.\n     * @param {int} id - the worker ID.\n     * @param {*?} e - the error encountered during initialization, if any.\n     */\n  }, {\n    key: \"onWorkerInit\",\n    value: function onWorkerInit(id, e) {\n      var workerInfo = this.pendingWorkers[id];\n      delete this.pendingWorkers[id];\n      if (e) {\n        workerInfo.reject(e);\n      } else {\n        workerInfo.resolve(id);\n      }\n    }\n    /**\n     * Register an internal (non-Worker) extension object\n     * @param {object} extensionObject - the extension object to register\n     * @returns {string} The name of the registered extension service\n     */\n  }, {\n    key: \"_registerInternalExtension\",\n    value: function _registerInternalExtension(extensionObject) {\n      var extensionInfo = extensionObject.getInfo();\n      var fakeWorkerId = this.nextExtensionWorker++;\n      var serviceName = \"extension_\".concat(fakeWorkerId, \"_\").concat(extensionInfo.id);\n      dispatch.setServiceSync(serviceName, extensionObject);\n      dispatch.callSync('extensions', 'registerExtensionServiceSync', serviceName);\n      return serviceName;\n    }\n    /**\n     * Sanitize extension info then register its primitives with the VM.\n     * @param {string} serviceName - the name of the service hosting the extension\n     * @param {ExtensionInfo} extensionInfo - the extension's metadata\n     * @private\n     */\n  }, {\n    key: \"_registerExtensionInfo\",\n    value: function _registerExtensionInfo(serviceName, extensionInfo) {\n      extensionInfo = this._prepareExtensionInfo(serviceName, extensionInfo);\n      dispatch.call('runtime', '_registerExtensionPrimitives', extensionInfo).catch(function (e) {\n        log.error(\"Failed to register primitives for extension on service \".concat(serviceName, \":\"), e);\n      });\n    }\n    /**\n     * Modify the provided text as necessary to ensure that it may be used as an attribute value in valid XML.\n     * @param {string} text - the text to be sanitized\n     * @returns {string} - the sanitized text\n     * @private\n     */\n  }, {\n    key: \"_sanitizeID\",\n    value: function _sanitizeID(text) {\n      return text.toString().replace(/[<\"&]/, '_');\n    }\n    /**\n     * Apply minor cleanup and defaults for optional extension fields.\n     * TODO: make the ID unique in cases where two copies of the same extension are loaded.\n     * @param {string} serviceName - the name of the service hosting this extension block\n     * @param {ExtensionInfo} extensionInfo - the extension info to be sanitized\n     * @returns {ExtensionInfo} - a new extension info object with cleaned-up values\n     * @private\n     */\n  }, {\n    key: \"_prepareExtensionInfo\",\n    value: function _prepareExtensionInfo(serviceName, extensionInfo) {\n      var _this4 = this;\n      extensionInfo = Object.assign({}, extensionInfo);\n      if (!/^[a-z0-9]+$/i.test(extensionInfo.id)) {\n        throw new Error('Invalid extension id');\n      }\n      extensionInfo.name = extensionInfo.name || extensionInfo.id;\n      extensionInfo.blocks = extensionInfo.blocks || [];\n      extensionInfo.targetTypes = extensionInfo.targetTypes || [];\n      extensionInfo.blocks = extensionInfo.blocks.reduce(function (results, blockInfo) {\n        try {\n          var result;\n          switch (blockInfo) {\n            case '---':\n              // separator\n              result = '---';\n              break;\n            default:\n              // an ExtensionBlockMetadata object\n              result = _this4._prepareBlockInfo(serviceName, blockInfo);\n              break;\n          }\n          results.push(result);\n        } catch (e) {\n          // TODO: more meaningful error reporting\n          log.error(\"Error processing block: \".concat(e.message, \", Block:\\n\").concat(JSON.stringify(blockInfo)));\n        }\n        return results;\n      }, []);\n      extensionInfo.menus = extensionInfo.menus || {};\n      extensionInfo.menus = this._prepareMenuInfo(serviceName, extensionInfo.menus);\n      return extensionInfo;\n    }\n    /**\n     * Prepare extension menus. e.g. setup binding for dynamic menu functions.\n     * @param {string} serviceName - the name of the service hosting this extension block\n     * @param {Array.<MenuInfo>} menus - the menu defined by the extension.\n     * @returns {Array.<MenuInfo>} - a menuInfo object with all preprocessing done.\n     * @private\n     */\n  }, {\n    key: \"_prepareMenuInfo\",\n    value: function _prepareMenuInfo(serviceName, menus) {\n      var menuNames = Object.getOwnPropertyNames(menus);\n      for (var i = 0; i < menuNames.length; i++) {\n        var menuName = menuNames[i];\n        var menuInfo = menus[menuName]; // If the menu description is in short form (items only) then normalize it to general form: an object with\n        // its items listed in an `items` property.\n        if (!menuInfo.items) {\n          menuInfo = {\n            items: menuInfo\n          };\n          menus[menuName] = menuInfo;\n        } // If `items` is a string, it should be the name of a function in the extension object. Calling the\n        // function should return an array of items to populate the menu when it is opened.\n        if (typeof menuInfo.items === 'string') {\n          var menuItemFunctionName = menuInfo.items;\n          var serviceObject = dispatch.services[serviceName]; // Bind the function here so we can pass a simple item generation function to Scratch Blocks later.\n          menuInfo.items = this._getExtensionMenuItems.bind(this, serviceObject, menuItemFunctionName);\n        }\n      }\n      return menus;\n    }\n    /**\n     * Fetch the items for a particular extension menu, providing the target ID for context.\n     * @param {object} extensionObject - the extension object providing the menu.\n     * @param {string} menuItemFunctionName - the name of the menu function to call.\n     * @returns {Array} menu items ready for scratch-blocks.\n     * @private\n     */\n  }, {\n    key: \"_getExtensionMenuItems\",\n    value: function _getExtensionMenuItems(extensionObject, menuItemFunctionName) {\n      // Fetch the items appropriate for the target currently being edited. This assumes that menus only\n      // collect items when opened by the user while editing a particular target.\n      var editingTarget = this.runtime.getEditingTarget() || this.runtime.getTargetForStage();\n      var editingTargetID = editingTarget ? editingTarget.id : null;\n      var extensionMessageContext = this.runtime.makeMessageContextForTarget(editingTarget); // TODO: Fix this to use dispatch.call when extensions are running in workers.\n      var menuFunc = extensionObject[menuItemFunctionName];\n      var menuItems = menuFunc.call(extensionObject, editingTargetID).map(function (item) {\n        item = maybeFormatMessage(item, extensionMessageContext);\n        switch (_typeof(item)) {\n          case 'object':\n            return [maybeFormatMessage(item.text, extensionMessageContext), item.value];\n          case 'string':\n            return [item, item];\n          default:\n            return item;\n        }\n      });\n      if (!menuItems || menuItems.length < 1) {\n        throw new Error(\"Extension menu returned no items: \".concat(menuItemFunctionName));\n      }\n      return menuItems;\n    }\n    /**\n     * Apply defaults for optional block fields.\n     * @param {string} serviceName - the name of the service hosting this extension block\n     * @param {ExtensionBlockMetadata} blockInfo - the block info from the extension\n     * @returns {ExtensionBlockMetadata} - a new block info object which has values for all relevant optional fields.\n     * @private\n     */\n  }, {\n    key: \"_prepareBlockInfo\",\n    value: function _prepareBlockInfo(serviceName, blockInfo) {\n      blockInfo = Object.assign({}, {\n        blockType: BlockType.COMMAND,\n        terminal: false,\n        blockAllThreads: false,\n        arguments: {}\n      }, blockInfo);\n      blockInfo.opcode = blockInfo.opcode && this._sanitizeID(blockInfo.opcode);\n      blockInfo.text = blockInfo.text || blockInfo.opcode;\n      switch (blockInfo.blockType) {\n        case BlockType.EVENT:\n          if (blockInfo.func) {\n            log.warn(\"Ignoring function \\\"\".concat(blockInfo.func, \"\\\" for event block \").concat(blockInfo.opcode));\n          }\n          break;\n        case BlockType.BUTTON:\n          if (blockInfo.opcode) {\n            log.warn(\"Ignoring opcode \\\"\".concat(blockInfo.opcode, \"\\\" for button with text: \").concat(blockInfo.text));\n          }\n          break;\n        default:\n          {\n            if (!blockInfo.opcode) {\n              throw new Error('Missing opcode for block');\n            }\n            var funcName = blockInfo.func ? this._sanitizeID(blockInfo.func) : blockInfo.opcode;\n            var getBlockInfo = blockInfo.isDynamic ? function (args) {\n              return args && args.mutation && args.mutation.blockInfo;\n            } : function () {\n              return blockInfo;\n            };\n            var callBlockFunc = function () {\n              if (dispatch._isRemoteService(serviceName)) {\n                return function (args, util, realBlockInfo) {\n                  return dispatch.call(serviceName, funcName, args, util, realBlockInfo);\n                };\n              } // avoid promise latency if we can call direct\n              var serviceObject = dispatch.services[serviceName];\n              if (!serviceObject[funcName]) {\n                // The function might show up later as a dynamic property of the service object\n                log.warn(\"Could not find extension block function called \".concat(funcName));\n              }\n              return function (args, util, realBlockInfo) {\n                return serviceObject[funcName](args, util, realBlockInfo);\n              };\n            }();\n            blockInfo.func = function (args, util) {\n              var realBlockInfo = getBlockInfo(args); // TODO: filter args using the keys of realBlockInfo.arguments? maybe only if sandboxed?\n              return callBlockFunc(args, util, realBlockInfo);\n            };\n            break;\n          }\n      }\n      return blockInfo;\n    }\n  }]);\n  return ExtensionManager;\n}();\nmodule.exports = ExtensionManager;\n })