/* 1251 */\n (function(module, exports, __webpack_require__) {\nfunction _typeof(obj) { \"@babel/helpers - typeof\"; if (typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; }; } return _typeof(obj); }\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\nfunction _get(target, property, receiver) { if (typeof Reflect !== \"undefined\" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }\nfunction _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function\"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }\nfunction _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }\nfunction _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }\nfunction _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === \"object\" || typeof call === \"function\")) { return call; } return _assertThisInitialized(self); }\nfunction _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return self; }\nfunction _isNativeReflectConstruct() { if (typeof Reflect === \"undefined\" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === \"function\") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }\nfunction _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }\nvar twgl = __webpack_require__(103);\nvar Skin = __webpack_require__(187);\nvar SvgRenderer = __webpack_require__(1252).SVGRenderer;\nvar ShaderManager = __webpack_require__(188);\nvar MAX_TEXTURE_DIMENSION = 2048;\n/**\n * All scaled renderings of the SVG are stored in an array. The 1.0 scale of\n * the SVG is stored at the 8th index. The smallest possible 1 / 256 scale\n * rendering is stored at the 0th index.\n * @const {number}\n */\nvar INDEX_OFFSET = 8;\nvar SVGSkin = function (_Skin) {\n  _inherits(SVGSkin, _Skin);\n  var _super = _createSuper(SVGSkin);\n  /**\n   * Create a new SVG skin.\n   * @param {!int} id - The ID for this Skin.\n   * @param {!RenderWebGL} renderer - The renderer which will use this skin.\n   * @constructor\n   * @extends Skin\n   */\n  function SVGSkin(id, renderer) {\n    var _this;\n    _classCallCheck(this, SVGSkin);\n    _this = _super.call(this, id);\n    /** @type {RenderWebGL} */\n    _this._renderer = renderer;\n    /** @type {SvgRenderer} */\n    _this._svgRenderer = new SvgRenderer();\n    /** @type {Array<WebGLTexture>} */\n    _this._scaledMIPs = [];\n    /** @type {number} */\n    _this._largestMIPScale = 0;\n    /**\n    * Ratio of the size of the SVG and the max size of the WebGL texture\n    * @type {Number}\n    */\n    _this._maxTextureScale = 1;\n    return _this;\n  }\n  /**\n   * Dispose of this object. Do not use it after calling this method.\n   */\n  _createClass(SVGSkin, [{\n    key: \"dispose\",\n    value: function dispose() {\n      this.resetMIPs();\n      _get(_getPrototypeOf(SVGSkin.prototype), \"dispose\", this).call(this);\n    }\n    /**\n     * @return {Array<number>} the natural size, in Scratch units, of this skin.\n     */\n  }, {\n    key: \"useNearest\",\n    value: function useNearest(scale, drawable) {\n      // If the effect bits for mosaic, pixelate, whirl, or fisheye are set, use linear\n      if ((drawable.enabledEffects & (ShaderManager.EFFECT_INFO.fisheye.mask | ShaderManager.EFFECT_INFO.whirl.mask | ShaderManager.EFFECT_INFO.pixelate.mask | ShaderManager.EFFECT_INFO.mosaic.mask)) !== 0) {\n        return false;\n      } // We can't use nearest neighbor unless we are a multiple of 90 rotation\n      if (drawable._direction % 90 !== 0) {\n        return false;\n      } // Because SVG skins' bounding boxes are currently not pixel-aligned, the idea here is to hide blurriness\n      // by using nearest-neighbor scaling if one screen-space pixel is \"close enough\" to one texture pixel.\n      // If the scale of the skin is very close to 100 (0.99999 variance is okay I guess)\n      // TODO: Make this check more precise. We should use nearest if there's less than one pixel's difference\n      // between the screen-space and texture-space sizes of the skin. Mipmaps make this harder because there are\n      // multiple textures (and hence multiple texture spaces) and we need to know which one to choose.\n      if (Math.abs(scale[0]) > 99 && Math.abs(scale[0]) < 101 && Math.abs(scale[1]) > 99 && Math.abs(scale[1]) < 101) {\n        return true;\n      }\n      return false;\n    }\n    /**\n     * Create a MIP for a given scale.\n     * @param {number} scale - The relative size of the MIP\n     * @return {SVGMIP} An object that handles creating and updating SVG textures.\n     */\n  }, {\n    key: \"createMIP\",\n    value: function createMIP(scale) {\n      this._svgRenderer.draw(scale); // Pull out the ImageData from the canvas. ImageData speeds up\n      // updating Silhouette and is better handled by more browsers in\n      // regards to memory.\n      var canvas = this._svgRenderer.canvas; // If one of the canvas dimensions is 0, set this MIP to an empty image texture.\n      // This avoids an IndexSizeError from attempting to getImageData when one of the dimensions is 0.\n      if (canvas.width === 0 || canvas.height === 0) return _get(_getPrototypeOf(SVGSkin.prototype), \"getTexture\", this).call(this);\n      var context = canvas.getContext('2d',{willReadFrequently:true});\n      var textureData = context.getImageData(0, 0, canvas.width, canvas.height);\n      var textureOptions = {\n        auto: false,\n        wrap: this._renderer.gl.CLAMP_TO_EDGE,\n        src: textureData,\n        premultiplyAlpha: true\n      };\n      var mip = twgl.createTexture(this._renderer.gl, textureOptions); // Check if this is the largest MIP created so far. Currently, silhouettes only get scaled up.\n      if (this._largestMIPScale < scale) {\n        this._silhouette.update(textureData);\n        this._largestMIPScale = scale;\n      }\n      return mip;\n    }\n  }, {\n    key: \"updateSilhouette\",\n    value: function updateSilhouette() {\n      var scale = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [100, 100];\n      // Ensure a silhouette exists.\n      this.getTexture(scale);\n    }\n    /**\n     * @param {Array<number>} scale - The scaling factors to be used, each in the [0,100] range.\n     * @return {WebGLTexture} The GL texture representation of this skin when drawing at the given scale.\n     */\n  }, {\n    key: \"getTexture\",\n    value: function getTexture(scale) {\n      // The texture only ever gets uniform scale. Take the larger of the two axes.\n      var scaleMax = scale ? Math.max(Math.abs(scale[0]), Math.abs(scale[1])) : 100;\n      var requestedScale = Math.min(scaleMax / 100, this._maxTextureScale); // Math.ceil(Math.log2(scale)) means we use the \"1x\" texture at (0.5, 1] scale,\n      // the \"2x\" texture at (1, 2] scale, the \"4x\" texture at (2, 4] scale, etc.\n      // This means that one texture pixel will always be between 0.5x and 1x the size of one rendered pixel,\n      // but never bigger than one rendered pixel--this prevents blurriness from blowing up the texture too much.\n      var mipLevel = Math.max(Math.ceil(Math.log2(requestedScale)) + INDEX_OFFSET, 0); // Can't use bitwise stuff here because we need to handle negative exponents\n      var mipScale = Math.pow(2, mipLevel - INDEX_OFFSET);\n      if (this._svgRenderer.loaded && !this._scaledMIPs[mipLevel]) {\n        this._scaledMIPs[mipLevel] = this.createMIP(mipScale);\n      }\n      return this._scaledMIPs[mipLevel] || _get(_getPrototypeOf(SVGSkin.prototype), \"getTexture\", this).call(this);\n    }\n    /**\n     * Do a hard reset of the existing MIPs by deleting them.\n     * @param {Array<number>} [rotationCenter] - Optional rotation center for the SVG. If not supplied, it will be\n     * calculated from the bounding box\n     * @fires Skin.event:WasAltered\n     */\n  }, {\n    key: \"resetMIPs\",\n    value: function resetMIPs() {\n      var _this2 = this;\n      this._scaledMIPs.forEach(function (oldMIP) {\n        return _this2._renderer.gl.deleteTexture(oldMIP);\n      });\n      this._scaledMIPs.length = 0;\n      this._largestMIPScale = 0;\n    }\n    /**\n     * Set the contents of this skin to a snapshot of the provided SVG data.\n     * @param {string} svgData - new SVG to use.\n     * @param {Array<number>} [rotationCenter] - Optional rotation center for the SVG.\n     */\n  }, {\n    key: \"setSVG\",\n    value: function setSVG(svgData, rotationCenter) {\n      var _this3 = this;\n      this._svgRenderer.loadSVG(svgData, false, function () {\n        var svgSize = _this3._svgRenderer.size;\n        if (svgSize[0] === 0 || svgSize[1] === 0) {\n          _get(_getPrototypeOf(SVGSkin.prototype), \"setEmptyImageData\", _this3).call(_this3);\n          return;\n        }\n        var maxDimension = Math.ceil(Math.max(_this3.size[0], _this3.size[1]));\n        var testScale = 2;\n        for (testScale; maxDimension * testScale <= MAX_TEXTURE_DIMENSION; testScale *= 2) {\n          _this3._maxTextureScale = testScale;\n        }\n        _this3.resetMIPs();\n        if (typeof rotationCenter === 'undefined') rotationCenter = _this3.calculateRotationCenter();\n        var viewOffset = _this3._svgRenderer.viewOffset;\n        _this3._rotationCenter[0] = rotationCenter[0] - viewOffset[0];\n        _this3._rotationCenter[1] = rotationCenter[1] - viewOffset[1];\n        _this3.emit(Skin.Events.WasAltered);\n      });\n    }\n  }, {\n    key: \"size\",\n    get: function get() {\n      return this._svgRenderer.size;\n    }\n  }]);\n  return SVGSkin;\n}(Skin);\nmodule.exports = SVGSkin;\n })