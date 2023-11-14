/* 67 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar PropTypes = __webpack_require__(1);\nvar React = __webpack_require__(0);\nvar connect = __webpack_require__(13).connect;\n\nvar Login = __webpack_require__(93);\n\n__webpack_require__(34);\n\nvar ConnectedLogin = function ConnectedLogin(_ref) {\n    var error = _ref.error,\n        onLogIn = _ref.onLogIn;\n    return React.createElement(Login, {\n        error: error,\n        key: 'login-dropdown-presentation',\n        onLogIn: onLogIn\n    });\n};\n\nConnectedLogin.propTypes = {\n    error: PropTypes.string,\n    onLogIn: PropTypes.func\n};\n\nvar mapStateToProps = function mapStateToProps(state) {\n    return {\n        error: state.navigation && state.navigation.loginError\n    };\n};\n\nvar mapDispatchToProps = function mapDispatchToProps() {\n    return {};\n};\n\nmodule.exports = connect(mapStateToProps, mapDispatchToProps)(ConnectedLogin);\n\n//////////////////\n// WEBPACK FOOTER\n// ./src/components/login/connected-login.jsx\n// module id = 67\n// module chunks = 0 1 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39\n\n//# sourceURL=scratch:///./src/components/login/connected-login.jsx?");

/***/ })