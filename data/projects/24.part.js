/* 24 */
 (function(module, exports, __webpack_require__) {
"use strict";
eval("\nvar _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };\nfunction _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }\nvar classNames = __webpack_require__(5);\nvar FRCInput = __webpack_require__(112).Input;\nvar omit = __webpack_require__(14);\nvar PropTypes = __webpack_require__(1);\nvar React = __webpack_require__(0);\nvar defaultValidationHOC = __webpack_require__(62).defaultValidationHOC;\nvar inputHOC = __webpack_require__(131);\n__webpack_require__(58);\n__webpack_require__(61);\nvar Input = function Input(_ref) {\n    var className = _ref.className,\n        label = _ref.label,\n        props = _objectWithoutProperties(_ref, ['className', 'label']);\n    return React.createElement(FRCInput, _extends({\n        className: 'input',\n        label: label,\n        rowClassName: classNames(className, { 'no-label': typeof label === 'undefined' })\n    }, omit(props, ['className'])));\n};\nInput.propTypes = {\n    className: PropTypes.string,\n    label: PropTypes.string\n};\nmodule.exports = inputHOC(defaultValidationHOC(Input));\n// ./src/components/forms/input.jsx\n// module id = 24\n// module chunks = 0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39\n//# sourceURL=scratch:///./src/components/forms/input.jsx?");
 })