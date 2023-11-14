/* 93 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return call && (typeof call === \"object\" || typeof call === \"function\") ? call : self; }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function, not \" + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }\n\nvar bindAll = __webpack_require__(9);\nvar FormattedMessage = __webpack_require__(4).FormattedMessage;\nvar PropTypes = __webpack_require__(1);\nvar React = __webpack_require__(0);\n\nvar Form = __webpack_require__(22);\nvar Input = __webpack_require__(24);\nvar Button = __webpack_require__(15);\nvar Spinner = __webpack_require__(38);\nvar FlexRow = __webpack_require__(12);\n\n__webpack_require__(123);\n\nvar Login = function (_React$Component) {\n    _inherits(Login, _React$Component);\n\n    function Login(props) {\n        _classCallCheck(this, Login);\n\n        var _this = _possibleConstructorReturn(this, (Login.__proto__ || Object.getPrototypeOf(Login)).call(this, props));\n\n        bindAll(_this, ['handleSubmit']);\n        _this.state = {\n            waiting: false\n        };\n        return _this;\n    }\n\n    _createClass(Login, [{\n        key: 'handleSubmit',\n        value: function handleSubmit(formData) {\n            var _this2 = this;\n\n            this.setState({ waiting: true });\n            this.props.onLogIn(formData, function () {\n                _this2.setState({ waiting: false });\n            });\n        }\n    }, {\n        key: 'render',\n        value: function render() {\n            var error = void 0;\n            if (this.props.error) {\n                error = React.createElement(\n                    'div',\n                    { className: 'error' },\n                    this.props.error\n                );\n            }\n            return React.createElement(\n                'div',\n                { className: 'login' },\n                React.createElement(\n                    Form,\n                    { onSubmit: this.handleSubmit },\n                    React.createElement(\n                        'label',\n                        {\n                            htmlFor: 'username',\n                            key: 'usernameLabel'\n                        },\n                        React.createElement(FormattedMessage, { id: 'general.username' })\n                    ),\n                    React.createElement(Input, {\n                        required: true,\n                        key: 'usernameInput',\n                        maxLength: '30',\n                        name: 'username',\n                        type: 'text'\n                    }),\n                    React.createElement(\n                        'label',\n                        {\n                            htmlFor: 'password',\n                            key: 'passwordLabel'\n                        },\n                        React.createElement(FormattedMessage, { id: 'general.password' })\n                    ),\n                    React.createElement(Input, {\n                        required: true,\n                        key: 'passwordInput',\n                        name: 'password',\n                        type: 'password'\n                    }),\n                    React.createElement(\n                        FlexRow,\n                        { className: 'submit-row' },\n                        this.state.waiting ? [React.createElement(\n                            Button,\n                            {\n                                className: 'submit-button white',\n                                disabled: 'disabled',\n                                key: 'submitButton',\n                                type: 'submit'\n                            },\n                            React.createElement(Spinner, {\n                                className: 'spinner',\n                                color: 'blue'\n                            })\n                        )] : [React.createElement(\n                            Button,\n                            {\n                                className: 'submit-button white',\n                                key: 'submitButton',\n                                type: 'submit'\n                            },\n                            React.createElement(FormattedMessage, { id: 'general.signIn' })\n                        )],\n                        React.createElement(\n                            'a',\n                            {\n                                href: '/accounts/password_reset/',\n                                key: 'passwordResetLink'\n                            },\n                            React.createElement(FormattedMessage, { id: 'login.needHelp' })\n                        )\n                    ),\n                    error\n                )\n            );\n        }\n    }]);\n\n    return Login;\n}(React.Component);\n\nLogin.propTypes = {\n    error: PropTypes.string,\n    onLogIn: PropTypes.func\n};\n\nmodule.exports = Login;\n\n//////////////////\n// WEBPACK FOOTER\n// ./src/components/login/login.jsx\n// module id = 93\n// module chunks = 0 1 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39\n\n//# sourceURL=scratch:///./src/components/login/login.jsx?");

/***/ })