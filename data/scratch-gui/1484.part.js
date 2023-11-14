/* 1484 */\n (function(module, exports, __webpack_require__) {\nfunction _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\nvar formatMessage = __webpack_require__(71);\nvar nets = __webpack_require__(223);\nvar ArgumentType = __webpack_require__(63);\nvar BlockType = __webpack_require__(45);\nvar Cast = __webpack_require__(48);\nvar MathUtil = __webpack_require__(62);\nvar Clone = __webpack_require__(113);\nvar log = __webpack_require__(39);\n/**\n * Icon svg to be displayed in the blocks category menu, encoded as a data URI.\n * @type {string}\n */\n// eslint-disable-next-line max-len\nvar menuIconURI = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiA8IS0tIENyZWF0ZWQgd2l0aCBNZXRob2QgRHJhdyAtIGh0dHA6Ly9naXRodWIuY29tL2R1b3BpeGVsL01ldGhvZC1EcmF3LyAtLT4KCiA8Zz4KICA8dGl0bGU+YmFja2dyb3VuZDwvdGl0bGU+CiAgPHJlY3QgZmlsbD0ibm9uZSIgaWQ9ImNhbnZhc19iYWNrZ3JvdW5kIiBoZWlnaHQ9IjQyIiB3aWR0aD0iNDIiIHk9Ii0xIiB4PSItMSIvPgogIDxnIGRpc3BsYXk9Im5vbmUiIGlkPSJjYW52YXNHcmlkIj4KICAgPHJlY3QgZmlsbD0idXJsKCNncmlkcGF0dGVybikiIHN0cm9rZS13aWR0aD0iMCIgeT0iMCIgeD0iMCIgaGVpZ2h0PSIxMDAlIiB3aWR0aD0iMTAwJSIgaWQ9InN2Z18zIi8+CiAgPC9nPgogPC9nPgogPGc+CiAgPHRpdGxlPkxheWVyIDE8L3RpdGxlPgogIDxyZWN0IHN0cm9rZT0iI2ZmN2YwMCIgaWQ9InN2Z18yIiBoZWlnaHQ9IjIwLjAwMDAwMSIgd2lkdGg9IjIwIiB5PSIxNS42MDkzNzUiIHg9IjEwIiBzdHJva2Utd2lkdGg9IjEuNSIgZmlsbD0iI2JmMTY5NyIgcng9IjMiLz4KICA8ZWxsaXBzZSBzdHJva2U9IiNmZmFhNTYiIHJ5PSIxMiIgcng9IjE2IiBpZD0ic3ZnXzEiIGN5PSIxNi41IiBjeD0iMjAiIHN0cm9rZS13aWR0aD0iMS41IiBmaWxsPSIjZmY3ZjAwIi8+CiAgPGVsbGlwc2Ugc3Ryb2tlPSIjZTU3OTE0IiByeT0iOCIgcng9IjEwIiBpZD0ic3ZnXzUiIGN5PSIxOC43NDk5OTkiIGN4PSIyMCIgc3Ryb2tlLXdpZHRoPSIyLjUiIGZpbGw9IiNiZjAwYmYiIG9wYWNpdHk9IjAuOSIvPgogPC9nPgo8L3N2Zz4=';\n/**\n * Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.\n * @type {string}\n */\n// eslint-disable-next-line max-len\nvar blockIconURI = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiA8IS0tIENyZWF0ZWQgd2l0aCBNZXRob2QgRHJhdyAtIGh0dHA6Ly9naXRodWIuY29tL2R1b3BpeGVsL01ldGhvZC1EcmF3LyAtLT4KCiA8Zz4KICA8dGl0bGU+YmFja2dyb3VuZDwvdGl0bGU+CiAgPHJlY3QgZmlsbD0ibm9uZSIgaWQ9ImNhbnZhc19iYWNrZ3JvdW5kIiBoZWlnaHQ9IjQyIiB3aWR0aD0iNDIiIHk9Ii0xIiB4PSItMSIvPgogIDxnIGRpc3BsYXk9Im5vbmUiIGlkPSJjYW52YXNHcmlkIj4KICAgPHJlY3QgZmlsbD0idXJsKCNncmlkcGF0dGVybikiIHN0cm9rZS13aWR0aD0iMCIgeT0iMCIgeD0iMCIgaGVpZ2h0PSIxMDAlIiB3aWR0aD0iMTAwJSIgaWQ9InN2Z18zIi8+CiAgPC9nPgogPC9nPgogPGc+CiAgPHRpdGxlPkxheWVyIDE8L3RpdGxlPgogIDxyZWN0IHN0cm9rZT0iI2ZmN2YwMCIgaWQ9InN2Z18yIiBoZWlnaHQ9IjIwLjAwMDAwMSIgd2lkdGg9IjIwIiB5PSIxNS42MDkzNzUiIHg9IjEwIiBzdHJva2Utd2lkdGg9IjEuNSIgZmlsbD0iI2JmMTY5NyIgcng9IjMiLz4KICA8ZWxsaXBzZSBzdHJva2U9IiNmZmFhNTYiIHJ5PSIxMiIgcng9IjE2IiBpZD0ic3ZnXzEiIGN5PSIxNi41IiBjeD0iMjAiIHN0cm9rZS13aWR0aD0iMS41IiBmaWxsPSIjZmY3ZjAwIi8+CiAgPGVsbGlwc2Ugc3Ryb2tlPSIjZTU3OTE0IiByeT0iOCIgcng9IjEwIiBpZD0ic3ZnXzUiIGN5PSIxOC43NDk5OTkiIGN4PSIyMCIgc3Ryb2tlLXdpZHRoPSIyLjUiIGZpbGw9IiNiZjAwYmYiIG9wYWNpdHk9IjAuOSIvPgogPC9nPgo8L3N2Zz4=';\n\n/**\n * 超时设定\n * @type {int}\n */\nvar SERVER_TIMEOUT = 10000; // 10 seconds\n/**\n * 硬件设备共有四个输出口：0-3\n * @type {number}\n */\nvar IRPORT = 0;\n\n\n/**\n * 红外载波频率\n * @type {number}\n */\nvar IRCARRIERRATE = 32000;\n\nvar bSignal=false;\n\n/**\n * 接收到的数据\n * @type {STRING}\n */\nvar RAWDATA = '';\n\n/**\n * Class for the IRREMOTER blocks.\n * @constructor\n */\nvar Scratch3IRREMOTERBlocks = function () {\n  function Scratch3IRREMOTERBlocks(runtime) {\n    _classCallCheck(this, Scratch3IRREMOTERBlocks);\n    /**\n     * The runtime instantiating this block package.\n     * @type {Runtime}\n     */\n    this.runtime = runtime;\n    /**\n     * Map of soundPlayers by sound id.\n     * @type {Map<string, SoundPlayer>}\n     */\n    //this._soundPlayers = new Map();\n //   this._stopAllSpeech = this._stopAllSpeech.bind(this);\n //   if (this.runtime) {\n //     this.runtime.on('PROJECT_STOP_ALL', this._stopAllSpeech);\n //   }\n    this._onTargetCreated = this._onTargetCreated.bind(this);\n    if (this.runtime) {\n      runtime.on('targetWasCreated', this._onTargetCreated);\n    }\n  }\n  /**\n   * An object with info for each voice.\n   */\n  _createClass(Scratch3IRREMOTERBlocks, [{\n    key: \"_getState\",\n    /**\n     * @param {Target} target - collect  state for this target.\n     * @returns {IRREMOTERState} the mutable state associated with that target. This will be created if necessary.\n     * @private\n     */\n    value: function _getState(target) {\n      var state = target.getCustomState(Scratch3IRREMOTERBlocks.STATE_KEY);\n      if (!state) {\n        state = Clone.simple(Scratch3IRREMOTERBlocks.DEFAULT_IRREMOTER_STATE);\n        target.setCustomState(Scratch3IRREMOTERBlocks.STATE_KEY, state);\n      }\n      return state;\n    }\n    /**\n     * When a Target is cloned, clone the state.\n     * @param {Target} newTarget - the newly created target.\n     * @param {Target} [sourceTarget] - the target used as a source for the new clone, if any.\n     * @listens Runtime#event:targetWasCreated\n     * @private\n     */\n  }, {\n    key: \"_onTargetCreated\",\n    value: function _onTargetCreated(newTarget, sourceTarget) {\n      if (sourceTarget) {\n        var state = sourceTarget.getCustomState(Scratch3IRREMOTERBlocks.STATE_KEY);\n        if (state) {\n          newTarget.setCustomState(Scratch3IRREMOTERBlocks.STATE_KEY, Clone.simple(state));\n        }\n      }\n    }\n    /**\n     * @returns {object} metadata for this extension and its blocks.\n     */\n  }, {\n    key: \"getInfo\",\n    value: function getInfo() {\n      // Only localize the default input to the \"speak\" block if we are in a\n      // supported language.\n      var defaultTextToSpeak = 'hello';\n      return {\n        id: 'IRREMOTER',\n        name: formatMessage({\n          id: 'IRREMOTER.categoryName',\n          default: '红外遥控器',\n          description: 'Name of the Text to Speech extension.'\n        }),\n        blockIconURI: blockIconURI,\n        menuIconURI: menuIconURI,\n        blocks: [{\n          opcode: 'whenDataComes',\n          text: formatMessage({\n            id: 'IRREMOTER.whenDataComes',\n            default: '当接收到数据',\n            description: '接收到数据.'\n          }),\n          blockType: BlockType.HAT\n        }, {\n          opcode: 'setIRPort',\n          text: formatMessage({\n            id: 'IRREMOTER.setIRPortBlock',\n            default: '设置发送端口[WORDS]',\n            description: 'Set the voice for speech synthesis.'\n          }),\n          blockType: BlockType.COMMAND,\n          arguments: {\n            WORDS: {\n              type: ArgumentType.STRING,\n              menu: 'ports',\n              defaultValue: '0'\n            }\n          }\n        }, {\n          opcode: 'setIRRate',\n          text: formatMessage({\n            id: 'IRREMOTER.setIRRateBlock',\n            default: '设置载波频率[WORDS]',\n            description: 'Set the language for speech synthesis.'\n          }),\n          blockType: BlockType.COMMAND,\n          arguments: {\n            WORDS: {\n              type: ArgumentType.STRING,\n              menu: 'carrier_waves',\n              defaultValue: '36000'\n            }\n          }\n        }, {\n          opcode: 'sendAndWait',\n          text: formatMessage({\n            id: 'IRREMOTER.sendAndWaitBlock',\n            default: '发送数据[WORDS]',\n            description: 'send some data.'\n          }),\n          blockType: BlockType.COMMAND,\n          arguments: {\n            WORDS: {\n              type: ArgumentType.STRING,\n              defaultValue: defaultTextToSpeak\n            }\n          }\n        }, {\n          opcode: 'getIRData',\n          text: formatMessage({\n            id: 'IRREMOTER.getIRData',\n            default: '接收到的数据',\n            description: '返回接收到的数据'\n          }),\n          blockType: BlockType.REPORTER\n        }],\n        menus: {\n          ports: {\n            acceptReporters: true,\n            items: ['0', '1', '2', '3']\n          },\n          carrier_waves: {\n            acceptReporters: true,\n            items: ['32000', '36000', '40000', '5600']\n          }\n        }\n      };\n    }\n    /**\n     * 当收到数据时，激发此积木\n     * 接收到的数据保存在RAWDATA中\n     */\n  }, {\n    key: \"whenDataComes\",\n    value: function whenDataComes() {\n       RAWDATA=\"test\";\n       return bSignal;\n    }\n\n    /**\n     * 发送并等待\n     * @param  {object} args Block arguments\n     * @param {object} util Utility object provided by the runtime.\n     * @return {Promise} A promise that resolves after playing the sound\n     */\n  }, {\n    key: \"sendAndWait\",\n    value: function sendAndWait(args, util) {\n      var _this4 = this;\n      var words = Cast.toString(args.WORDS);\n      var path = \"./extension/ir/device.php\";\n      path += \"?W=\"+words;\n      return new Promise(function (resolve) {\n        nets({\n          url: path,\n          timeout: SERVER_TIMEOUT\n        }, function (err, res, body) {\n          if (err) {\n            log.warn(err);\n            return resolve();\n          }\n          if (res.statusCode !== 200) {\n            log.warn(res.statusCode);\n            return resolve();\n          } // Play the sound\n          var sound = {\n            data: {\n              buffer: body.buffer\n            }\n          };\n          return resolve();\n        });\n      });\n    }\n  },{\n    key: \"setIRRate\",\n    value: function setIRRate(args, util) {//设置载波频率\n      var _this4 = this;\n      IRCARRIERRATE = Cast.toString(args.WORDS);\n      bSignal=true;\n     // return resolve();\n    }\n  },{\n    key: \"getIRData\",\n    value: function getIRRate(args, util) {//返回接收到的数据\n      var _this4 = this;\n      return RAWDATA;\n     // return resolve();\n    }\n  }, {\n    key: \"setIRPort\",\n    value: function setIRRate(args, util) {//设置发送端口\n      var _this4 = this;\n      IRPORT = Cast.toString(args.WORDS);\n      bSignal=false;\n      //return resolve();\n    }\n  }], [{\n    key: \"STATE_KEY\",\n    get: function get() {\n      return 'Scratch.IRREMOTER';\n    }\n    /**\n     * The default state, to be used when a target has no existing state.\n     * @type {IRREMOTERState}\n     */\n  }, {\n    key: \"DEFAULT_IRREMOTER_STATE\",\n    get: function get() {\n      return {\n        voiceId: ALTO_ID\n      };\n    }\n  }]);\n  return Scratch3IRREMOTERBlocks;\n}();\nmodule.exports = Scratch3IRREMOTERBlocks;\n })