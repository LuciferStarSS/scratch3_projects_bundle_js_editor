/* 256 */\n (function(module, __webpack_exports__, __webpack_require__) {\n\"use strict\";\n(function(process) { var prop_types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);\n var prop_types__WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_0__);\n var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1);\n var react__WEBPACK_IMPORTED_MODULE_1___default = __webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n var react_style_proptype__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(162);\n var react_style_proptype__WEBPACK_IMPORTED_MODULE_2___default = __webpack_require__.n(react_style_proptype__WEBPACK_IMPORTED_MODULE_2__);\nfunction ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }\nfunction _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }\nfunction _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }\nfunction _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }\nfunction _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }\n/* DO NOT EDIT\n@todo This file is copied from GUI and should be pulled out into a shared library.\nSee https://github.com/LLK/scratch-paint/issues/13 */\n\nvar getRandomColor = function () {\n  // In \"DEBUG\" mode this is used to output a random background color for each\n  // box. The function gives the same \"random\" set for each seed, allowing re-\n  // renders of the same content to give the same random display.\n  var random = function (seed) {\n    var mW = seed;\n    var mZ = 987654321;\n    var mask = 0xffffffff;\n    return function () {\n      mZ = 36969 * (mZ & 65535) + (mZ >> 16) & mask;\n      mW = 18000 * (mW & 65535) + (mW >> 16) & mask;\n      var result = (mZ << 16) + mW & mask;\n      result /= 4294967296;\n      return result + 1;\n    };\n  }(601);\n  return function () {\n    var r = Math.max(parseInt(random() * 100, 10) % 256, 1);\n    var g = Math.max(parseInt(random() * 100, 10) % 256, 1);\n    var b = Math.max(parseInt(random() * 100, 10) % 256, 1);\n    return \"rgb(\".concat(r, \",\").concat(g, \",\").concat(b, \")\");\n  };\n}();\nvar Box = function Box(props) {\n  var alignContent = props.alignContent,\n      alignItems = props.alignItems,\n      alignSelf = props.alignSelf,\n      basis = props.basis,\n      children = props.children,\n      className = props.className,\n      componentRef = props.componentRef,\n      direction = props.direction,\n      element = props.element,\n      grow = props.grow,\n      height = props.height,\n      justifyContent = props.justifyContent,\n      width = props.width,\n      wrap = props.wrap,\n      shrink = props.shrink,\n      style = props.style,\n      componentProps = _objectWithoutProperties(props, [\"alignContent\", \"alignItems\", \"alignSelf\", \"basis\", \"children\", \"className\", \"componentRef\", \"direction\", \"element\", \"grow\", \"height\", \"justifyContent\", \"width\", \"wrap\", \"shrink\", \"style\"]);\n  return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(element, _objectSpread({\n    className: className,\n    ref: componentRef,\n    style: Object.assign({\n      alignContent: alignContent,\n      alignItems: alignItems,\n      alignSelf: alignSelf,\n      flexBasis: basis,\n      flexDirection: direction,\n      flexGrow: grow,\n      flexShrink: shrink,\n      flexWrap: wrap,\n      justifyContent: justifyContent,\n      width: width,\n      height: height\n    }, process.env.DEBUG ? {\n      // eslint-disable-line no-undef\n      backgroundColor: getRandomColor(),\n      outline: \"1px solid black\"\n    } : {}, style)\n  }, componentProps), children);\n};\nBox.propTypes = {\n  /** Defines how the browser distributes space between and around content items vertically within this box. */\n  alignContent: prop_types__WEBPACK_IMPORTED_MODULE_0___default.a.oneOf(['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'stretch']),\n  /** Defines how the browser distributes space between and around flex items horizontally within this box. */\n  alignItems: prop_types__WEBPACK_IMPORTED_MODULE_0___default.a.oneOf(['flex-start', 'flex-end', 'center', 'baseline', 'stretch']),\n  /** Specifies how this box should be aligned inside of its container (requires the container to be flexable). */\n  alignSelf: prop_types__WEBPACK_IMPORTED_MODULE_0___default.a.oneOf(['auto', 'flex-start', 'flex-end', 'center', 'baseline', 'stretch']),\n  /** Specifies the initial length of this box */\n  basis: prop_types__WEBPACK_IMPORTED_MODULE_0___default.a.oneOfType([prop_types__WEBPACK_IMPORTED_MODULE_0___default.a.number, prop_types__WEBPACK_IMPORTED_MODULE_0___default.a.oneOf(['auto'])]),\n  /** Specifies the the HTML nodes which will be child elements of this box. */\n  children: prop_types__WEBPACK_IMPORTED_MODULE_0___default.a.node,\n  /** Specifies the class name that will be set on this box */\n  className: prop_types__WEBPACK_IMPORTED_MODULE_0___default.a.string,\n  /**\n   * A callback function whose first parameter is the underlying dom elements.\n   * This call back will be executed immediately after the component is mounted or unmounted\n   */\n  componentRef: prop_types__WEBPACK_IMPORTED_MODULE_0___default.a.func,\n  /** https://developer.mozilla.org/en-US/docs/Web/CSS/flex-direction */\n  direction: prop_types__WEBPACK_IMPORTED_MODULE_0___default.a.oneOf(['row', 'row-reverse', 'column', 'column-reverse']),\n  /** Specifies the type of HTML element of this box. Defaults to div. */\n  element: prop_types__WEBPACK_IMPORTED_MODULE_0___default.a.string,\n  /** Specifies the flex grow factor of a flex item. */\n  grow: prop_types__WEBPACK_IMPORTED_MODULE_0___default.a.number,\n  /** The height in pixels (if specified as a number) or a string if different units are required. */\n  height: prop_types__WEBPACK_IMPORTED_MODULE_0___default.a.oneOfType([prop_types__WEBPACK_IMPORTED_MODULE_0___default.a.number, prop_types__WEBPACK_IMPORTED_MODULE_0___default.a.string]),\n  /** https://developer.mozilla.org/en-US/docs/Web/CSS/justify-content */\n  justifyContent: prop_types__WEBPACK_IMPORTED_MODULE_0___default.a.oneOf(['flex-start', 'flex-end', 'center', 'space-between', 'space-around']),\n  /** Specifies the flex shrink factor of a flex item. */\n  shrink: prop_types__WEBPACK_IMPORTED_MODULE_0___default.a.number,\n  /** An object whose keys are css property names and whose values correspond the the css property. */\n  style: react_style_proptype__WEBPACK_IMPORTED_MODULE_2___default.a,\n  /** The width in pixels (if specified as a number) or a string if different units are required. */\n  width: prop_types__WEBPACK_IMPORTED_MODULE_0___default.a.oneOfType([prop_types__WEBPACK_IMPORTED_MODULE_0___default.a.number, prop_types__WEBPACK_IMPORTED_MODULE_0___default.a.string]),\n  /** How whitespace should wrap within this block. */\n  wrap: prop_types__WEBPACK_IMPORTED_MODULE_0___default.a.oneOf(['nowrap', 'wrap', 'wrap-reverse'])\n};\nBox.defaultProps = {\n  element: 'div',\n  style: {}\n};\n/* harmony default export */ __webpack_exports__[\"a\"] = (Box);\n}.call(this, __webpack_require__(93)))\n })