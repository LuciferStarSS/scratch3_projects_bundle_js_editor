/* 38 */
 (function(module, exports, __webpack_require__) {
"use strict";
eval("\nvar React = __webpack_require__(0);\nvar PropTypes = __webpack_require__(1);\nvar classNames = __webpack_require__(5);\n__webpack_require__(59);\n// Adapted from http://tobiasahlin.com/spinkit/\nvar Spinner = function Spinner(_ref) {\n    var className = _ref.className,\n        color = _ref.color;\n    return React.createElement('img', {\n        alt: 'loading animation',\n        className: classNames('studio-status-icon-spinner', className),\n        src: '/svgs/modal/spinner-' + color + '.svg'\n    });\n};\nSpinner.defaultProps = {\n    color: 'white'\n};\nSpinner.propTypes = {\n    className: PropTypes.string,\n    color: PropTypes.oneOf(['white', 'blue', 'transparent-gray'])\n};\nmodule.exports = Spinner;\n// ./src/components/spinner/spinner.jsx\n// module id = 38\n// module chunks = 0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39\n//# sourceURL=scratch:///./src/components/spinner/spinner.jsx?");
 })