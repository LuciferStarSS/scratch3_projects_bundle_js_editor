/* 1225 */\n (function(module, exports, __webpack_require__) {\nfunction _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }\nfunction _nonIterableRest() { throw new TypeError(\"Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.\"); }\nfunction _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === \"string\") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === \"Object\" && o.constructor) n = o.constructor.name; if (n === \"Map\" || n === \"Set\") return Array.from(o); if (n === \"Arguments\" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }\nfunction _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }\nfunction _iterableToArrayLimit(arr, i) { if (typeof Symbol === \"undefined\" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i[\"return\"] != null) _i[\"return\"](); } finally { if (_d) throw _e; } } return _arr; }\nfunction _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\nvar StartAudioContext = __webpack_require__(1226);\nvar AudioContext = __webpack_require__(1227);\nvar log = __webpack_require__(229);\nvar uid = __webpack_require__(1229);\nvar ADPCMSoundDecoder = __webpack_require__(1230);\nvar Loudness = __webpack_require__(1232);\nvar SoundPlayer = __webpack_require__(1233);\nvar EffectChain = __webpack_require__(1234);\nvar PanEffect = __webpack_require__(1235);\nvar PitchEffect = __webpack_require__(1236);\nvar VolumeEffect = __webpack_require__(485);\nvar SoundBank = __webpack_require__(1237);\n/**\n * Wrapper to ensure that audioContext.decodeAudioData is a promise\n * @param {object} audioContext The current AudioContext\n * @param {ArrayBuffer} buffer Audio data buffer to decode\n * @return {Promise} A promise that resolves to the decoded audio\n */\nvar decodeAudioData = function decodeAudioData(audioContext, buffer) {\n  // Check for newer promise-based API\n  if (audioContext.decodeAudioData.length === 1) {\n    return audioContext.decodeAudioData(buffer);\n  } // Fall back to callback API\n  return new Promise(function (resolve, reject) {\n    audioContext.decodeAudioData(buffer, function (decodedAudio) {\n      return resolve(decodedAudio);\n    }, function (error) {\n      return reject(error);\n    });\n  });\n};\n/**\n * There is a single instance of the AudioEngine. It handles global audio\n * properties and effects, loads all the audio buffers for sounds belonging to\n * sprites.\n */\nvar AudioEngine = function () {\n  function AudioEngine() {\n    var audioContext = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new AudioContext();\n    _classCallCheck(this, AudioEngine);\n    /**\n     * AudioContext to play and manipulate sounds with a graph of source\n     * and effect nodes.\n     * @type {AudioContext}\n     */\n    this.audioContext = audioContext;\n    StartAudioContext(this.audioContext);\n    /**\n     * Master GainNode that all sounds plays through. Changing this node\n     * will change the volume for all sounds.\n     * @type {GainNode}\n     */\n    this.inputNode = this.audioContext.createGain();\n    this.inputNode.connect(this.audioContext.destination);\n    /**\n     * a map of soundIds to audio buffers, holding sounds for all sprites\n     * @type {Object<String, ArrayBuffer>}\n     */\n    this.audioBuffers = {};\n    /**\n     * A Loudness detector.\n     * @type {Loudness}\n     */\n    this.loudness = null;\n    /**\n     * Array of effects applied in order, left to right,\n     * Left is closest to input, Right is closest to output\n     */\n    this.effects = [PanEffect, PitchEffect, VolumeEffect];\n  }\n  /**\n   * Current time in the AudioEngine.\n   * @type {number}\n   */\n  _createClass(AudioEngine, [{\n    key: \"getInputNode\",\n    /**\n     * Get the input node.\n     * @return {AudioNode} - audio node that is the input for this effect\n     */\n    value: function getInputNode() {\n      return this.inputNode;\n    }\n    /**\n     * Decode a sound, decompressing it into audio samples.\n     * @param {object} sound - an object containing audio data and metadata for\n     *     a sound\n     * @param {Buffer} sound.data - sound data loaded from scratch-storage\n     * @returns {?Promise} - a promise which will resolve to the sound id and\n     *     buffer if decoded\n     */\n  }, {\n    key: \"_decodeSound\",\n    value: function _decodeSound(sound) {\n      var _this = this;\n      // Make a copy of the buffer because decoding detaches the original\n      // buffer\n      var bufferCopy1 = sound.data.buffer.slice(0); // todo: multiple decodings of the same buffer create duplicate decoded\n      // copies in audioBuffers. Create a hash id of the buffer or deprecate\n      // audioBuffers to avoid memory issues for large audio buffers.\n      var soundId = uid(); // Attempt to decode the sound using the browser's native audio data\n      // decoder If that fails, attempt to decode as ADPCM\n      var decoding = decodeAudioData(this.audioContext, bufferCopy1).catch(function () {\n        // If the file is empty, create an empty sound\n        if (sound.data.length === 0) {\n          return _this._emptySound();\n        } // The audio context failed to parse the sound data\n        // we gave it, so try to decode as 'adpcm'\n        // First we need to create another copy of our original data\n        var bufferCopy2 = sound.data.buffer.slice(0); // Try decoding as adpcm\n        return new ADPCMSoundDecoder(_this.audioContext).decode(bufferCopy2).catch(function () {\n          return _this._emptySound();\n        });\n      }).then(function (buffer) {\n        return [soundId, buffer];\n      }, function (error) {\n        log.warn('audio data could not be decoded', error);\n      });\n      return decoding;\n    }\n    /**\n     * An empty sound buffer, for use when we are unable to decode a sound file.\n     * @returns {AudioBuffer} - an empty audio buffer.\n     */\n  }, {\n    key: \"_emptySound\",\n    value: function _emptySound() {\n      return this.audioContext.createBuffer(1, 1, this.audioContext.sampleRate);\n    }\n    /**\n     * Decode a sound, decompressing it into audio samples.\n     *\n     * Store a reference to it the sound in the audioBuffers dictionary,\n     * indexed by soundId.\n     *\n     * @param {object} sound - an object containing audio data and metadata for\n     *     a sound\n     * @param {Buffer} sound.data - sound data loaded from scratch-storage\n     * @returns {?Promise} - a promise which will resolve to the sound id\n     */\n  }, {\n    key: \"decodeSound\",\n    value: function decodeSound(sound) {\n      var _this2 = this;\n      return this._decodeSound(sound).then(function (_ref) {\n        var _ref2 = _slicedToArray(_ref, 2),\n            id = _ref2[0],\n            buffer = _ref2[1];\n        _this2.audioBuffers[id] = buffer;\n        return id;\n      });\n    }\n    /**\n     * Decode a sound, decompressing it into audio samples.\n     *\n     * Create a SoundPlayer instance that can be used to play the sound and\n     * stop and fade out playback.\n     *\n     * @param {object} sound - an object containing audio data and metadata for\n     *     a sound\n     * @param {Buffer} sound.data - sound data loaded from scratch-storage\n     * @returns {?Promise} - a promise which will resolve to the buffer\n     */\n  }, {\n    key: \"decodeSoundPlayer\",\n    value: function decodeSoundPlayer(sound) {\n      var _this3 = this;\n      return this._decodeSound(sound).then(function (_ref3) {\n        var _ref4 = _slicedToArray(_ref3, 2),\n            id = _ref4[0],\n            buffer = _ref4[1];\n        return new SoundPlayer(_this3, {\n          id: id,\n          buffer: buffer\n        });\n      });\n    }\n    /**\n     * Get the current loudness of sound received by the microphone.\n     * Sound is measured in RMS and smoothed.\n     * @return {number} loudness scaled 0 to 100\n     */\n  }, {\n    key: \"getLoudness\",\n    value: function getLoudness() {\n      // The microphone has not been set up, so try to connect to it\n      if (!this.loudness) {\n        this.loudness = new Loudness(this.audioContext);\n      }\n      return this.loudness.getLoudness();\n    }\n    /**\n     * Create an effect chain.\n     * @returns {EffectChain} chain of effects defined by this AudioEngine\n     */\n  }, {\n    key: \"createEffectChain\",\n    value: function createEffectChain() {\n      var effects = new EffectChain(this, this.effects);\n      effects.connect(this);\n      return effects;\n    }\n    /**\n     * Create a sound bank and effect chain.\n     * @returns {SoundBank} a sound bank configured with an effect chain\n     *     defined by this AudioEngine\n     */\n  }, {\n    key: \"createBank\",\n    value: function createBank() {\n      return new SoundBank(this, this.createEffectChain());\n    }\n  }, {\n    key: \"currentTime\",\n    get: function get() {\n      return this.audioContext.currentTime;\n    }\n    /**\n     * Names of the audio effects.\n     * @enum {string}\n     */\n  }, {\n    key: \"EFFECT_NAMES\",\n    get: function get() {\n      return {\n        pitch: 'pitch',\n        pan: 'pan'\n      };\n    }\n    /**\n     * A short duration to transition audio prarameters.\n     *\n     * Used as a time constant for exponential transitions. A general value\n     * must be large enough that it does not cute off lower frequency, or bass,\n     * sounds. Human hearing lower limit is ~20Hz making a safe value 25\n     * milliseconds or 0.025 seconds, where half of a 20Hz wave will play along\n     * with the DECAY. Higher frequencies will play multiple waves during the\n     * same amount of time and avoid clipping.\n     *\n     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/AudioParam/setTargetAtTime}\n     * @const {number}\n     */\n  }, {\n    key: \"DECAY_DURATION\",\n    get: function get() {\n      return 0.025;\n    }\n    /**\n     * Some environments cannot smoothly change parameters immediately, provide\n     * a small delay before decaying.\n     *\n     * @see {@link https://bugzilla.mozilla.org/show_bug.cgi?id=1228207}\n     * @const {number}\n     */\n  }, {\n    key: \"DECAY_WAIT\",\n    get: function get() {\n      return 0.05;\n    }\n  }]);\n  return AudioEngine;\n}();\nmodule.exports = AudioEngine;\n })