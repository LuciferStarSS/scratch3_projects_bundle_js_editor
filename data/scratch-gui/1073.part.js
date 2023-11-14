/* 1073 */\n (function(module, exports, __webpack_require__) {\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\nvar Runtime = __webpack_require__(450);\nvar ArgumentType = __webpack_require__(63);\nvar BlockType = __webpack_require__(45);\nvar Clone = __webpack_require__(113);\nvar Cast = __webpack_require__(48);\nvar formatMessage = __webpack_require__(71);\nvar Video = __webpack_require__(452);\nvar VideoMotion = __webpack_require__(1094);\n/**\n * Icon svg to be displayed in the blocks category menu, encoded as a data URI.\n * @type {string}\n */\n// eslint-disable-next-line max-len\nvar menuIconURI = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMjBweCIgaGVpZ2h0PSIyMHB4IiB2aWV3Qm94PSIwIDAgMjAgMjAiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDUyLjIgKDY3MTQ1KSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDx0aXRsZT5FeHRlbnNpb25zL1NvZnR3YXJlL1ZpZGVvLVNlbnNpbmctTWVudTwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxnIGlkPSJFeHRlbnNpb25zL1NvZnR3YXJlL1ZpZGVvLVNlbnNpbmctTWVudSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9InZpZGVvLW1vdGlvbiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMC4wMDAwMDAsIDUuMDAwMDAwKSIgZmlsbC1ydWxlPSJub256ZXJvIj4KICAgICAgICAgICAgPGNpcmNsZSBpZD0iT3ZhbC1Db3B5IiBmaWxsPSIjMEVCRDhDIiBvcGFjaXR5PSIwLjI1IiBjeD0iMTYiIGN5PSI4IiByPSIyIj48L2NpcmNsZT4KICAgICAgICAgICAgPGNpcmNsZSBpZD0iT3ZhbC1Db3B5IiBmaWxsPSIjMEVCRDhDIiBvcGFjaXR5PSIwLjUiIGN4PSIxNiIgY3k9IjYiIHI9IjIiPjwvY2lyY2xlPgogICAgICAgICAgICA8Y2lyY2xlIGlkPSJPdmFsLUNvcHkiIGZpbGw9IiMwRUJEOEMiIG9wYWNpdHk9IjAuNzUiIGN4PSIxNiIgY3k9IjQiIHI9IjIiPjwvY2lyY2xlPgogICAgICAgICAgICA8Y2lyY2xlIGlkPSJPdmFsIiBmaWxsPSIjMEVCRDhDIiBjeD0iMTYiIGN5PSIyIiByPSIyIj48L2NpcmNsZT4KICAgICAgICAgICAgPHBhdGggZD0iTTExLjMzNTk3MzksMi4yMDk3ODgyNSBMOC4yNSw0LjIwOTk1NjQ5IEw4LjI1LDMuMDUgQzguMjUsMi4wNDQ4ODIyNyA3LjQ2ODU5MDMxLDEuMjUgNi41LDEuMjUgTDIuMDUsMS4yNSBDMS4wMzgwNzExOSwxLjI1IDAuMjUsMi4wMzgwNzExOSAwLjI1LDMuMDUgTDAuMjUsNyBDMC4yNSw3Ljk2MzY5OTM3IDEuMDQyMjQ5MTksOC43NTU5NDg1NiAyLjA1LDguOCBMNi41LDguOCBDNy40NTA4MzAwOSw4LjggOC4yNSw3Ljk3MzI3MjUgOC4yNSw3IEw4LjI1LDUuODU4NDUyNDEgTDguNjI4NjIzOTQsNi4wODU2MjY3NyBMMTEuNDI2Nzc2Nyw3Ljc3MzIyMzMgQzExLjQzNjg5NDMsNy43ODMzNDA5MSAxMS40NzU3NjU1LDcuOCAxMS41LDcuOCBDMTEuNjMzNDkzMiw3LjggMTEuNzUsNy42OTEyNjAzNCAxMS43NSw3LjU1IEwxMS43NSwyLjQgQzExLjc1LDIuNDE4MzgyNjkgMTEuNzIxOTAyOSwyLjM1MjgyMjgyIDExLjY4NTYyNjgsMi4yNzg2MjM5NCBDMTEuNjEyOTUyOCwyLjE1NzUwMDY5IDExLjQ3MDc5NjgsMi4xMjkwNjk1IDExLjMzNTk3MzksMi4yMDk3ODgyNSBaIiBpZD0idmlkZW9fMzdfIiBzdHJva2Utb3BhY2l0eT0iMC4xNSIgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2Utd2lkdGg9IjAuNSIgZmlsbD0iIzRENEQ0RCI+PC9wYXRoPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+';\n/**\n * Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.\n * @type {string}\n */\n// eslint-disable-next-line max-len\nvar blockIconURI = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iNDBweCIgaGVpZ2h0PSI0MHB4IiB2aWV3Qm94PSIwIDAgNDAgNDAiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDUyLjIgKDY3MTQ1KSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDx0aXRsZT5FeHRlbnNpb25zL1NvZnR3YXJlL1ZpZGVvLVNlbnNpbmctQmxvY2s8L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+CiAgICA8ZyBpZD0iRXh0ZW5zaW9ucy9Tb2Z0d2FyZS9WaWRlby1TZW5zaW5nLUJsb2NrIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBzdHJva2Utb3BhY2l0eT0iMC4xNSI+CiAgICAgICAgPGcgaWQ9InZpZGVvLW1vdGlvbiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMC4wMDAwMDAsIDEwLjAwMDAwMCkiIGZpbGwtcnVsZT0ibm9uemVybyIgc3Ryb2tlPSIjMDAwMDAwIj4KICAgICAgICAgICAgPGNpcmNsZSBpZD0iT3ZhbC1Db3B5IiBmaWxsPSIjRkZGRkZGIiBvcGFjaXR5PSIwLjI1IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGN4PSIzMiIgY3k9IjE2IiByPSI0LjUiPjwvY2lyY2xlPgogICAgICAgICAgICA8Y2lyY2xlIGlkPSJPdmFsLUNvcHkiIGZpbGw9IiNGRkZGRkYiIG9wYWNpdHk9IjAuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjeD0iMzIiIGN5PSIxMiIgcj0iNC41Ij48L2NpcmNsZT4KICAgICAgICAgICAgPGNpcmNsZSBpZD0iT3ZhbC1Db3B5IiBmaWxsPSIjRkZGRkZGIiBvcGFjaXR5PSIwLjc1IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGN4PSIzMiIgY3k9IjgiIHI9IjQuNSI+PC9jaXJjbGU+CiAgICAgICAgICAgIDxjaXJjbGUgaWQ9Ik92YWwiIGZpbGw9IiNGRkZGRkYiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgY3g9IjMyIiBjeT0iNCIgcj0iNC41Ij48L2NpcmNsZT4KICAgICAgICAgICAgPHBhdGggZD0iTTIyLjY3MTk0NzcsNC40MTk1NzY0OSBMMTYuNSw4LjQxOTkxMjk4IEwxNi41LDYuMSBDMTYuNSw0LjA4OTc2NDU0IDE0LjkzNzE4MDYsMi41IDEzLDIuNSBMNC4xLDIuNSBDMi4wNzYxNDIzNywyLjUgMC41LDQuMDc2MTQyMzcgMC41LDYuMSBMMC41LDE0IEMwLjUsMTUuOTI3Mzk4NyAyLjA4NDQ5ODM5LDE3LjUxMTg5NzEgNC4xLDE3LjYgTDEzLDE3LjYgQzE0LjkwMTY2MDIsMTcuNiAxNi41LDE1Ljk0NjU0NSAxNi41LDE0IEwxNi41LDExLjcxNjkwNDggTDIyLjc1NzI0NzksMTUuNDcxMjUzNSBMMjIuODUzNTUzNCwxNS41NDY0NDY2IEMyMi44NzM3ODg2LDE1LjU2NjY4MTggMjIuOTUxNTMxLDE1LjYgMjMsMTUuNiBDMjMuMjY2OTg2NSwxNS42IDIzLjUsMTUuMzgyNTIwNyAyMy41LDE1LjEgTDIzLjUsNC44IEMyMy41LDQuODM2NzY1MzggMjMuNDQzODA1OCw0LjcwNTY0NTYzIDIzLjM3MTI1MzUsNC41NTcyNDc4OCBDMjMuMjI1OTA1Niw0LjMxNTAwMTM5IDIyLjk0MTU5MzcsNC4yNTgxMzg5OSAyMi42NzE5NDc3LDQuNDE5NTc2NDkgWiIgaWQ9InZpZGVvXzM3XyIgZmlsbD0iIzRENEQ0RCI+PC9wYXRoPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+';\n/**\n * Sensor attribute video sensor block should report.\n * @readonly\n * @enum {string}\n */\nvar SensingAttribute = {\n  /** The amount of motion. */\n  MOTION: 'motion',\n  /** The direction of the motion. */\n  DIRECTION: 'direction'\n};\n/**\n * Subject video sensor block should report for.\n * @readonly\n * @enum {string}\n */\nvar SensingSubject = {\n  /** The sensor traits of the whole stage. */\n  STAGE: 'Stage',\n  /** The senosr traits of the area overlapped by this sprite. */\n  SPRITE: 'this sprite'\n};\n/**\n * States the video sensing activity can be set to.\n * @readonly\n * @enum {string}\n */\nvar VideoState = {\n  /** Video turned off. */\n  OFF: 'off',\n  /** Video turned on with default y axis mirroring. */\n  ON: 'on',\n  /** Video turned on without default y axis mirroring. */\n  ON_FLIPPED: 'on-flipped'\n};\n/**\n * Class for the motion-related blocks in Scratch 3.0\n * @param {Runtime} runtime - the runtime instantiating this block package.\n * @constructor\n */\nvar Scratch3VideoSensingBlocks = function () {\n  function Scratch3VideoSensingBlocks(runtime) {\n    _classCallCheck(this, Scratch3VideoSensingBlocks);\n    /**\n     * The runtime instantiating this block package.\n     * @type {Runtime}\n     */\n    this.runtime = runtime;\n    /**\n     * The motion detection algoritm used to power the motion amount and\n     * direction values.\n     * @type {VideoMotion}\n     */\n    this.detect = new VideoMotion();\n    /**\n     * The last millisecond epoch timestamp that the video stream was\n     * analyzed.\n     * @type {number}\n     */\n    this._lastUpdate = null;\n    /**\n     * A flag to determine if this extension has been installed in a project.\n     * It is set to false the first time getInfo is run.\n     * @type {boolean}\n     */\n    this.firstInstall = true;\n    if (this.runtime.ioDevices) {\n      // Configure the video device with values from globally stored locations.\n      this.runtime.on(Runtime.PROJECT_LOADED, this.updateVideoDisplay.bind(this)); // Clear target motion state values when the project starts.\n      this.runtime.on(Runtime.PROJECT_RUN_START, this.reset.bind(this)); // Kick off looping the analysis logic.\n      this._loop();\n    }\n  }\n  /**\n   * After analyzing a frame the amount of milliseconds until another frame\n   * is analyzed.\n   * @type {number}\n   */\n  _createClass(Scratch3VideoSensingBlocks, [{\n    key: \"updateVideoDisplay\",\n    /**\n     * Get the latest values for video transparency and state,\n     * and set the video device to use them.\n     */\n    value: function updateVideoDisplay() {\n      this.setVideoTransparency({\n        TRANSPARENCY: this.globalVideoTransparency\n      });\n      this.videoToggle({\n        VIDEO_STATE: this.globalVideoState\n      });\n    }\n    /**\n     * Reset the extension's data motion detection data. This will clear out\n     * for example old frames, so the first analyzed frame will not be compared\n     * against a frame from before reset was called.\n     */\n  }, {\n    key: \"reset\",\n    value: function reset() {\n      this.detect.reset();\n      var targets = this.runtime.targets;\n      for (var i = 0; i < targets.length; i++) {\n        var state = targets[i].getCustomState(Scratch3VideoSensingBlocks.STATE_KEY);\n        if (state) {\n          state.motionAmount = 0;\n          state.motionDirection = 0;\n        }\n      }\n    }\n    /**\n     * Occasionally step a loop to sample the video, stamp it to the preview\n     * skin, and add a TypedArray copy of the canvas's pixel data.\n     * @private\n     */\n  }, {\n    key: \"_loop\",\n    value: function _loop() {\n      setTimeout(this._loop.bind(this), Math.max(this.runtime.currentStepTime, Scratch3VideoSensingBlocks.INTERVAL)); // Add frame to detector\n      var time = Date.now();\n      if (this._lastUpdate === null) {\n        this._lastUpdate = time;\n      }\n      var offset = time - this._lastUpdate;\n      if (offset > Scratch3VideoSensingBlocks.INTERVAL) {\n        var frame = this.runtime.ioDevices.video.getFrame({\n          format: Video.FORMAT_IMAGE_DATA,\n          dimensions: Scratch3VideoSensingBlocks.DIMENSIONS\n        });\n        if (frame) {\n          this._lastUpdate = time;\n          this.detect.addFrame(frame.data);\n        }\n      }\n    }\n    /**\n     * Create data for a menu in scratch-blocks format, consisting of an array\n     * of objects with text and value properties. The text is a translated\n     * string, and the value is one-indexed.\n     * @param {object[]} info - An array of info objects each having a name\n     *   property.\n     * @return {array} - An array of objects with text and value properties.\n     * @private\n     */\n  }, {\n    key: \"_buildMenu\",\n    value: function _buildMenu(info) {\n      return info.map(function (entry, index) {\n        var obj = {};\n        obj.text = entry.name;\n        obj.value = entry.value || String(index + 1);\n        return obj;\n      });\n    }\n    /**\n     * @param {Target} target - collect motion state for this target.\n     * @returns {MotionState} the mutable motion state associated with that\n     *   target. This will be created if necessary.\n     * @private\n     */\n  }, {\n    key: \"_getMotionState\",\n    value: function _getMotionState(target) {\n      var motionState = target.getCustomState(Scratch3VideoSensingBlocks.STATE_KEY);\n      if (!motionState) {\n        motionState = Clone.simple(Scratch3VideoSensingBlocks.DEFAULT_MOTION_STATE);\n        target.setCustomState(Scratch3VideoSensingBlocks.STATE_KEY, motionState);\n      }\n      return motionState;\n    }\n  }, {\n    key: \"getInfo\",\n    /**\n     * @returns {object} metadata for this extension and its blocks.\n     */\n    value: function getInfo() {\n      // Set the video display properties to defaults the first time\n      // getInfo is run. This turns on the video device when it is\n      // first added to a project, and is overwritten by a PROJECT_LOADED\n      // event listener that later calls updateVideoDisplay\n      if (this.firstInstall) {\n        this.globalVideoState = VideoState.ON;\n        this.globalVideoTransparency = 50;\n        this.updateVideoDisplay();\n        this.firstInstall = false;\n      } // Return extension definition\n      return {\n        id: 'videoSensing',\n        name: formatMessage({\n          id: 'videoSensing.categoryName',\n          default: 'Video Sensing',\n          description: 'Label for the video sensing extension category'\n        }),\n        blockIconURI: blockIconURI,\n        menuIconURI: menuIconURI,\n        blocks: [{\n          // @todo this hat needs to be set itself to restart existing\n          // threads like Scratch 2's behaviour.\n          opcode: 'whenMotionGreaterThan',\n          text: formatMessage({\n            id: 'videoSensing.whenMotionGreaterThan',\n            default: 'when video motion > [REFERENCE]',\n            description: 'Event that triggers when the amount of motion is greater than [REFERENCE]'\n          }),\n          blockType: BlockType.HAT,\n          arguments: {\n            REFERENCE: {\n              type: ArgumentType.NUMBER,\n              defaultValue: 10\n            }\n          }\n        }, {\n          opcode: 'videoOn',\n          blockType: BlockType.REPORTER,\n          text: formatMessage({\n            id: 'videoSensing.videoOn',\n            default: 'video [ATTRIBUTE] on [SUBJECT]',\n            description: 'Reporter that returns the amount of [ATTRIBUTE] for the selected [SUBJECT]'\n          }),\n          arguments: {\n            ATTRIBUTE: {\n              type: ArgumentType.NUMBER,\n              menu: 'ATTRIBUTE',\n              defaultValue: SensingAttribute.MOTION\n            },\n            SUBJECT: {\n              type: ArgumentType.NUMBER,\n              menu: 'SUBJECT',\n              defaultValue: SensingSubject.SPRITE\n            }\n          }\n        }, {\n          opcode: 'videoToggle',\n          text: formatMessage({\n            id: 'videoSensing.videoToggle',\n            default: 'turn video [VIDEO_STATE]',\n            description: 'Controls display of the video preview layer'\n          }),\n          arguments: {\n            VIDEO_STATE: {\n              type: ArgumentType.NUMBER,\n              menu: 'VIDEO_STATE',\n              defaultValue: VideoState.ON\n            }\n          }\n        }, {\n          opcode: 'setVideoTransparency',\n          text: formatMessage({\n            id: 'videoSensing.setVideoTransparency',\n            default: 'set video transparency to [TRANSPARENCY]',\n            description: 'Controls transparency of the video preview layer'\n          }),\n          arguments: {\n            TRANSPARENCY: {\n              type: ArgumentType.NUMBER,\n              defaultValue: 50\n            }\n          }\n        }],\n        menus: {\n          ATTRIBUTE: {\n            acceptReporters: true,\n            items: this._buildMenu(this.ATTRIBUTE_INFO)\n          },\n          SUBJECT: {\n            acceptReporters: true,\n            items: this._buildMenu(this.SUBJECT_INFO)\n          },\n          VIDEO_STATE: {\n            acceptReporters: true,\n            items: this._buildMenu(this.VIDEO_STATE_INFO)\n          }\n        }\n      };\n    }\n    /**\n     * Analyze a part of the frame that a target overlaps.\n     * @param {Target} target - a target to determine where to analyze\n     * @returns {MotionState} the motion state for the given target\n     */\n  }, {\n    key: \"_analyzeLocalMotion\",\n    value: function _analyzeLocalMotion(target) {\n      var drawable = this.runtime.renderer._allDrawables[target.drawableID];\n      var state = this._getMotionState(target);\n      this.detect.getLocalMotion(drawable, state);\n      return state;\n    }\n    /**\n     * A scratch reporter block handle that analyzes the last two frames and\n     * depending on the arguments, returns the motion or direction for the\n     * whole stage or just the target sprite.\n     * @param {object} args - the block arguments\n     * @param {BlockUtility} util - the block utility\n     * @returns {number} the motion amount or direction of the stage or sprite\n     */\n  }, {\n    key: \"videoOn\",\n    value: function videoOn(args, util) {\n      this.detect.analyzeFrame();\n      var state = this.detect;\n      if (args.SUBJECT === SensingSubject.SPRITE) {\n        state = this._analyzeLocalMotion(util.target);\n      }\n      if (args.ATTRIBUTE === SensingAttribute.MOTION) {\n        return state.motionAmount;\n      }\n      return state.motionDirection;\n    }\n    /**\n     * A scratch hat block edge handle that analyzes the last two frames where\n     * the target sprite overlaps and if it has more motion than the given\n     * reference value.\n     * @param {object} args - the block arguments\n     * @param {BlockUtility} util - the block utility\n     * @returns {boolean} true if the sprite overlaps more motion than the\n     *   reference\n     */\n  }, {\n    key: \"whenMotionGreaterThan\",\n    value: function whenMotionGreaterThan(args, util) {\n      this.detect.analyzeFrame();\n      var state = this._analyzeLocalMotion(util.target);\n      return state.motionAmount > Number(args.REFERENCE);\n    }\n    /**\n     * A scratch command block handle that configures the video state from\n     * passed arguments.\n     * @param {object} args - the block arguments\n     * @param {VideoState} args.VIDEO_STATE - the video state to set the device to\n     */\n  }, {\n    key: \"videoToggle\",\n    value: function videoToggle(args) {\n      var state = args.VIDEO_STATE;\n      this.globalVideoState = state;\n      if (state === VideoState.OFF) {\n        this.runtime.ioDevices.video.disableVideo();\n      } else {\n        this.runtime.ioDevices.video.enableVideo(); // Mirror if state is ON. Do not mirror if state is ON_FLIPPED.\n        this.runtime.ioDevices.video.mirror = state === VideoState.ON;\n      }\n    }\n    /**\n     * A scratch command block handle that configures the video preview's\n     * transparency from passed arguments.\n     * @param {object} args - the block arguments\n     * @param {number} args.TRANSPARENCY - the transparency to set the video\n     *   preview to\n     */\n  }, {\n    key: \"setVideoTransparency\",\n    value: function setVideoTransparency(args) {\n      var transparency = Cast.toNumber(args.TRANSPARENCY);\n      this.globalVideoTransparency = transparency;\n      this.runtime.ioDevices.video.setPreviewGhost(transparency);\n    }\n  }, {\n    key: \"globalVideoTransparency\",\n    /**\n     * The transparency setting of the video preview stored in a value\n     * accessible by any object connected to the virtual machine.\n     * @type {number}\n     */\n    get: function get() {\n      var stage = this.runtime.getTargetForStage();\n      if (stage) {\n        return stage.videoTransparency;\n      }\n      return 50;\n    },\n    set: function set(transparency) {\n      var stage = this.runtime.getTargetForStage();\n      if (stage) {\n        stage.videoTransparency = transparency;\n      }\n      return transparency;\n    }\n    /**\n     * The video state of the video preview stored in a value accessible by any\n     * object connected to the virtual machine.\n     * @type {number}\n     */\n  }, {\n    key: \"globalVideoState\",\n    get: function get() {\n      var stage = this.runtime.getTargetForStage();\n      if (stage) {\n        return stage.videoState;\n      } // Though the default value for the stage is normally 'on', we need to default\n      // to 'off' here to prevent the video device from briefly activating\n      // while waiting for stage targets to be installed that say it should be off\n      return VideoState.OFF;\n    },\n    set: function set(state) {\n      var stage = this.runtime.getTargetForStage();\n      if (stage) {\n        stage.videoState = state;\n      }\n      return state;\n    }\n  }, {\n    key: \"ATTRIBUTE_INFO\",\n    /**\n     * An array of choices of whether a reporter should return the frame's\n     * motion amount or direction.\n     * @type {object[]}\n     * @param {string} name - the translatable name to display in sensor\n     *   attribute menu\n     * @param {string} value - the serializable value of the attribute\n     */\n    get: function get() {\n      return [{\n        name: formatMessage({\n          id: 'videoSensing.motion',\n          default: 'motion',\n          description: 'Attribute for the \"video [ATTRIBUTE] on [SUBJECT]\" block'\n        }),\n        value: SensingAttribute.MOTION\n      }, {\n        name: formatMessage({\n          id: 'videoSensing.direction',\n          default: 'direction',\n          description: 'Attribute for the \"video [ATTRIBUTE] on [SUBJECT]\" block'\n        }),\n        value: SensingAttribute.DIRECTION\n      }];\n    }\n  }, {\n    key: \"SUBJECT_INFO\",\n    /**\n     * An array of info about the subject choices.\n     * @type {object[]}\n     * @param {string} name - the translatable name to display in the subject menu\n     * @param {string} value - the serializable value of the subject\n     */\n    get: function get() {\n      return [{\n        name: formatMessage({\n          id: 'videoSensing.sprite',\n          default: 'sprite',\n          description: 'Subject for the \"video [ATTRIBUTE] on [SUBJECT]\" block'\n        }),\n        value: SensingSubject.SPRITE\n      }, {\n        name: formatMessage({\n          id: 'videoSensing.stage',\n          default: 'stage',\n          description: 'Subject for the \"video [ATTRIBUTE] on [SUBJECT]\" block'\n        }),\n        value: SensingSubject.STAGE\n      }];\n    }\n    /**\n     * States the video sensing activity can be set to.\n     * @readonly\n     * @enum {string}\n     */\n  }, {\n    key: \"VIDEO_STATE_INFO\",\n    /**\n     * An array of info on video state options for the \"turn video [STATE]\" block.\n     * @type {object[]}\n     * @param {string} name - the translatable name to display in the video state menu\n     * @param {string} value - the serializable value stored in the block\n     */\n    get: function get() {\n      return [{\n        name: formatMessage({\n          id: 'videoSensing.off',\n          default: 'off',\n          description: 'Option for the \"turn video [STATE]\" block'\n        }),\n        value: VideoState.OFF\n      }, {\n        name: formatMessage({\n          id: 'videoSensing.on',\n          default: 'on',\n          description: 'Option for the \"turn video [STATE]\" block'\n        }),\n        value: VideoState.ON\n      }, {\n        name: formatMessage({\n          id: 'videoSensing.onFlipped',\n          default: 'on flipped',\n          description: 'Option for the \"turn video [STATE]\" block that causes the video to be flipped' + ' horizontally (reversed as in a mirror)'\n        }),\n        value: VideoState.ON_FLIPPED\n      }];\n    }\n  }], [{\n    key: \"INTERVAL\",\n    get: function get() {\n      return 33;\n    }\n    /**\n     * Dimensions the video stream is analyzed at after its rendered to the\n     * sample canvas.\n     * @type {Array.<number>}\n     */\n  }, {\n    key: \"DIMENSIONS\",\n    get: function get() {\n      return [480, 360];\n    }\n    /**\n     * The key to load & store a target's motion-related state.\n     * @type {string}\n     */\n  }, {\n    key: \"STATE_KEY\",\n    get: function get() {\n      return 'Scratch.videoSensing';\n    }\n    /**\n     * The default motion-related state, to be used when a target has no existing motion state.\n     * @type {MotionState}\n     */\n  }, {\n    key: \"DEFAULT_MOTION_STATE\",\n    get: function get() {\n      return {\n        motionFrameNumber: 0,\n        motionAmount: 0,\n        motionDirection: 0\n      };\n    }\n  }, {\n    key: \"SensingAttribute\",\n    get: function get() {\n      return SensingAttribute;\n    }\n  }, {\n    key: \"SensingSubject\",\n    get: function get() {\n      return SensingSubject;\n    }\n  }, {\n    key: \"VideoState\",\n    get: function get() {\n      return VideoState;\n    }\n  }]);\n  return Scratch3VideoSensingBlocks;\n}();\nmodule.exports = Scratch3VideoSensingBlocks;\n })