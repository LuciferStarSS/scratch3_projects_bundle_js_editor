/* 92 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar PropTypes = __webpack_require__(1);\nvar React = __webpack_require__(0);\nvar connect = __webpack_require__(13).connect;\n\nvar navigationActions = __webpack_require__(16);\nvar Dropdown = __webpack_require__(31);\nvar ConnectedLogin = __webpack_require__(67);\n\n__webpack_require__(34);\n\nvar LoginDropdown = function LoginDropdown(_ref) {\n    var isOpen = _ref.isOpen,\n        onClose = _ref.onClose,\n        onLogIn = _ref.onLogIn;\n    return React.createElement(\n        Dropdown,\n        {\n            className: 'with-arrow',\n            isOpen: isOpen,\n            key: 'login-dropdown',\n            onRequestClose: onClose\n        },\n        React.createElement(ConnectedLogin, {\n            onLogIn: onLogIn\n        })\n    );\n};\n\nLoginDropdown.propTypes = {\n    isOpen: PropTypes.bool,\n    onClose: PropTypes.func,\n    onLogIn: PropTypes.func\n};\n\nvar mapStateToProps = function mapStateToProps(state) {\n    return {\n        isOpen: state.navigation && state.navigation.loginOpen\n    };\n};\n\nvar mapDispatchToProps = function mapDispatchToProps(dispatch) {\n    return {\n        onClose: function onClose() {\n            dispatch(navigationActions.setLoginOpen(false));\n        },\n        onLogIn: function onLogIn(formData, callback) {\n            dispatch(navigationActions.handleLogIn(formData, callback));\n        }\n    };\n};\n\nmodule.exports = connect(mapStateToProps, mapDispatchToProps)(LoginDropdown);\n\n//////////////////\n// WEBPACK FOOTER\n// ./src/components/login/login-dropdown.jsx\n// module id = 92\n// module chunks = 0 1 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39\n\n//# sourceURL=scratch:///./src/components/login/login-dropdown.jsx?");

/***/ })