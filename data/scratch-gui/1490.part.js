/* 1490 */\n (function(module, exports, __webpack_require__) {\nfunction _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\nvar formatMessage = __webpack_require__(71);\nvar nets = __webpack_require__(223);\nvar ArgumentType = __webpack_require__(63);\nvar BlockType = __webpack_require__(45);\nvar Cast = __webpack_require__(48);\nvar MathUtil = __webpack_require__(62);\nvar Clone = __webpack_require__(113);\nvar log = __webpack_require__(39);\n/**\n * Icon svg to be displayed in the blocks category menu, encoded as a data URI.\n * @type {string}\n */\n// eslint-disable-next-line max-len\nvar menuIconURI = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiA8IS0tIENyZWF0ZWQgd2l0aCBNZXRob2QgRHJhdyAtIGh0dHA6Ly9naXRodWIuY29tL2R1b3BpeGVsL01ldGhvZC1EcmF3LyAtLT4KCiA8Zz4KICA8dGl0bGU+YmFja2dyb3VuZDwvdGl0bGU+CiAgPHJlY3QgeD0iLTEiIHk9Ii0xIiB3aWR0aD0iNDIiIGhlaWdodD0iNDIiIGlkPSJjYW52YXNfYmFja2dyb3VuZCIgZmlsbD0iI2ZmZiIvPgogIDxnIGlkPSJjYW52YXNHcmlkIiBkaXNwbGF5PSJub25lIj4KICAgPHJlY3QgaWQ9InN2Z181IiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4PSIwIiB5PSIwIiBzdHJva2Utd2lkdGg9IjAiIGZpbGw9InVybCgjZ3JpZHBhdHRlcm4pIi8+CiAgPC9nPgogPC9nPgogPGc+CiAgPHRpdGxlPkxheWVyIDE8L3RpdGxlPgogIDxyZWN0IGZpbGw9IiNhYTU2ZmYiIHN0cm9rZS13aWR0aD0iMC41IiBzdHJva2Utb3BhY2l0eT0ibnVsbCIgeD0iNy43MDgzNDMiIHk9IjMuNzc3MzU2IiB3aWR0aD0iMjQuOTk5OTgiIGhlaWdodD0iMzMuMjQ5OTc0IiBpZD0ic3ZnXzkiIHN0cm9rZT0iIzAwMCIvPgogIDxyZWN0IGZpbGw9IiMxMmE1NTkiIHN0cm9rZS13aWR0aD0iMS41IiB4PSIxMS44MzMzNDYiIHk9IjguMDE4MjQ0IiB3aWR0aD0iMTQuOTk5OTc5IiBoZWlnaHQ9IjI1LjMzMzI5OSIgaWQ9InN2Z18xIiBzdHJva2U9IiMwMDAiLz4KICA8ZWxsaXBzZSBmaWxsPSIjZmYwZjIzIiBzdHJva2Utd2lkdGg9IjAuNSIgY3g9IjIyLjk5OTk5NyIgY3k9IjIzLjM1MTU1NiIgaWQ9InN2Z18yIiByeD0iMC45MTY2NjUiIHJ5PSIwLjk5OTk5OCIgc3Ryb2tlPSIjMDAwIi8+CiAgPGxpbmUgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIwLjUiIHgxPSIxMi4xNDU4NDYiIHkxPSIzMy4xNjQwNDEiIHgyPSI3Ljg3NTAwNCIgeTI9IjM2LjgwOTg4MyIgaWQ9InN2Z18zIiBzdHJva2UtbGluZWpvaW49InVuZGVmaW5lZCIgc3Ryb2tlLWxpbmVjYXA9InVuZGVmaW5lZCIgc3Ryb2tlPSIjMDAwIi8+CiAgPGxpbmUgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIwLjUiIHgxPSIyNi40NTgzMjUiIHkxPSIzMy4zMzA3MDYiIHgyPSIzMi40OTk5NzQiIHkyPSIzNi44NzIzNjEiIGlkPSJzdmdfNCIgc3Ryb2tlLWxpbmVqb2luPSJ1bmRlZmluZWQiIHN0cm9rZS1saW5lY2FwPSJ1bmRlZmluZWQiIHN0cm9rZT0iIzAwMCIvPgogIDxsaW5lIGZpbGw9Im5vbmUiIHN0cm9rZS13aWR0aD0iMC41IiBzdHJva2Utb3BhY2l0eT0ibnVsbCIgeDE9IjExLjY2NjY4IiB5MT0iNy43MjY1NzUiIHgyPSI3LjkxNjcxNCIgeTI9IjQuMDE4MzA0IiBpZD0ic3ZnXzYiIHN0cm9rZS1saW5lam9pbj0ibnVsbCIgc3Ryb2tlLWxpbmVjYXA9Im51bGwiIHN0cm9rZT0iIzAwMCIvPgogIDxsaW5lIGZpbGw9Im5vbmUiIHN0cm9rZS13aWR0aD0iMC41IiBzdHJva2Utb3BhY2l0eT0ibnVsbCIgeDE9IjI3LjA4MzMyNyIgeTE9IjcuNzY4MjM5IiB4Mj0iMzIuNzA4MzAxIiB5Mj0iNC4wNTk5NjciIGlkPSJzdmdfNyIgc3Ryb2tlLWxpbmVqb2luPSJudWxsIiBzdHJva2UtbGluZWNhcD0ibnVsbCIgc3Ryb2tlPSIjMDAwIi8+CiA8L2c+Cjwvc3ZnPg==';\n/**\n * Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.\n * @type {string}\n */\n// eslint-disable-next-line max-len\nvar blockIconURI = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiA8IS0tIENyZWF0ZWQgd2l0aCBNZXRob2QgRHJhdyAtIGh0dHA6Ly9naXRodWIuY29tL2R1b3BpeGVsL01ldGhvZC1EcmF3LyAtLT4KCiA8Zz4KICA8dGl0bGU+YmFja2dyb3VuZDwvdGl0bGU+CiAgPHJlY3QgeD0iLTEiIHk9Ii0xIiB3aWR0aD0iNDIiIGhlaWdodD0iNDIiIGlkPSJjYW52YXNfYmFja2dyb3VuZCIgZmlsbD0iI2ZmZiIvPgogIDxnIGlkPSJjYW52YXNHcmlkIiBkaXNwbGF5PSJub25lIj4KICAgPHJlY3QgaWQ9InN2Z181IiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4PSIwIiB5PSIwIiBzdHJva2Utd2lkdGg9IjAiIGZpbGw9InVybCgjZ3JpZHBhdHRlcm4pIi8+CiAgPC9nPgogPC9nPgogPGc+CiAgPHRpdGxlPkxheWVyIDE8L3RpdGxlPgogIDxyZWN0IGZpbGw9IiNhYTU2ZmYiIHN0cm9rZS13aWR0aD0iMC41IiBzdHJva2Utb3BhY2l0eT0ibnVsbCIgeD0iNy43MDgzNDMiIHk9IjMuNzc3MzU2IiB3aWR0aD0iMjQuOTk5OTgiIGhlaWdodD0iMzMuMjQ5OTc0IiBpZD0ic3ZnXzkiIHN0cm9rZT0iIzAwMCIvPgogIDxyZWN0IGZpbGw9IiMxMmE1NTkiIHN0cm9rZS13aWR0aD0iMS41IiB4PSIxMS44MzMzNDYiIHk9IjguMDE4MjQ0IiB3aWR0aD0iMTQuOTk5OTc5IiBoZWlnaHQ9IjI1LjMzMzI5OSIgaWQ9InN2Z18xIiBzdHJva2U9IiMwMDAiLz4KICA8ZWxsaXBzZSBmaWxsPSIjZmYwZjIzIiBzdHJva2Utd2lkdGg9IjAuNSIgY3g9IjIyLjk5OTk5NyIgY3k9IjIzLjM1MTU1NiIgaWQ9InN2Z18yIiByeD0iMC45MTY2NjUiIHJ5PSIwLjk5OTk5OCIgc3Ryb2tlPSIjMDAwIi8+CiAgPGxpbmUgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIwLjUiIHgxPSIxMi4xNDU4NDYiIHkxPSIzMy4xNjQwNDEiIHgyPSI3Ljg3NTAwNCIgeTI9IjM2LjgwOTg4MyIgaWQ9InN2Z18zIiBzdHJva2UtbGluZWpvaW49InVuZGVmaW5lZCIgc3Ryb2tlLWxpbmVjYXA9InVuZGVmaW5lZCIgc3Ryb2tlPSIjMDAwIi8+CiAgPGxpbmUgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIwLjUiIHgxPSIyNi40NTgzMjUiIHkxPSIzMy4zMzA3MDYiIHgyPSIzMi40OTk5NzQiIHkyPSIzNi44NzIzNjEiIGlkPSJzdmdfNCIgc3Ryb2tlLWxpbmVqb2luPSJ1bmRlZmluZWQiIHN0cm9rZS1saW5lY2FwPSJ1bmRlZmluZWQiIHN0cm9rZT0iIzAwMCIvPgogIDxsaW5lIGZpbGw9Im5vbmUiIHN0cm9rZS13aWR0aD0iMC41IiBzdHJva2Utb3BhY2l0eT0ibnVsbCIgeDE9IjExLjY2NjY4IiB5MT0iNy43MjY1NzUiIHgyPSI3LjkxNjcxNCIgeTI9IjQuMDE4MzA0IiBpZD0ic3ZnXzYiIHN0cm9rZS1saW5lam9pbj0ibnVsbCIgc3Ryb2tlLWxpbmVjYXA9Im51bGwiIHN0cm9rZT0iIzAwMCIvPgogIDxsaW5lIGZpbGw9Im5vbmUiIHN0cm9rZS13aWR0aD0iMC41IiBzdHJva2Utb3BhY2l0eT0ibnVsbCIgeDE9IjI3LjA4MzMyNyIgeTE9IjcuNzY4MjM5IiB4Mj0iMzIuNzA4MzAxIiB5Mj0iNC4wNTk5NjciIGlkPSJzdmdfNyIgc3Ryb2tlLWxpbmVqb2luPSJudWxsIiBzdHJva2UtbGluZWNhcD0ibnVsbCIgc3Ryb2tlPSIjMDAwIi8+CiA8L2c+Cjwvc3ZnPg==';\n\n/**\n * 超时设定\n * @type {int}\n */\nvar SERVER_TIMEOUT = 10000; // 10 seconds\n/**\n * 硬件设备共有四个输出口：0-3\n * @type {number}\n */\nvar IRPORT = 0;\n\n\n/**\n * 红外载波频率\n * @type {number}\n */\nvar IRCARRIERRATE = 32000;\n\n\n\n/**\n * 接收到的数据\n * @type {STRING}\n */\nvar RAWDATA = '';\n\n/**\n * Class for the IOTDOORCONTROLLER blocks.\n * @constructor\n */\nvar Scratch3IOTDOORCONTROLLERBlocks = function () {\n  function Scratch3IOTDOORCONTROLLERBlocks(runtime) {\n    _classCallCheck(this, Scratch3IOTDOORCONTROLLERBlocks);\n    /**\n     * The runtime instantiating this block package.\n     * @type {Runtime}\n     */\n    this.runtime = runtime;\n    /**\n     * Map of soundPlayers by sound id.\n     * @type {Map<string, SoundPlayer>}\n     */\n    //this._soundPlayers = new Map();\n //   this._stopAllSpeech = this._stopAllSpeech.bind(this);\n //   if (this.runtime) {\n //     this.runtime.on('PROJECT_STOP_ALL', this._stopAllSpeech);\n //   }\n    this._onTargetCreated = this._onTargetCreated.bind(this);\n    if (this.runtime) {\n      runtime.on('targetWasCreated', this._onTargetCreated);\n    }\n  }\n  /**\n   * An object with info for each voice.\n   */\n  _createClass(Scratch3IOTDOORCONTROLLERBlocks, [{\n    key: \"_getState\",\n    /**\n     * @param {Target} target - collect  state for this target.\n     * @returns {IOTDOORCONTROLLERState} the mutable state associated with that target. This will be created if necessary.\n     * @private\n     */\n    value: function _getState(target) {\n      var state = target.getCustomState(Scratch3IOTDOORCONTROLLERBlocks.STATE_KEY);\n      if (!state) {\n        state = Clone.simple(Scratch3IOTDOORCONTROLLERBlocks.DEFAULT_IOTDOORCONTROLLER_STATE);\n        target.setCustomState(Scratch3IOTDOORCONTROLLERBlocks.STATE_KEY, state);\n      }\n      return state;\n    }\n    /**\n     * When a Target is cloned, clone the state.\n     * @param {Target} newTarget - the newly created target.\n     * @param {Target} [sourceTarget] - the target used as a source for the new clone, if any.\n     * @listens Runtime#event:targetWasCreated\n     * @private\n     */\n  }, {\n    key: \"_onTargetCreated\",\n    value: function _onTargetCreated(newTarget, sourceTarget) {\n      if (sourceTarget) {\n        var state = sourceTarget.getCustomState(Scratch3IOTDOORCONTROLLERBlocks.STATE_KEY);\n        if (state) {\n          newTarget.setCustomState(Scratch3IOTDOORCONTROLLERBlocks.STATE_KEY, Clone.simple(state));\n        }\n      }\n    }\n    /**\n     * @returns {object} metadata for this extension and its blocks.\n     */\n  }, {\n    key: \"getInfo\",\n    value: function getInfo() {\n      // Only localize the default input to the \"speak\" block if we are in a\n      // supported language.\n      var defaultTextToSpeak = 'hello';\n      return {\n        id: 'IOTDOORCONTROLLER',\n        name: formatMessage({\n          id: 'IOTDOORCONTROLLER.categoryName',\n          default: '门禁系统',\n          description: 'Name of the Text to Speech extension.'\n        }),\n        blockIconURI: blockIconURI,\n        menuIconURI: menuIconURI,\n        blocks: [{\n          opcode: 'setIRPort',\n          text: formatMessage({\n            id: 'IOTDOORCONTROLLER.setIRPortBlock',\n            default: '选择开关[WORDS]',\n            description: 'Set the voice for speech synthesis.'\n          }),\n          blockType: BlockType.COMMAND,\n          arguments: {\n            WORDS: {\n              type: ArgumentType.STRING,\n              menu: 'ports',\n              defaultValue: '无线开关列表'\n            }\n          }\n        }, {\n          opcode: 'setIRRate',\n          text: formatMessage({\n            id: 'IOTDOORCONTROLLER.setIRRateBlock',\n            default: '设置开关状态[WORDS]',\n            description: 'Set the language for speech synthesis.'\n          }),\n          blockType: BlockType.COMMAND,\n          arguments: {\n            WORDS: {\n              type: ArgumentType.STRING,\n              menu: 'status',\n              defaultValue: '开'\n            }\n          }\n        }, {\n          opcode: 'getIRData',\n          text: formatMessage({\n            id: 'IOTDOORCONTROLLER.getIRData',\n            default: '获取开关[WORDS]状态',\n            description: '返回接收到的数据'\n          }),\n          blockType: BlockType.REPORTER,\n          arguments: {\n            WORDS: {\n              type: ArgumentType.STRING,\n              menu: 'ports',\n              defaultValue: '无线开关列表'\n            }\n          }\n        }],\n        menus: {\n          ports: {\n            acceptReporters: true,\n            items: ['0', '1', '2', '3']\n          },\n          status: {\n            acceptReporters: true,\n            items: ['开', '关']\n          }\n        }\n      };\n    }\n    /**\n     * 当收到数据时，激发此积木\n     * 接收到的数据保存在RAWDATA中\n     */\n  }, {\n    key: \"whenDataComes\",\n    value: function whenDataComes() {\n       RAWDATA=\"test\";\n    }\n\n    /**\n     * 发送并等待\n     * @param  {object} args Block arguments\n     * @param {object} util Utility object provided by the runtime.\n     * @return {Promise} A promise that resolves after playing the sound\n     */\n  }, {\n    key: \"sendAndWait\",\n    value: function sendAndWait(args, util) {\n      var _this4 = this;\n      var words = Cast.toString(args.WORDS);\n      var path = \"./extension/lock/device.php\";\n      path += \"?W=\"+words;\n      return new Promise(function (resolve) {\n        nets({\n          url: path,\n          timeout: SERVER_TIMEOUT\n        }, function (err, res, body) {\n          if (err) {\n            log.warn(err);\n            return resolve();\n          }\n          if (res.statusCode !== 200) {\n            log.warn(res.statusCode);\n            return resolve();\n          } // Play the sound\n          var sound = {\n            data: {\n              buffer: body.buffer\n            }\n          };\n          return resolve();\n        });\n      });\n    }\n  },{\n    key: \"setIRRate\",\n    value: function setIRRate(args, util) {//设置载波频率\n      var _this4 = this;\n      IRCARRIERRATE = Cast.toString(args.WORDS);\n     // return resolve();\n    }\n  },{\n    key: \"getIRData\",\n    value: function getIRRate(args, util) {//返回接收到的数据\n      var _this4 = this;\n      return RAWDATA;\n     // return resolve();\n    }\n  }, {\n    key: \"setIRPort\",\n    value: function setIRRate(args, util) {//设置发送端口\n      var _this4 = this;\n      IRPORT = Cast.toString(args.WORDS);\n      //return resolve();\n    }\n  }], [{\n    key: \"STATE_KEY\",\n    get: function get() {\n      return 'Scratch.IOTDOORCONTROLLER';\n    }\n    /**\n     * The default state, to be used when a target has no existing state.\n     * @type {IOTDOORCONTROLLERState}\n     */\n  }, {\n    key: \"DEFAULT_IOTDOORCONTROLLER_STATE\",\n    get: function get() {\n      return {\n        voiceId: ALTO_ID\n      };\n    }\n  }]);\n  return Scratch3IOTDOORCONTROLLERBlocks;\n}();\nmodule.exports = Scratch3IOTDOORCONTROLLERBlocks;\n })