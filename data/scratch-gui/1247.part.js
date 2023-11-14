/* 1247 */\n (function(module, exports, __webpack_require__) {\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\nvar twgl = __webpack_require__(103);\nvar Rectangle = __webpack_require__(486);\nvar RenderConstants = __webpack_require__(230);\nvar ShaderManager = __webpack_require__(188);\nvar Skin = __webpack_require__(187);\nvar EffectTransform = __webpack_require__(487);\nvar log = __webpack_require__(488);\n/**\n * An internal workspace for calculating texture locations from world vectors\n * this is REUSED for memory conservation reasons\n * @type {twgl.v3}\n */\nvar __isTouchingPosition = twgl.v3.create();\nvar FLOATING_POINT_ERROR_ALLOWANCE = 1e-6;\n/**\n * Convert a scratch space location into a texture space float.  Uses the\n * internal __isTouchingPosition as a return value, so this should be copied\n * if you ever need to get two local positions and store both.  Requires that\n * the drawable inverseMatrix is up to date.\n *\n * @param {Drawable} drawable The drawable to get the inverse matrix and uniforms from\n * @param {twgl.v3} vec [x,y] scratch space vector\n * @return {twgl.v3} [x,y] texture space float vector - transformed by effects and matrix\n */\nvar getLocalPosition = function getLocalPosition(drawable, vec) {\n  // Transfrom from world coordinates to Drawable coordinates.\n  var localPosition = __isTouchingPosition;\n  var v0 = vec[0];\n  var v1 = vec[1];\n  var m = drawable._inverseMatrix; // var v2 = v[2];\n  var d = v0 * m[3] + v1 * m[7] + m[15]; // The RenderWebGL quad flips the texture's X axis. So rendered bottom\n  // left is 1, 0 and the top right is 0, 1. Flip the X axis so\n  // localPosition matches that transformation.\n  localPosition[0] = 0.5 - (v0 * m[0] + v1 * m[4] + m[12]) / d;\n  localPosition[1] = (v0 * m[1] + v1 * m[5] + m[13]) / d + 0.5; // Fix floating point issues near 0. Filed https://github.com/LLK/scratch-render/issues/688 that\n  // they're happening in the first place.\n  // TODO: Check if this can be removed after render pull 479 is merged\n  if (Math.abs(localPosition[0]) < FLOATING_POINT_ERROR_ALLOWANCE) localPosition[0] = 0;\n  if (Math.abs(localPosition[1]) < FLOATING_POINT_ERROR_ALLOWANCE) localPosition[1] = 0; // Apply texture effect transform if the localPosition is within the drawable's space,\n  // and any effects are currently active.\n  if (drawable.enabledEffects !== 0 && localPosition[0] >= 0 && localPosition[0] < 1 && localPosition[1] >= 0 && localPosition[1] < 1) {\n    EffectTransform.transformPoint(drawable, localPosition, localPosition);\n  }\n  return localPosition;\n};\nvar Drawable = function () {\n  /**\n   * An object which can be drawn by the renderer.\n   * @todo double-buffer all rendering state (position, skin, effects, etc.)\n   * @param {!int} id - This Drawable's unique ID.\n   * @constructor\n   */\n  function Drawable(id) {\n    _classCallCheck(this, Drawable);\n    /** @type {!int} */\n    this._id = id;\n    /**\n     * The uniforms to be used by the vertex and pixel shaders.\n     * Some of these are used by other parts of the renderer as well.\n     * @type {Object.<string,*>}\n     * @private\n     */\n    this._uniforms = {\n      /**\n       * The model matrix, to concat with projection at draw time.\n       * @type {module:twgl/m4.Mat4}\n       */\n      u_modelMatrix: twgl.m4.identity(),\n      /**\n       * The color to use in the silhouette draw mode.\n       * @type {Array<number>}\n       */\n      u_silhouetteColor: Drawable.color4fFromID(this._id)\n    }; // Effect values are uniforms too\n    var numEffects = ShaderManager.EFFECTS.length;\n    for (var index = 0; index < numEffects; ++index) {\n      var effectName = ShaderManager.EFFECTS[index];\n      var effectInfo = ShaderManager.EFFECT_INFO[effectName];\n      var converter = effectInfo.converter;\n      this._uniforms[effectInfo.uniformName] = converter(0);\n    }\n    this._position = twgl.v3.create(0, 0);\n    this._scale = twgl.v3.create(100, 100);\n    this._direction = 90;\n    this._transformDirty = true;\n    this._rotationMatrix = twgl.m4.identity();\n    this._rotationTransformDirty = true;\n    this._rotationAdjusted = twgl.v3.create();\n    this._rotationCenterDirty = true;\n    this._skinScale = twgl.v3.create(0, 0, 0);\n    this._skinScaleDirty = true;\n    this._inverseMatrix = twgl.m4.identity();\n    this._inverseTransformDirty = true;\n    this._visible = true;\n    /** A bitmask identifying which effects are currently in use.\n     * @readonly\n     * @type {int} */\n    this.enabledEffects = 0;\n    /** @todo move convex hull functionality, maybe bounds functionality overall, to Skin classes */\n    this._convexHullPoints = null;\n    this._convexHullDirty = true; // The precise bounding box will be from the transformed convex hull points,\n    // so initialize the array of transformed hull points in setConvexHullPoints.\n    // Initializing it once per convex hull recalculation avoids unnecessary creation of twgl.v3 objects.\n    this._transformedHullPoints = null;\n    this._transformedHullDirty = true;\n    this._skinWasAltered = this._skinWasAltered.bind(this);\n    this.isTouching = this._isTouchingNever;\n  }\n  /**\n   * Dispose of this Drawable. Do not use it after calling this method.\n   */\n  _createClass(Drawable, [{\n    key: \"dispose\",\n    value: function dispose() {\n      // Use the setter: disconnect events\n      this.skin = null;\n    }\n    /**\n     * Mark this Drawable's transform as dirty.\n     * It will be recalculated next time it's needed.\n     */\n  }, {\n    key: \"setTransformDirty\",\n    value: function setTransformDirty() {\n      this._transformDirty = true;\n      this._inverseTransformDirty = true;\n      this._transformedHullDirty = true;\n    }\n    /**\n     * @returns {number} The ID for this Drawable.\n     */\n  }, {\n    key: \"getUniforms\",\n    /**\n     * @returns {object.<string, *>} the shader uniforms to be used when rendering this Drawable.\n     */\n    value: function getUniforms() {\n      if (this._transformDirty) {\n        this._calculateTransform();\n      }\n      return this._uniforms;\n    }\n    /**\n     * @returns {boolean} whether this Drawable is visible.\n     */\n  }, {\n    key: \"getVisible\",\n    value: function getVisible() {\n      return this._visible;\n    }\n    /**\n     * Update the position if it is different. Marks the transform as dirty.\n     * @param {Array.<number>} position A new position.\n     */\n  }, {\n    key: \"updatePosition\",\n    value: function updatePosition(position) {\n      if (this._position[0] !== position[0] || this._position[1] !== position[1]) {\n        this._position[0] = Math.round(position[0]);\n        this._position[1] = Math.round(position[1]);\n        this.setTransformDirty();\n      }\n    }\n    /**\n     * Update the direction if it is different. Marks the transform as dirty.\n     * @param {number} direction A new direction.\n     */\n  }, {\n    key: \"updateDirection\",\n    value: function updateDirection(direction) {\n      if (this._direction !== direction) {\n        this._direction = direction;\n        this._rotationTransformDirty = true;\n        this.setTransformDirty();\n      }\n    }\n    /**\n     * Update the scale if it is different. Marks the transform as dirty.\n     * @param {Array.<number>} scale A new scale.\n     */\n  }, {\n    key: \"updateScale\",\n    value: function updateScale(scale) {\n      if (this._scale[0] !== scale[0] || this._scale[1] !== scale[1]) {\n        this._scale[0] = scale[0];\n        this._scale[1] = scale[1];\n        this._rotationCenterDirty = true;\n        this._skinScaleDirty = true;\n        this.setTransformDirty();\n      }\n    }\n    /**\n     * Update visibility if it is different. Marks the convex hull as dirty.\n     * @param {boolean} visible A new visibility state.\n     */\n  }, {\n    key: \"updateVisible\",\n    value: function updateVisible(visible) {\n      if (this._visible !== visible) {\n        this._visible = visible;\n        this.setConvexHullDirty();\n      }\n    }\n    /**\n     * Update an effect. Marks the convex hull as dirty if the effect changes shape.\n     * @param {string} effectName The name of the effect.\n     * @param {number} rawValue A new effect value.\n     */\n  }, {\n    key: \"updateEffect\",\n    value: function updateEffect(effectName, rawValue) {\n      var effectInfo = ShaderManager.EFFECT_INFO[effectName];\n      if (rawValue) {\n        this.enabledEffects |= effectInfo.mask;\n      } else {\n        this.enabledEffects &= ~effectInfo.mask;\n      }\n      var converter = effectInfo.converter;\n      this._uniforms[effectInfo.uniformName] = converter(rawValue);\n      if (effectInfo.shapeChanges) {\n        this.setConvexHullDirty();\n      }\n    }\n    /**\n     * Update the position, direction, scale, or effect properties of this Drawable.\n     * @deprecated Use specific update* methods instead.\n     * @param {object.<string,*>} properties The new property values to set.\n     */\n  }, {\n    key: \"updateProperties\",\n    value: function updateProperties(properties) {\n      if ('position' in properties) {\n        this.updatePosition(properties.position);\n      }\n      if ('direction' in properties) {\n        this.updateDirection(properties.direction);\n      }\n      if ('scale' in properties) {\n        this.updateScale(properties.scale);\n      }\n      if ('visible' in properties) {\n        this.updateVisible(properties.visible);\n      }\n      var numEffects = ShaderManager.EFFECTS.length;\n      for (var index = 0; index < numEffects; ++index) {\n        var effectName = ShaderManager.EFFECTS[index];\n        if (effectName in properties) {\n          this.updateEffect(effectName, properties[effectName]);\n        }\n      }\n    }\n    /**\n     * Calculate the transform to use when rendering this Drawable.\n     * @private\n     */\n  }, {\n    key: \"_calculateTransform\",\n    value: function _calculateTransform() {\n      if (this._rotationTransformDirty) {\n        var rotation = (270 - this._direction) * Math.PI / 180; // Calling rotationZ sets the destination matrix to a rotation\n        // around the Z axis setting matrix components 0, 1, 4 and 5 with\n        // cosine and sine values of the rotation.\n        // twgl.m4.rotationZ(rotation, this._rotationMatrix);\n        // twgl assumes the last value set to the matrix was anything.\n        // Drawable knows, it was another rotationZ matrix, so we can skip\n        // assigning the values that will never change.\n        var c = Math.cos(rotation);\n        var s = Math.sin(rotation);\n        this._rotationMatrix[0] = c;\n        this._rotationMatrix[1] = s; // this._rotationMatrix[2] = 0;\n        // this._rotationMatrix[3] = 0;\n        this._rotationMatrix[4] = -s;\n        this._rotationMatrix[5] = c; // this._rotationMatrix[6] = 0;\n        // this._rotationMatrix[7] = 0;\n        // this._rotationMatrix[8] = 0;\n        // this._rotationMatrix[9] = 0;\n        // this._rotationMatrix[10] = 1;\n        // this._rotationMatrix[11] = 0;\n        // this._rotationMatrix[12] = 0;\n        // this._rotationMatrix[13] = 0;\n        // this._rotationMatrix[14] = 0;\n        // this._rotationMatrix[15] = 1;\n        this._rotationTransformDirty = false;\n      } // Adjust rotation center relative to the skin.\n      if (this._rotationCenterDirty && this.skin !== null) {\n        // twgl version of the following in function work.\n        // let rotationAdjusted = twgl.v3.subtract(\n        //     this.skin.rotationCenter,\n        //     twgl.v3.divScalar(this.skin.size, 2, this._rotationAdjusted),\n        //     this._rotationAdjusted\n        // );\n        // rotationAdjusted = twgl.v3.multiply(\n        //     rotationAdjusted, this._scale, rotationAdjusted\n        // );\n        // rotationAdjusted = twgl.v3.divScalar(\n        //     rotationAdjusted, 100, rotationAdjusted\n        // );\n        // rotationAdjusted[1] *= -1; // Y flipped to Scratch coordinate.\n        // rotationAdjusted[2] = 0; // Z coordinate is 0.\n        // Locally assign rotationCenter and skinSize to keep from having\n        // the Skin getter properties called twice while locally assigning\n        // their components for readability.\n        var rotationCenter = this.skin.rotationCenter;\n        var skinSize = this.skin.size;\n        var center0 = rotationCenter[0];\n        var center1 = rotationCenter[1];\n        var skinSize0 = skinSize[0];\n        var skinSize1 = skinSize[1];\n        var _scale = this._scale[0];\n        var _scale2 = this._scale[1];\n        var rotationAdjusted = this._rotationAdjusted;\n        rotationAdjusted[0] = (center0 - skinSize0 / 2) * _scale / 100;\n        rotationAdjusted[1] = (center1 - skinSize1 / 2) * _scale2 / 100 * -1; // rotationAdjusted[2] = 0;\n        this._rotationCenterDirty = false;\n      }\n      if (this._skinScaleDirty && this.skin !== null) {\n        // twgl version of the following in function work.\n        // const scaledSize = twgl.v3.divScalar(\n        //     twgl.v3.multiply(this.skin.size, this._scale),\n        //     100\n        // );\n        // // was NaN because the vectors have only 2 components.\n        // scaledSize[2] = 0;\n        // Locally assign skinSize to keep from having the Skin getter\n        // properties called twice.\n        var _skinSize = this.skin.size;\n        var scaledSize = this._skinScale;\n        scaledSize[0] = _skinSize[0] * this._scale[0] / 100;\n        scaledSize[1] = _skinSize[1] * this._scale[1] / 100; // scaledSize[2] = 0;\n        this._skinScaleDirty = false;\n      }\n      var modelMatrix = this._uniforms.u_modelMatrix; // twgl version of the following in function work.\n      // twgl.m4.identity(modelMatrix);\n      // twgl.m4.translate(modelMatrix, this._position, modelMatrix);\n      // twgl.m4.multiply(modelMatrix, this._rotationMatrix, modelMatrix);\n      // twgl.m4.translate(modelMatrix, this._rotationAdjusted, modelMatrix);\n      // twgl.m4.scale(modelMatrix, scaledSize, modelMatrix);\n      // Drawable configures a 3D matrix for drawing in WebGL, but most values\n      // will never be set because the inputs are on the X and Y position axis\n      // and the Z rotation axis. Drawable can bring the work inside\n      // _calculateTransform and greatly reduce the ammount of math and array\n      // assignments needed.\n      var scale0 = this._skinScale[0];\n      var scale1 = this._skinScale[1];\n      var rotation00 = this._rotationMatrix[0];\n      var rotation01 = this._rotationMatrix[1];\n      var rotation10 = this._rotationMatrix[4];\n      var rotation11 = this._rotationMatrix[5];\n      var adjusted0 = this._rotationAdjusted[0];\n      var adjusted1 = this._rotationAdjusted[1];\n      var position0 = this._position[0];\n      var position1 = this._position[1]; // Commented assignments show what the values are when the matrix was\n      // instantiated. Those values will never change so they do not need to\n      // be reassigned.\n      modelMatrix[0] = scale0 * rotation00;\n      modelMatrix[1] = scale0 * rotation01; // modelMatrix[2] = 0;\n      // modelMatrix[3] = 0;\n      modelMatrix[4] = scale1 * rotation10;\n      modelMatrix[5] = scale1 * rotation11; // modelMatrix[6] = 0;\n      // modelMatrix[7] = 0;\n      // modelMatrix[8] = 0;\n      // modelMatrix[9] = 0;\n      // modelMatrix[10] = 1;\n      // modelMatrix[11] = 0;\n      modelMatrix[12] = rotation00 * adjusted0 + rotation10 * adjusted1 + position0;\n      modelMatrix[13] = rotation01 * adjusted0 + rotation11 * adjusted1 + position1; // modelMatrix[14] = 0;\n      // modelMatrix[15] = 1;\n      this._transformDirty = false;\n    }\n    /**\n     * Whether the Drawable needs convex hull points provided by the renderer.\n     * @return {boolean} True when no convex hull known, or it's dirty.\n     */\n  }, {\n    key: \"needsConvexHullPoints\",\n    value: function needsConvexHullPoints() {\n      return !this._convexHullPoints || this._convexHullDirty || this._convexHullPoints.length === 0;\n    }\n    /**\n     * Set the convex hull to be dirty.\n     * Do this whenever the Drawable's shape has possibly changed.\n     */\n  }, {\n    key: \"setConvexHullDirty\",\n    value: function setConvexHullDirty() {\n      this._convexHullDirty = true;\n    }\n    /**\n     * Set the convex hull points for the Drawable.\n     * @param {Array<Array<number>>} points Convex hull points, as [[x, y], ...]\n     */\n  }, {\n    key: \"setConvexHullPoints\",\n    value: function setConvexHullPoints(points) {\n      this._convexHullPoints = points;\n      this._convexHullDirty = false; // Re-create the \"transformed hull points\" array.\n      // We only do this when the hull points change to avoid unnecessary allocations and GC.\n      this._transformedHullPoints = [];\n      for (var i = 0; i < points.length; i++) {\n        this._transformedHullPoints.push(twgl.v3.create());\n      }\n      this._transformedHullDirty = true;\n    }\n    /**\n     * @function\n     * @name isTouching\n     * Check if the world position touches the skin.\n     * The caller is responsible for ensuring this drawable's inverse matrix & its skin's silhouette are up-to-date.\n     * @see updateCPURenderAttributes\n     * @param {twgl.v3} vec World coordinate vector.\n     * @return {boolean} True if the world position touches the skin.\n     */\n    // `updateCPURenderAttributes` sets this Drawable instance's `isTouching` method\n    // to one of the following three functions:\n    // If this drawable has no skin, set it to `_isTouchingNever`.\n    // Otherwise, if this drawable uses nearest-neighbor scaling at its current scale, set it to `_isTouchingNearest`.\n    // Otherwise, set it to `_isTouchingLinear`.\n    // This allows several checks to be moved from the `isTouching` function to `updateCPURenderAttributes`.\n    // eslint-disable-next-line no-unused-vars\n  }, {\n    key: \"_isTouchingNever\",\n    value: function _isTouchingNever(vec) {\n      return false;\n    }\n  }, {\n    key: \"_isTouchingNearest\",\n    value: function _isTouchingNearest(vec) {\n      return this.skin.isTouchingNearest(getLocalPosition(this, vec));\n    }\n  }, {\n    key: \"_isTouchingLinear\",\n    value: function _isTouchingLinear(vec) {\n      return this.skin.isTouchingLinear(getLocalPosition(this, vec));\n    }\n    /**\n     * Get the precise bounds for a Drawable.\n     * This function applies the transform matrix to the known convex hull,\n     * and then finds the minimum box along the axes.\n     * Before calling this, ensure the renderer has updated convex hull points.\n     * @param {?Rectangle} result optional destination for bounds calculation\n     * @return {!Rectangle} Bounds for a tight box around the Drawable.\n     */\n  }, {\n    key: \"getBounds\",\n    value: function getBounds(result) {\n      if (this.needsConvexHullPoints()) {\n        throw new Error('Needs updated convex hull points before bounds calculation.');\n      }\n      if (this._transformDirty) {\n        this._calculateTransform();\n      }\n      var transformedHullPoints = this._getTransformedHullPoints(); // Search through transformed points to generate box on axes.\n      result = result || new Rectangle();\n      result.initFromPointsAABB(transformedHullPoints);\n      return result;\n    }\n    /**\n     * Get the precise bounds for the upper 8px slice of the Drawable.\n     * Used for calculating where to position a text bubble.\n     * Before calling this, ensure the renderer has updated convex hull points.\n     * @param {?Rectangle} result optional destination for bounds calculation\n     * @return {!Rectangle} Bounds for a tight box around a slice of the Drawable.\n     */\n  }, {\n    key: \"getBoundsForBubble\",\n    value: function getBoundsForBubble(result) {\n      if (this.needsConvexHullPoints()) {\n        throw new Error('Needs updated convex hull points before bubble bounds calculation.');\n      }\n      if (this._transformDirty) {\n        this._calculateTransform();\n      }\n      var slice = 8; // px, how tall the top slice to measure should be.\n      var transformedHullPoints = this._getTransformedHullPoints();\n      var maxY = Math.max.apply(null, transformedHullPoints.map(function (p) {\n        return p[1];\n      }));\n      var filteredHullPoints = transformedHullPoints.filter(function (p) {\n        return p[1] > maxY - slice;\n      }); // Search through filtered points to generate box on axes.\n      result = result || new Rectangle();\n      result.initFromPointsAABB(filteredHullPoints);\n      return result;\n    }\n    /**\n     * Get the rough axis-aligned bounding box for the Drawable.\n     * Calculated by transforming the skin's bounds.\n     * Note that this is less precise than the box returned by `getBounds`,\n     * which is tightly snapped to account for a Drawable's transparent regions.\n     * `getAABB` returns a much less accurate bounding box, but will be much\n     * faster to calculate so may be desired for quick checks/optimizations.\n     * @param {?Rectangle} result optional destination for bounds calculation\n     * @return {!Rectangle} Rough axis-aligned bounding box for Drawable.\n     */\n  }, {\n    key: \"getAABB\",\n    value: function getAABB(result) {\n      if (this._transformDirty) {\n        this._calculateTransform();\n      }\n      var tm = this._uniforms.u_modelMatrix;\n      result = result || new Rectangle();\n      result.initFromModelMatrix(tm);\n      return result;\n    }\n    /**\n     * Return the best Drawable bounds possible without performing graphics queries.\n     * I.e., returns the tight bounding box when the convex hull points are already\n     * known, but otherwise return the rough AABB of the Drawable.\n     * @param {?Rectangle} result optional destination for bounds calculation\n     * @return {!Rectangle} Bounds for the Drawable.\n     */\n  }, {\n    key: \"getFastBounds\",\n    value: function getFastBounds(result) {\n      if (!this.needsConvexHullPoints()) {\n        return this.getBounds(result);\n      }\n      return this.getAABB(result);\n    }\n    /**\n     * Transform all the convex hull points by the current Drawable's\n     * transform. This allows us to skip recalculating the convex hull\n     * for many Drawable updates, including translation, rotation, scaling.\n     * @return {!Array.<!Array.number>} Array of glPoints which are Array<x, y>\n     * @private\n     */\n  }, {\n    key: \"_getTransformedHullPoints\",\n    value: function _getTransformedHullPoints() {\n      if (!this._transformedHullDirty) {\n        return this._transformedHullPoints;\n      }\n      var projection = twgl.m4.ortho(-1, 1, -1, 1, -1, 1);\n      var skinSize = this.skin.size;\n      var halfXPixel = 1 / skinSize[0] / 2;\n      var halfYPixel = 1 / skinSize[1] / 2;\n      var tm = twgl.m4.multiply(this._uniforms.u_modelMatrix, projection);\n      for (var i = 0; i < this._convexHullPoints.length; i++) {\n        var point = this._convexHullPoints[i];\n        var dstPoint = this._transformedHullPoints[i];\n        dstPoint[0] = 0.5 + -point[0] / skinSize[0] - halfXPixel;\n        dstPoint[1] = point[1] / skinSize[1] - 0.5 + halfYPixel;\n        twgl.m4.transformPoint(tm, dstPoint, dstPoint);\n      }\n      this._transformedHullDirty = false;\n      return this._transformedHullPoints;\n    }\n    /**\n     * Update the transform matrix and calculate it's inverse for collision\n     * and local texture position purposes.\n     */\n  }, {\n    key: \"updateMatrix\",\n    value: function updateMatrix() {\n      if (this._transformDirty) {\n        this._calculateTransform();\n      } // Get the inverse of the model matrix or update it.\n      if (this._inverseTransformDirty) {\n        var inverse = this._inverseMatrix;\n        twgl.m4.copy(this._uniforms.u_modelMatrix, inverse); // The normal matrix uses a z scaling of 0 causing model[10] to be\n        // 0. Getting a 4x4 inverse is impossible without a scaling in x, y,\n        // and z.\n        inverse[10] = 1;\n        twgl.m4.inverse(inverse, inverse);\n        this._inverseTransformDirty = false;\n      }\n    }\n    /**\n     * Update everything necessary to render this drawable on the CPU.\n     */\n  }, {\n    key: \"updateCPURenderAttributes\",\n    value: function updateCPURenderAttributes() {\n      this.updateMatrix(); // CPU rendering always occurs at the \"native\" size, so no need to scale up this._scale\n      if (this.skin) {\n        this.skin.updateSilhouette(this._scale);\n        if (this.skin.useNearest(this._scale, this)) {\n          this.isTouching = this._isTouchingNearest;\n        } else {\n          this.isTouching = this._isTouchingLinear;\n        }\n      } else {\n        log.warn(\"Could not find skin for drawable with id: \".concat(this._id));\n        this.isTouching = this._isTouchingNever;\n      }\n    }\n    /**\n     * Respond to an internal change in the current Skin.\n     * @private\n     */\n  }, {\n    key: \"_skinWasAltered\",\n    value: function _skinWasAltered() {\n      this._rotationCenterDirty = true;\n      this._skinScaleDirty = true;\n      this.setConvexHullDirty();\n      this.setTransformDirty();\n    }\n    /**\n     * Calculate a color to represent the given ID number. At least one component of\n     * the resulting color will be non-zero if the ID is not RenderConstants.ID_NONE.\n     * @param {int} id The ID to convert.\n     * @returns {Array<number>} An array of [r,g,b,a], each component in the range [0,1].\n     */\n  }, {\n    key: \"id\",\n    get: function get() {\n      return this._id;\n    }\n    /**\n     * @returns {Skin} the current skin for this Drawable.\n     */\n  }, {\n    key: \"skin\",\n    get: function get() {\n      return this._skin;\n    }\n    /**\n     * @param {Skin} newSkin - A new Skin for this Drawable.\n     */\n    ,\n    set: function set(newSkin) {\n      if (this._skin !== newSkin) {\n        if (this._skin) {\n          this._skin.removeListener(Skin.Events.WasAltered, this._skinWasAltered);\n        }\n        this._skin = newSkin;\n        if (this._skin) {\n          this._skin.addListener(Skin.Events.WasAltered, this._skinWasAltered);\n        }\n        this._skinWasAltered();\n      }\n    }\n    /**\n     * @returns {Array<number>} the current scaling percentages applied to this Drawable. [100,100] is normal size.\n     */\n  }, {\n    key: \"scale\",\n    get: function get() {\n      return [this._scale[0], this._scale[1]];\n    }\n  }], [{\n    key: \"color4fFromID\",\n    value: function color4fFromID(id) {\n      id -= RenderConstants.ID_NONE;\n      var r = (id >> 0 & 255) / 255.0;\n      var g = (id >> 8 & 255) / 255.0;\n      var b = (id >> 16 & 255) / 255.0;\n      return [r, g, b, 1.0];\n    }\n    /**\n     * Calculate the ID number represented by the given color. If all components of\n     * the color are zero, the result will be RenderConstants.ID_NONE; otherwise the result\n     * will be a valid ID.\n     * @param {int} r The red value of the color, in the range [0,255].\n     * @param {int} g The green value of the color, in the range [0,255].\n     * @param {int} b The blue value of the color, in the range [0,255].\n     * @returns {int} The ID represented by that color.\n     */\n  }, {\n    key: \"color3bToID\",\n    value: function color3bToID(r, g, b) {\n      var id;\n      id = (r & 255) << 0;\n      id |= (g & 255) << 8;\n      id |= (b & 255) << 16;\n      return id + RenderConstants.ID_NONE;\n    }\n    /**\n     * Sample a color from a drawable's texture.\n     * The caller is responsible for ensuring this drawable's inverse matrix & its skin's silhouette are up-to-date.\n     * @see updateCPURenderAttributes\n     * @param {twgl.v3} vec The scratch space [x,y] vector\n     * @param {Drawable} drawable The drawable to sample the texture from\n     * @param {Uint8ClampedArray} dst The \"color4b\" representation of the texture at point.\n     * @param {number} [effectMask] A bitmask for which effects to use. Optional.\n     * @returns {Uint8ClampedArray} The dst object filled with the color4b\n     */\n  }, {\n    key: \"sampleColor4b\",\n    value: function sampleColor4b(vec, drawable, dst, effectMask) {\n      var localPosition = getLocalPosition(drawable, vec);\n      if (localPosition[0] < 0 || localPosition[1] < 0 || localPosition[0] > 1 || localPosition[1] > 1) {\n        dst[0] = 0;\n        dst[1] = 0;\n        dst[2] = 0;\n        dst[3] = 0;\n        return dst;\n      }\n      var textColor = // commenting out to only use nearest for now\n      // drawable.skin.useNearest(drawable._scale, drawable) ?\n      drawable.skin._silhouette.colorAtNearest(localPosition, dst); // : drawable.skin._silhouette.colorAtLinear(localPosition, dst);\n      if (drawable.enabledEffects === 0) return textColor;\n      return EffectTransform.transformColor(drawable, textColor, effectMask);\n    }\n  }]);\n  return Drawable;\n}();\nmodule.exports = Drawable;\n })