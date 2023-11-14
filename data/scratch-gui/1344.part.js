/* 1344 */\n (function(module, exports, __webpack_require__) {\n\"use strict\";\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nvar _react = __webpack_require__(1);\nvar _react2 = _interopRequireDefault(_react);\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\nvar Tip = function Tip(props) {\n  var direction = props.direction;\n  var size = props.size || 24;\n  var isPortrait = direction === \"up\" || direction === \"down\";\n  var mainLength = size;\n  var crossLength = size * 2;\n  var points = direction === \"up\" ? \"0,\" + mainLength + \" \" + mainLength + \",0, \" + crossLength + \",\" + mainLength : direction === \"down\" ? \"0,0 \" + mainLength + \",\" + mainLength + \", \" + crossLength + \",0\" : direction === \"left\" ? mainLength + \",0 0,\" + mainLength + \", \" + mainLength + \",\" + crossLength : \"0,0 \" + mainLength + \",\" + mainLength + \", 0,\" + crossLength;\n  var svgProps = {\n    className: \"Popover-tip\",\n    width: isPortrait ? crossLength : mainLength,\n    height: isPortrait ? mainLength : crossLength\n  };\n  return _react2.default.createElement(\n    \"svg\",\n    svgProps,\n    _react2.default.createElement(\"polygon\", { className: \"Popover-tipShape\", points: points })\n  );\n};\nexports.default = Tip;\n })