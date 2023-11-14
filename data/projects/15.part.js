/* 15 */
 (function(module, exports, __webpack_require__) {
"use strict";
eval("\nvar _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };\nvar classNames = __webpack_require__(5);\nvar omit = __webpack_require__(14);\nvar PropTypes = __webpack_require__(1);\nvar React = __webpack_require__(0);\n__webpack_require__(35);\nvar Button = function Button(props) {\n    var classes = classNames('button', props.className);\n    return React.createElement(\n        'button',\n        _extends({\n            className: classes\n        }, omit(props, ['className', 'children'])),\n        props.children\n    );\n};\nButton.propTypes = {\n    children: PropTypes.node,\n    className: PropTypes.string\n};\nmodule.exports = Button;\n// ./src/components/forms/button.jsx\n// module id = 15\n// module chunks = 0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 41 42\n//# sourceURL=scratch:///./src/components/forms/button.jsx?");
 })