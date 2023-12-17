/* 1487 */\n (function(module, exports, __webpack_require__) {\nfunction _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\nvar formatMessage = __webpack_require__(71);\nvar nets = __webpack_require__(223);\nvar ArgumentType = __webpack_require__(63);\nvar BlockType = __webpack_require__(45);\nvar Cast = __webpack_require__(48);\nvar MathUtil = __webpack_require__(62);\nvar Clone = __webpack_require__(113);\nvar log = __webpack_require__(39);\n/**\n * Icon svg to be displayed in the blocks category menu, encoded as a data URI.\n * @type {string}\n */\n// eslint-disable-next-line max-len\nvar menuIconURI = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCA1Mi4yICg2NzE0NSkgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+CiA8dGl0bGU+RXh0ZW5zaW9ucy9Db25uZWN0aW9uL1dpZmk8L3RpdGxlPgogPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+CiA8ZGVmcz4KICA8cGF0aCBkPSJtMTQuMjU4ODcsOS44MjMyMWMwLjQ3MDIzLDAuNDM5MjEgMC40OTAyNCwxLjE2MDU1IDAuMDYwMDMsMS42MzA3N2MtMC4yMTkxLDAuMjQwMTIgLTAuNTMwMjUsMC4zNzAxOCAtMC44NDAzOSwwLjM3MDE4Yy0wLjI4MDEzLDAgLTAuNTYwMjcsLTAuMTEwMDUgLTAuNzgwMzcsLTAuMzExMTVjLTEuNDcwNjksLTEuMzY5NjQgLTMuOTIwODUsLTEuMzg5NjUgLTUuNDEyNTUsLTAuMDU5MDNjLTAuNDgwMjMsMC40MjAyIC0xLjIwMDU3LDAuMzgwMTggLTEuNjMwNzcsLTAuMTAwMDRjLTAuNDIwMiwtMC40NzAyMyAtMC4zNzkxOCwtMS4yMDA1NyAwLjEwMDA1LC0xLjYyMDc3YzEuMTYwNTUsLTEuMDMwNDggMi42NTEyNSwtMS42MDA3NSA0LjIwMTk4LC0xLjYwMDc1YzEuNjAwNzUsMCAzLjEzMTQ3LDAuNjAwMjggNC4zMDIwMiwxLjY5MDc5em0tMi4yMjA4NCw0LjU5MTk3YzAsMS4wNjE1IC0wLjg3MDQxLDEuOTMwOTEgLTEuOTMwOTEsMS45MzA5MWMtMS4wNzA1MSwwIC0xLjk0MDkyLC0wLjg2OTQxIC0xLjk0MDkyLC0xLjkzMDkxYzAsLTEuMDcwNTEgMC44NzA0MSwtMS45Mzk5MiAxLjk0MDkyLC0xLjkzOTkyYzEuMDYwNSwwIDEuOTMwOTEsMC44Njk0MSAxLjkzMDkxLDEuOTM5OTJ6bTUuNjEyMDQsLTguMzAzNzFjMC40NTEyMiwwLjQzOTIgMC40NzEyMiwxLjE2MDU0IDAuMDMwMDIsMS42MjA3NmMtMC4yMjkxMSwwLjI0MDExIC0wLjUzMDI1LDAuMzUwMTYgLTAuODI5MzksMC4zNTAxNmMtMC4yOTExNCwwIC0wLjU4MDI4LC0wLjEwMDA0IC0wLjgwMTM4LC0wLjMyMTE1Yy0xLjYzOTc3LC0xLjU3OTc0IC0zLjgxMDgsLTIuNDYxMTYgLTYuMDkxODcsLTIuNDYxMTZjLTIuMjUxMDYsMCAtNC4zODIwNywwLjg1MTQgLTYuMDIyODQsMi4zOTIxM2MtMC40NjEyMiwwLjQzMDIgLTEuMTkwNTYsMC40MTAxOSAtMS42MjE3NiwtMC4wNTAwMmMtMC40NDAyMSwtMC40NjAyMiAtMC40MDkyLC0xLjE5MDU2IDAuMDUxMDIsLTEuNjMxNzdjMi4wNTk5NywtMS45Mzk5MiA0Ljc2MTI0LC0zLjAxMDQyIDcuNTkzNTgsLTMuMDEwNDJjMi44ODAzNiwwIDUuNjExNjQsMS4xMTA1MiA3LjY5MjYyLDMuMTExNDd6IiBpZD0icGF0aC0xIi8+CiA8L2RlZnM+CiA8Zz4KICA8dGl0bGU+YmFja2dyb3VuZDwvdGl0bGU+CiAgPHJlY3QgeD0iLTEiIHk9Ii0xIiB3aWR0aD0iNDIiIGhlaWdodD0iNDIiIGlkPSJjYW52YXNfYmFja2dyb3VuZCIgZmlsbD0ibm9uZSIvPgogPC9nPgogPGc+CiAgPHRpdGxlPkxheWVyIDE8L3RpdGxlPgogIDxnIGlkPSJFeHRlbnNpb25zL0Nvbm5lY3Rpb24vV2lmaSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgPG1hc2sgaWQ9Im1hc2stMiI+CiAgICA8dXNlIHhsaW5rOmhyZWY9IiNwYXRoLTEiIGlkPSJzdmdfMSIvPgogICA8L21hc2s+CiAgIDx1c2UgaWQ9IndpZmkiIGZpbGw9IiM0Qzk3RkYiIHhsaW5rOmhyZWY9IiNwYXRoLTEiIHk9IjEuNSIgeD0iMS43NSIvPgogICA8ZyBpZD0iQ29sb3IvMV9CbHVlIiBtYXNrPSJ1cmwoI21hc2stMikiIGZpbGw9IiM1NzVFNzUiPgogICAgPGcgaWQ9IkNvbG9yL0dyYXkiPgogICAgIDxnIGlkPSJDb2xvciI+CiAgICAgIDxyZWN0IHg9IjEuNzUiIHk9IjEuNSIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBpZD0ic3ZnXzIiLz4KICAgICA8L2c+CiAgICA8L2c+CiAgIDwvZz4KICA8L2c+CiAgPHJlY3QgZmlsbD0iI2ZmMDAwMCIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjEuNSIgeD0iMTguODc1IiB5PSIxMi41IiB3aWR0aD0iOS41IiBoZWlnaHQ9IjE1LjUiIGlkPSJzdmdfNCIgdHJhbnNmb3JtPSJyb3RhdGUoMzUgMjMuNjI0OTk5OTk5OTk5OTksMjAuMjUwMDAwMDAwMDAwMDA3KSAiLz4KICA8cmVjdCBmaWxsPSIjMDA3ZjAwIiBzdHJva2Utd2lkdGg9IjEuNSIgeD0iMi40MTQyMSIgeT0iMjIuNSIgd2lkdGg9IjM0LjcxOTc0NyIgaGVpZ2h0PSIxMi41IiBpZD0ic3ZnXzMiIHJ4PSIyIiBzdHJva2U9IiMwMDAiLz4KICA8bGluZSBzdHJva2U9IiMwMDAiIHN0cm9rZS1saW5lY2FwPSJ1bmRlZmluZWQiIHN0cm9rZS1saW5lam9pbj0idW5kZWZpbmVkIiBpZD0ic3ZnXzUiIHkyPSIzMS4xNjY2NDEiIHgyPSIxNS43NjYwNjQiIHkxPSIzMS4xNjY2NDEiIHgxPSIzLjA4MzM3MiIgc3Ryb2tlLXdpZHRoPSIxLjUiIGZpbGw9Im5vbmUiLz4KICA8bGluZSBzdHJva2U9IiMwMDAiIHN0cm9rZS1saW5lY2FwPSJ1bmRlZmluZWQiIHN0cm9rZS1saW5lam9pbj0idW5kZWZpbmVkIiBpZD0ic3ZnXzYiIHkyPSIzMC44MzMzMDkiIHgyPSIzNi43NDk5NjIiIHkxPSIzMC44MzMzMDkiIHgxPSIyMy4wODMzMjYiIHN0cm9rZS13aWR0aD0iMS41IiBmaWxsPSJub25lIi8+CiAgPGxpbmUgdHJhbnNmb3JtPSJyb3RhdGUoNCAyMS41ODMzMzAxNTQ0MTg5MTMsMzAuMTY2NjQzMTQyNzAwMTk1KSAiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLWxpbmVjYXA9InVuZGVmaW5lZCIgc3Ryb2tlLWxpbmVqb2luPSJ1bmRlZmluZWQiIGlkPSJzdmdfNyIgeTI9IjI4LjY2NjY0OCIgeDI9IjI3LjkxNjY0OSIgeTE9IjMxLjY2NjY0IiB4MT0iMTUuMjUwMDExIiBzdHJva2Utb3BhY2l0eT0ibnVsbCIgc3Ryb2tlLXdpZHRoPSIxLjUiIGZpbGw9Im5vbmUiLz4KIDwvZz4KPC9zdmc+';\n/**\n * Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.\n * @type {string}\n */\n// eslint-disable-next-line max-len\nvar blockIconURI = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCA1Mi4yICg2NzE0NSkgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+CiA8dGl0bGU+RXh0ZW5zaW9ucy9Db25uZWN0aW9uL1dpZmk8L3RpdGxlPgogPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+CiA8ZGVmcz4KICA8cGF0aCBkPSJtMTQuMjU4ODcsOS44MjMyMWMwLjQ3MDIzLDAuNDM5MjEgMC40OTAyNCwxLjE2MDU1IDAuMDYwMDMsMS42MzA3N2MtMC4yMTkxLDAuMjQwMTIgLTAuNTMwMjUsMC4zNzAxOCAtMC44NDAzOSwwLjM3MDE4Yy0wLjI4MDEzLDAgLTAuNTYwMjcsLTAuMTEwMDUgLTAuNzgwMzcsLTAuMzExMTVjLTEuNDcwNjksLTEuMzY5NjQgLTMuOTIwODUsLTEuMzg5NjUgLTUuNDEyNTUsLTAuMDU5MDNjLTAuNDgwMjMsMC40MjAyIC0xLjIwMDU3LDAuMzgwMTggLTEuNjMwNzcsLTAuMTAwMDRjLTAuNDIwMiwtMC40NzAyMyAtMC4zNzkxOCwtMS4yMDA1NyAwLjEwMDA1LC0xLjYyMDc3YzEuMTYwNTUsLTEuMDMwNDggMi42NTEyNSwtMS42MDA3NSA0LjIwMTk4LC0xLjYwMDc1YzEuNjAwNzUsMCAzLjEzMTQ3LDAuNjAwMjggNC4zMDIwMiwxLjY5MDc5em0tMi4yMjA4NCw0LjU5MTk3YzAsMS4wNjE1IC0wLjg3MDQxLDEuOTMwOTEgLTEuOTMwOTEsMS45MzA5MWMtMS4wNzA1MSwwIC0xLjk0MDkyLC0wLjg2OTQxIC0xLjk0MDkyLC0xLjkzMDkxYzAsLTEuMDcwNTEgMC44NzA0MSwtMS45Mzk5MiAxLjk0MDkyLC0xLjkzOTkyYzEuMDYwNSwwIDEuOTMwOTEsMC44Njk0MSAxLjkzMDkxLDEuOTM5OTJ6bTUuNjEyMDQsLTguMzAzNzFjMC40NTEyMiwwLjQzOTIgMC40NzEyMiwxLjE2MDU0IDAuMDMwMDIsMS42MjA3NmMtMC4yMjkxMSwwLjI0MDExIC0wLjUzMDI1LDAuMzUwMTYgLTAuODI5MzksMC4zNTAxNmMtMC4yOTExNCwwIC0wLjU4MDI4LC0wLjEwMDA0IC0wLjgwMTM4LC0wLjMyMTE1Yy0xLjYzOTc3LC0xLjU3OTc0IC0zLjgxMDgsLTIuNDYxMTYgLTYuMDkxODcsLTIuNDYxMTZjLTIuMjUxMDYsMCAtNC4zODIwNywwLjg1MTQgLTYuMDIyODQsMi4zOTIxM2MtMC40NjEyMiwwLjQzMDIgLTEuMTkwNTYsMC40MTAxOSAtMS42MjE3NiwtMC4wNTAwMmMtMC40NDAyMSwtMC40NjAyMiAtMC40MDkyLC0xLjE5MDU2IDAuMDUxMDIsLTEuNjMxNzdjMi4wNTk5NywtMS45Mzk5MiA0Ljc2MTI0LC0zLjAxMDQyIDcuNTkzNTgsLTMuMDEwNDJjMi44ODAzNiwwIDUuNjExNjQsMS4xMTA1MiA3LjY5MjYyLDMuMTExNDd6IiBpZD0icGF0aC0xIi8+CiA8L2RlZnM+CiA8Zz4KICA8dGl0bGU+YmFja2dyb3VuZDwvdGl0bGU+CiAgPHJlY3QgeD0iLTEiIHk9Ii0xIiB3aWR0aD0iNDIiIGhlaWdodD0iNDIiIGlkPSJjYW52YXNfYmFja2dyb3VuZCIgZmlsbD0ibm9uZSIvPgogPC9nPgogPGc+CiAgPHRpdGxlPkxheWVyIDE8L3RpdGxlPgogIDxnIGlkPSJFeHRlbnNpb25zL0Nvbm5lY3Rpb24vV2lmaSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgPG1hc2sgaWQ9Im1hc2stMiI+CiAgICA8dXNlIHhsaW5rOmhyZWY9IiNwYXRoLTEiIGlkPSJzdmdfMSIvPgogICA8L21hc2s+CiAgIDx1c2UgaWQ9IndpZmkiIGZpbGw9IiM0Qzk3RkYiIHhsaW5rOmhyZWY9IiNwYXRoLTEiIHk9IjEuNSIgeD0iMS43NSIvPgogICA8ZyBpZD0iQ29sb3IvMV9CbHVlIiBtYXNrPSJ1cmwoI21hc2stMikiIGZpbGw9IiM1NzVFNzUiPgogICAgPGcgaWQ9IkNvbG9yL0dyYXkiPgogICAgIDxnIGlkPSJDb2xvciI+CiAgICAgIDxyZWN0IHg9IjEuNzUiIHk9IjEuNSIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBpZD0ic3ZnXzIiLz4KICAgICA8L2c+CiAgICA8L2c+CiAgIDwvZz4KICA8L2c+CiAgPHJlY3QgZmlsbD0iI2ZmMDAwMCIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjEuNSIgeD0iMTguODc1IiB5PSIxMi41IiB3aWR0aD0iOS41IiBoZWlnaHQ9IjE1LjUiIGlkPSJzdmdfNCIgdHJhbnNmb3JtPSJyb3RhdGUoMzUgMjMuNjI0OTk5OTk5OTk5OTksMjAuMjUwMDAwMDAwMDAwMDA3KSAiLz4KICA8cmVjdCBmaWxsPSIjMDA3ZjAwIiBzdHJva2Utd2lkdGg9IjEuNSIgeD0iMi40MTQyMSIgeT0iMjIuNSIgd2lkdGg9IjM0LjcxOTc0NyIgaGVpZ2h0PSIxMi41IiBpZD0ic3ZnXzMiIHJ4PSIyIiBzdHJva2U9IiMwMDAiLz4KICA8bGluZSBzdHJva2U9IiMwMDAiIHN0cm9rZS1saW5lY2FwPSJ1bmRlZmluZWQiIHN0cm9rZS1saW5lam9pbj0idW5kZWZpbmVkIiBpZD0ic3ZnXzUiIHkyPSIzMS4xNjY2NDEiIHgyPSIxNS43NjYwNjQiIHkxPSIzMS4xNjY2NDEiIHgxPSIzLjA4MzM3MiIgc3Ryb2tlLXdpZHRoPSIxLjUiIGZpbGw9Im5vbmUiLz4KICA8bGluZSBzdHJva2U9IiMwMDAiIHN0cm9rZS1saW5lY2FwPSJ1bmRlZmluZWQiIHN0cm9rZS1saW5lam9pbj0idW5kZWZpbmVkIiBpZD0ic3ZnXzYiIHkyPSIzMC44MzMzMDkiIHgyPSIzNi43NDk5NjIiIHkxPSIzMC44MzMzMDkiIHgxPSIyMy4wODMzMjYiIHN0cm9rZS13aWR0aD0iMS41IiBmaWxsPSJub25lIi8+CiAgPGxpbmUgdHJhbnNmb3JtPSJyb3RhdGUoNCAyMS41ODMzMzAxNTQ0MTg5MTMsMzAuMTY2NjQzMTQyNzAwMTk1KSAiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLWxpbmVjYXA9InVuZGVmaW5lZCIgc3Ryb2tlLWxpbmVqb2luPSJ1bmRlZmluZWQiIGlkPSJzdmdfNyIgeTI9IjI4LjY2NjY0OCIgeDI9IjI3LjkxNjY0OSIgeTE9IjMxLjY2NjY0IiB4MT0iMTUuMjUwMDExIiBzdHJva2Utb3BhY2l0eT0ibnVsbCIgc3Ryb2tlLXdpZHRoPSIxLjUiIGZpbGw9Im5vbmUiLz4KIDwvZz4KPC9zdmc+';\n\n/**\n * 超时设定\n * @type {int}\n */\nvar SERVER_TIMEOUT = 10000; // 10 seconds\n/**\n * 设备ID\n * @type {number}\n */\nvar DEVICEID = [];\n\n\n/**\n * 红外载波频率\n * @type {number}\n */\nvar DEVICESTATUS = {};\n\n\n\n/**\n * 接收到的数据\n * @type {STRING}\n */\nvar STATUS = {开:1,关:0};\n\n/**\n * Class for the IOTSWITCH blocks.\n * @constructor\n */\nvar Scratch3IOTSWITCHBlocks = function () {\n  function Scratch3IOTSWITCHBlocks(runtime) {\n    _classCallCheck(this, Scratch3IOTSWITCHBlocks);\n    /**\n     * The runtime instantiating this block package.\n     * @type {Runtime}\n     */\n    this.runtime = runtime;\n    /**\n     * Map of soundPlayers by sound id.\n     * @type {Map<string, SoundPlayer>}\n     */\n    //this._soundPlayers = new Map();\n //   this._stopAllSpeech = this._stopAllSpeech.bind(this);\n //   if (this.runtime) {\n //     this.runtime.on('PROJECT_STOP_ALL', this._stopAllSpeech);\n //   }\n    this._onTargetCreated = this._onTargetCreated.bind(this);\n    if (this.runtime) {\n      runtime.on('targetWasCreated', this._onTargetCreated);\n    }\n  }\n  /**\n   * An object with info for each voice.\n   */\n  _createClass(Scratch3IOTSWITCHBlocks, [{\n    key: \"_getState\",\n    /**\n     * @param {Target} target - collect  state for this target.\n     * @returns {IOTSWITCHState} the mutable state associated with that target. This will be created if necessary.\n     * @private\n     */\n    value: function _getState(target) {\n      var state = target.getCustomState(Scratch3IOTSWITCHBlocks.STATE_KEY);\n      if (!state) {\n        state = Clone.simple(Scratch3IOTSWITCHBlocks.DEFAULT_IOTSWITCH_STATE);\n        target.setCustomState(Scratch3IOTSWITCHBlocks.STATE_KEY, state);\n      }\n      return state;\n    }\n    /**\n     * When a Target is cloned, clone the state.\n     * @param {Target} newTarget - the newly created target.\n     * @param {Target} [sourceTarget] - the target used as a source for the new clone, if any.\n     * @listens Runtime#event:targetWasCreated\n     * @private\n     */\n  }, {\n    key: \"_onTargetCreated\",\n    value: function _onTargetCreated(newTarget, sourceTarget) {\n      if (sourceTarget) {\n        var state = sourceTarget.getCustomState(Scratch3IOTSWITCHBlocks.STATE_KEY);\n        if (state) {\n          newTarget.setCustomState(Scratch3IOTSWITCHBlocks.STATE_KEY, Clone.simple(state));\n        }\n      }\n    }\n    /**\n     * @returns {object} metadata for this extension and its blocks.\n     */\n  }, {\n    key: \"getInfo\",\n    value: function getInfo() {\n      // Only localize the default input to the \"speak\" block if we are in a\n      // supported language.\n      var defaultTextToSpeak = 'hello';\n      return {\n        id: 'IOTSWITCH',\n        name: formatMessage({\n          id: 'IOTSWITCH.categoryName',\n          default: '网络开关',\n          description: 'Name of the Text to Speech extension.'\n        }),\n        blockIconURI: blockIconURI,\n        menuIconURI: menuIconURI,\n        blocks: [{\n          opcode: 'setSwitch',\n          text: formatMessage({\n            id: 'IOTSWITCH.setSwitch',\n            default: '使设备[DEVICE][STATUS]',\n            description: 'Set the device on/off'\n          }),\n          blockType: BlockType.COMMAND,\n          arguments: {\n            DEVICE: {\n              type: ArgumentType.STRING,\n              menu: 'device',\n              defaultValue: '请选择设备'\n            },\n            STATUS: {\n              type: ArgumentType.STRING,\n              menu: 'status',\n              defaultValue: '开'\n            }\n          }\n        },{\n          opcode: 'getSwitches',\n          text: formatMessage({\n            id: 'IOTSWITCH.getSwitches',\n            default: '获取所有设备',\n            description: 'get the status of the device'\n          }),\n          blockType: BlockType.COMMAND\n        },{\n          opcode: 'getSwitchStatus',\n          text: formatMessage({\n            id: 'IOTSWITCH.getSwitchStatus',\n            default: '获取设备[DEVICE]状态',\n            description: 'get the status of the device'\n          }),\n          blockType: BlockType.COMMAND,\n          arguments: {\n            DEVICE: {\n              type: ArgumentType.STRING,\n              menu: 'device',\n              defaultValue: '请选择设备'\n            }\n          }\n        },{\n          opcode: 'getSwitch',\n          text: formatMessage({\n            id: 'IOTSWITCH.getSwitch',\n            default: '设备[DEVICE]的状态',\n            description: 'Get the status of the device.'\n          }),\n          blockType: BlockType.REPORTER,\n          forcedEnableMonitor:true,          //使用forcedEnableMonitor可以强制打开CheckBox。此开关项需要修改GUI模块450的“_convertBlockForScratchBlocks”定义。\n                                             //原生代码中，使用disableMonitor:false;和参数个数来控制CheckBox的显示\n          arguments: {\n            DEVICE: {\n              type: ArgumentType.STRING,\n              menu: 'device',\n              defaultValue: '请选择设备'\n            }\n          }\n        }],\n        menus: {\n          device: {\n            acceptReporters:true,\n            items: this.getDeviceMenu()\n          },\n          status: {\n            acceptReporters:true,\n            items: ['开', '关']\n          }\n        }\n      };\n    }\n    /**\n     * 当收到数据时，激发此积木\n     * 接收到的数据保存在RAWDATA中\n     */\n  }, {\n    key: \"setSwitch\",\n    value: function setSwitch(args, util) {\n      var _this4 = this;\n      var device = Cast.toString(args.DEVICE);\n      var status = Cast.toString(args.STATUS);\n      var ip = (DEVICESTATUS[device]==undefined || DEVICESTATUS[device]=='')?'':DEVICESTATUS[device].IP;\n      if(ip=='' || ip==undefined) return \"设备配置数据有误，请重新加载本扩展。\";\n      var path = \"./extension/switch/device.php\";\n      path += \"?D=\"+device;\n      path += \"&S=\"+((status==\"开\")?1:0);\n      path += \"&IP=\"+ip;\n      return new Promise(function (resolve) {\n        nets({\n          url: path,\n          timeout: SERVER_TIMEOUT\n        }, function (err, res, body) {\n          if (err) {\n            log.warn(err);\n            return resolve();\n          }\n          if (res.statusCode !== 200) {\n            log.warn(res.statusCode);\n            return resolve();\n          } // Play the sound\n          var sound = {\n            data: {\n              buffer: body.buffer\n            }\n          };\n          return resolve();\n        });\n      });\n    }\n  }, {\n    key: \"getSwitches\",\n    value: function getSwitches(args, util) {\n      var _this4 = this;\n      var device = Cast.toString(args.DEVICE);\n      var path = \"./extension/switch/device.php\";\n      path += \"?D=\"+device;\n      //更新设备列表\n      return new Promise(function (resolve) {\n        nets({\n          url: path,\n          timeout: SERVER_TIMEOUT,\n          json:true                       //结果自动转成JSON格式。\n        }, function (err, res, body) {\n          if (err) {\n            log.warn(err);\n            return resolve();\n          }\n          if (res.statusCode !== 200) {\n            log.warn(res.statusCode);\n            return resolve();\n          } // Play the sound\n          \n          if(body.ERROR!=undefined) {return resolve();}\n          DEVICESTATUS=body;//jsonData;\n          DEVICEID.length=0;\n          for(var i=0;i<Object.keys(DEVICESTATUS).length;i++)\n          {\n             DEVICEID.push(Object.keys(DEVICESTATUS)[i]);//\n          }\n\n          //更新设备列表\n          var oEM=oGUI.props.vm.extensionManager.runtime._blockInfo.find(function(info){return info.id===\"IOTSWITCH\";});\n          if(oEM!=undefined)//nExtID!=-1)\n          {\n             var oMenu=oEM.menus.find(function(menu){ return menu.json.args0[0].name===\"device\"; });\n             if(oMenu!=undefined){                                                //更新菜单数据\n                oMenu.json.args0[0].options.length=0;\n                for(var j=0;j<DEVICEID.length;j++){\n                   oMenu.json.args0[0].options.push([DEVICEID[j],DEVICEID[j]]);\n                }\n                oGUI.props.vm.runtime.emit(\"BLOCKSINFO_UPDATE\", oEM);  //发送扩展已添加消息，欺骗系统更新数据。\n                //BLOCKSINFO_UPDATE比EXTENSION_ADDED更贴切，但实际上，BLOCKSINFO_UPDATE还是调用了EXTENSION_ADDED。\n             }\n          }\n          return resolve();\n        });\n      });\n    }\n  }, {\n    key: \"getSwitchStatus\",\n    value: function getSwitchStatus(args, util) {\n      var _this4 = this;\n      var device = Cast.toString(args.DEVICE);\n      var path = \"./extension/switch/device.php\";\n      path += \"?D=\"+device;\n      return new Promise(function (resolve) {\n        nets({\n          url: path,\n          timeout: SERVER_TIMEOUT\n        }, function (err, res, body) {\n          if (err) {\n            log.warn(err);\n            return resolve();\n          }\n          if (res.statusCode !== 200) {\n            log.warn(res.statusCode);\n            return resolve();\n          } // Play the sound\n          if(body.ERROR!=undefined) {return resolve();}\n          DEVICESTATUS[device]=body.toString();\n          return resolve();\n        });\n      });\n    }\n  }, {\n    key: \"getDeviceMenu\",\n    value: function getDeviceMenu() {\n      var _this3 = this;\n\n      var path = \"./extension/switch/device.php?\";\n      //path += \"?D=\"+device;\n      //path += \"?S=\"+status;\n      DEVICEID.length=0;\n\n        nets({\n          url: path,\n          timeout: SERVER_TIMEOUT,\n          sync:true,                          //使用同步阻塞方式获取数据\n          json:true                           //将返回数据转为JSON格式\n        }, function (err, res, body) {\n          if (err) {\n            log.warn(err);\n            //return resolve();\n          }\n          if (res.statusCode !== 200) {\n            log.warn(res.statusCode);\n            //return resolve();\n          } // Play the sound\n          //var jsonData=body;//JSON.parse(body.toString());\n          DEVICESTATUS=body;//jsonData;\n          DEVICEID.length=0;\n          for(var i=0;i<Object.keys(DEVICESTATUS).length;i++)\n          {\n             DEVICEID.push(Object.keys(DEVICESTATUS)[i]);\n          }\n          //return resolve();\n        });\n      /*\n      $.ajaxSetup({\n         async: false\n      });\n      $.ajax(\n      {\n         url:  path + \"&t=\" + Math.random(), \n         type: 'GET',\n         data: {},\n         success: function (data)//获取文件URL\n         {\n            var jsonData=JSON.parse(data);\n            DEVICESTATUS=jsonData;\n            DEVICEID.length=0;\n            for(var i=0;i<Object.keys(DEVICESTATUS).length;i++)\n            {\n               DEVICEID.push(Object.keys(DEVICESTATUS)[i]);\n            }\n         }//,\n         //error: function(xhr, textStatus, errorThrown){\n            //return [{text:'暂无设备',value:''}];\n         //}\n      });\n      */\n      if(DEVICEID.length>0){\n         return Object.keys(DEVICESTATUS).map(function (key) {\n            var value =  DEVICESTATUS[key].CHIPID;\n            return {\n               text: key,\n               value: value\n            };\n         });\n      }\n      else return [{text:'暂无设备',value:''}];\n    }\n  }, {\n    key: \"getSwitch\",\n    value: function getSwitch(args, util) {\n      var _this4 = this;\n      var device = Cast.toString(args.DEVICE);\n      if(DEVICESTATUS[device]!=undefined && DEVICESTATUS[device]!='' && DEVICESTATUS[device].STATUS!=undefined) return DEVICESTATUS[device].STATUS.toString()==\"1\"?true:false;\n      else return '访问硬件设备操作异常，请重新加载本扩展。';\n    }\n  }], [{\n    key: \"STATE_KEY\",\n    get: function get() {\n      return 'Scratch.IOTSWITCH';\n    }\n    /**\n     * The default state, to be used when a target has no existing state.\n     * @type {IOTSWITCHState}\n     */\n  }, {\n    key: \"DEFAULT_IOTSWITCH_STATE\",\n    get: function get() {\n      return {\n        voiceId: ALTO_ID\n      };\n    }\n  }]);\n  return Scratch3IOTSWITCHBlocks;\n}();\nmodule.exports = Scratch3IOTSWITCHBlocks;\n })