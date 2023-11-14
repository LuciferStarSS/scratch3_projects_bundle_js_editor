/* 187 */\n (function(module, exports, __webpack_require__) {\nfunction _typeof(obj) { \"@babel/helpers - typeof\"; if (typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; }; } return _typeof(obj); }\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function\"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }\nfunction _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }\nfunction _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }\nfunction _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === \"object\" || typeof call === \"function\")) { return call; } return _assertThisInitialized(self); }\nfunction _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return self; }\nfunction _isNativeReflectConstruct() { if (typeof Reflect === \"undefined\" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === \"function\") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }\nfunction _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }\nvar EventEmitter = __webpack_require__(91);\nvar twgl = __webpack_require__(103);\nvar RenderConstants = __webpack_require__(230);\nvar Silhouette = __webpack_require__(1246);\nvar Skin = function (_EventEmitter) {\n  _inherits(Skin, _EventEmitter);\n  var _super = _createSuper(Skin);\n  /**\n   * Create a Skin, which stores and/or generates textures for use in rendering.\n   * @param {int} id - The unique ID for this Skin.\n   * @constructor\n   */\n  function Skin(id) {\n    var _this;\n    _classCallCheck(this, Skin);\n    _this = _super.call(this);\n    /** @type {int} */\n    _this._id = id;\n    /** @type {Vec3} */\n    _this._rotationCenter = twgl.v3.create(0, 0);\n    /** @type {WebGLTexture} */\n    _this._texture = null;\n    /**\n     * The uniforms to be used by the vertex and pixel shaders.\n     * Some of these are used by other parts of the renderer as well.\n     * @type {Object.<string,*>}\n     * @private\n     */\n    _this._uniforms = {\n      /**\n       * The nominal (not necessarily current) size of the current skin.\n       * @type {Array<number>}\n       */\n      u_skinSize: [0, 0],\n      /**\n       * The actual WebGL texture object for the skin.\n       * @type {WebGLTexture}\n       */\n      u_skin: null\n    };\n    /**\n     * A silhouette to store touching data, skins are responsible for keeping it up to date.\n     * @private\n     */\n    _this._silhouette = new Silhouette();\n    _this.setMaxListeners(RenderConstants.SKIN_SHARE_SOFT_LIMIT);\n    return _this;\n  }\n  /**\n   * Dispose of this object. Do not use it after calling this method.\n   */\n  _createClass(Skin, [{\n    key: \"dispose\",\n    value: function dispose() {\n      this._id = RenderConstants.ID_NONE;\n    }\n    /**\n     * @return {int} the unique ID for this Skin.\n     */\n  }, {\n    key: \"useNearest\",\n    /**\n     * Should this skin's texture be filtered with nearest-neighbor or linear interpolation at the given scale?\n     * @param {?Array<Number>} scale The screen-space X and Y scaling factors at which this skin's texture will be\n     * displayed, as percentages (100 means 1 \"native size\" unit is 1 screen pixel; 200 means 2 screen pixels, etc).\n     * @param {Drawable} drawable The drawable that this skin's texture will be applied to.\n     * @return {boolean} True if this skin's texture, as returned by {@link getTexture}, should be filtered with\n     * nearest-neighbor interpolation.\n     */\n    // eslint-disable-next-line no-unused-vars\n    value: function useNearest(scale, drawable) {\n      return true;\n    }\n    /**\n     * Get the center of the current bounding box\n     * @return {Array<number>} the center of the current bounding box\n     */\n  }, {\n    key: \"calculateRotationCenter\",\n    value: function calculateRotationCenter() {\n      return [this.size[0] / 2, this.size[1] / 2];\n    }\n    /**\n     * @abstract\n     * @param {Array<number>} scale - The scaling factors to be used.\n     * @return {WebGLTexture} The GL texture representation of this skin when drawing at the given size.\n     */\n    // eslint-disable-next-line no-unused-vars\n  }, {\n    key: \"getTexture\",\n    value: function getTexture(scale) {\n      return this._emptyImageTexture;\n    }\n    /**\n     * Get the bounds of the drawable for determining its fenced position.\n     * @param {Array<number>} drawable - The Drawable instance this skin is using.\n     * @param {?Rectangle} result - Optional destination for bounds calculation.\n     * @return {!Rectangle} The drawable's bounds. For compatibility with Scratch 2, we always use getAABB.\n     */\n  }, {\n    key: \"getFenceBounds\",\n    value: function getFenceBounds(drawable, result) {\n      return drawable.getAABB(result);\n    }\n    /**\n     * Update and returns the uniforms for this skin.\n     * @param {Array<number>} scale - The scaling factors to be used.\n     * @returns {object.<string, *>} the shader uniforms to be used when rendering with this Skin.\n     */\n  }, {\n    key: \"getUniforms\",\n    value: function getUniforms(scale) {\n      this._uniforms.u_skin = this.getTexture(scale);\n      this._uniforms.u_skinSize = this.size;\n      return this._uniforms;\n    }\n    /**\n     * If the skin defers silhouette operations until the last possible minute,\n     * this will be called before isTouching uses the silhouette.\n     * @abstract\n     */\n  }, {\n    key: \"updateSilhouette\",\n    value: function updateSilhouette() {}\n    /**\n     * Set this skin's texture to the given image.\n     * @param {ImageData|HTMLCanvasElement} textureData - The canvas or image data to set the texture to.\n     */\n  }, {\n    key: \"_setTexture\",\n    value: function _setTexture(textureData) {\n      var gl = this._renderer.gl;\n      gl.bindTexture(gl.TEXTURE_2D, this._texture); // Premultiplied alpha is necessary for proper blending.\n      // See http://www.realtimerendering.com/blog/gpus-prefer-premultiplication/\n      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);\n      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureData);\n      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);\n      this._silhouette.update(textureData);\n    }\n    /**\n     * Set the contents of this skin to an empty skin.\n     * @fires Skin.event:WasAltered\n     */\n  }, {\n    key: \"setEmptyImageData\",\n    value: function setEmptyImageData() {\n      // Free up the current reference to the _texture\n      this._texture = null;\n      if (!this._emptyImageData) {\n        // Create a transparent pixel\n        this._emptyImageData = new ImageData(1, 1); // Create a new texture and update the silhouette\n        var gl = this._renderer.gl;\n        var textureOptions = {\n          auto: true,\n          wrap: gl.CLAMP_TO_EDGE,\n          src: this._emptyImageData\n        }; // Note: we're using _emptyImageTexture here instead of _texture\n        // so that we can cache this empty texture for later use as needed.\n        // this._texture can get modified by other skins (e.g. BitmapSkin\n        // and SVGSkin, so we can't use that same field for caching)\n        this._emptyImageTexture = twgl.createTexture(gl, textureOptions);\n      }\n      this._rotationCenter[0] = 0;\n      this._rotationCenter[1] = 0;\n      this._silhouette.update(this._emptyImageData);\n      this.emit(Skin.Events.WasAltered);\n    }\n    /**\n     * Does this point touch an opaque or translucent point on this skin?\n     * Nearest Neighbor version\n     * The caller is responsible for ensuring this skin's silhouette is up-to-date.\n     * @see updateSilhouette\n     * @see Drawable.updateCPURenderAttributes\n     * @param {twgl.v3} vec A texture coordinate.\n     * @return {boolean} Did it touch?\n     */\n  }, {\n    key: \"isTouchingNearest\",\n    value: function isTouchingNearest(vec) {\n      return this._silhouette.isTouchingNearest(vec);\n    }\n    /**\n     * Does this point touch an opaque or translucent point on this skin?\n     * Linear Interpolation version\n     * The caller is responsible for ensuring this skin's silhouette is up-to-date.\n     * @see updateSilhouette\n     * @see Drawable.updateCPURenderAttributes\n     * @param {twgl.v3} vec A texture coordinate.\n     * @return {boolean} Did it touch?\n     */\n  }, {\n    key: \"isTouchingLinear\",\n    value: function isTouchingLinear(vec) {\n      return this._silhouette.isTouchingLinear(vec);\n    }\n  }, {\n    key: \"id\",\n    get: function get() {\n      return this._id;\n    }\n    /**\n     * @returns {Vec3} the origin, in object space, about which this Skin should rotate.\n     */\n  }, {\n    key: \"rotationCenter\",\n    get: function get() {\n      return this._rotationCenter;\n    }\n    /**\n     * @abstract\n     * @return {Array<number>} the \"native\" size, in texels, of this skin.\n     */\n  }, {\n    key: \"size\",\n    get: function get() {\n      return [0, 0];\n    }\n  }]);\n  return Skin;\n}(EventEmitter);\n/**\n * These are the events which can be emitted by instances of this class.\n * @enum {string}\n */\nSkin.Events = {\n  /**\n   * Emitted when anything about the Skin has been altered, such as the appearance or rotation center.\n   * @event Skin.event:WasAltered\n   */\n  WasAltered: 'WasAltered'\n};\nmodule.exports = Skin;\n })