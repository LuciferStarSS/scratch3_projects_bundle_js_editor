/* 584 */
 (function(module, exports, __webpack_require__) {
"use strict";
eval("\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\nfunction _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return call && (typeof call === \"object\" || typeof call === \"function\") ? call : self; }\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function, not \" + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }\nvar bindAll = __webpack_require__(9);\nvar connect = __webpack_require__(13).connect;\nvar defaults = __webpack_require__(247);\nvar PropTypes = __webpack_require__(1);\nvar React = __webpack_require__(0);\nvar api = __webpack_require__(143);\nvar injectIntl = __webpack_require__(149).injectIntl;\nvar intlShape = __webpack_require__(149).intlShape;\nvar sessionActions = __webpack_require__(136);\nvar validate = __webpack_require__(453);\nvar Progression = __webpack_require__(186);\nvar UsernameStep = __webpack_require__(587);\nvar BirthDateStep = __webpack_require__(580);\nvar GenderStep = __webpack_require__(583);\nvar CountryStep = __webpack_require__(581);\nvar EmailStep = __webpack_require__(582);\nvar WelcomeStep = __webpack_require__(588);\nvar RegistrationErrorStep = __webpack_require__(586);\nvar JoinFlow = function (_React$Component) {\n    _inherits(JoinFlow, _React$Component);\n    function JoinFlow(props) {\n        _classCallCheck(this, JoinFlow);\n        var _this = _possibleConstructorReturn(this, (JoinFlow.__proto__ || Object.getPrototypeOf(JoinFlow)).call(this, props));\n        bindAll(_this, ['handleAdvanceStep', 'handleCaptchaError', 'handleErrorNext', 'handlePrepareToRegister', 'handleRegistrationResponse', 'handleSubmitRegistration']);\n        _this.initialState = {\n            numAttempts: 0,\n            formData: {},\n            registrationError: null,\n            step: 0,\n            waiting: false\n        };\n        // it's ok to set state by reference, because state is treated as immutable,\n        // so any changes to its fields will result in a new state which does not\n        // reference its past fields\n        _this.state = _this.initialState;\n        return _this;\n    }\n    _createClass(JoinFlow, [{\n        key: 'canTryAgain',\n        value: function canTryAgain() {\n            return this.state.registrationError.errorAllowsTryAgain && this.state.numAttempts <= 1;\n        }\n    }, {\n        key: 'handleCaptchaError',\n        value: function handleCaptchaError() {\n            this.setState({\n                registrationError: {\n                    errorAllowsTryAgain: false,\n                    errorMsg: this.props.intl.formatMessage({\n                        id: 'registration.errorCaptcha'\n                    })\n                }\n            });\n        }\n    }, {\n        key: 'handlePrepareToRegister',\n        value: function handlePrepareToRegister(newFormData) {\n            var _this2 = this;\n            newFormData = newFormData || {};\n            var newState = {\n                formData: defaults({}, newFormData, this.state.formData)\n            };\n            this.setState(newState, function () {\n                _this2.handleSubmitRegistration(_this2.state.formData);\n            });\n        }\n    }, {\n        key: 'getErrorsFromResponse',\n        value: function getErrorsFromResponse(err, body, res) {\n            var errorsFromResponse = [];\n            if (!err && res.statusCode === 200 && body && body[0]) {\n                var responseBodyErrors = body[0].errors;\n                if (responseBodyErrors) {\n                    Object.keys(responseBodyErrors).forEach(function (fieldName) {\n                        var errorStrs = responseBodyErrors[fieldName];\n                        errorStrs.forEach(function (errorStr) {\n                            errorsFromResponse.push({ fieldName: fieldName, errorStr: errorStr });\n                        });\n                    });\n                }\n            }\n            return errorsFromResponse;\n        }\n    }, {\n        key: 'getCustomErrMsg',\n        value: function getCustomErrMsg(errorsFromResponse) {\n            if (!errorsFromResponse || errorsFromResponse.length === 0) return null;\n            var customErrMsg = '';\n            // body can include zero or more error objects. Here we assemble\n            // all of them into a single string, customErrMsg.\n            errorsFromResponse.forEach(function (errorFromResponse) {\n                if (customErrMsg.length) customErrMsg += '; ';\n                customErrMsg += errorFromResponse.fieldName + ': ' + errorFromResponse.errorStr;\n            });\n            var problemsStr = this.props.intl.formatMessage({ id: 'registration.problemsAre' });\n            return problemsStr + ': \"' + customErrMsg + '\"';\n        }\n    }, {\n        key: 'registrationIsSuccessful',\n        value: function registrationIsSuccessful(err, body, res) {\n            return !!(!err && res.statusCode === 200 && body && body[0] && body[0].success);\n        }\n        // example of failing response:\n        // [\n        //   {\n        //     \"msg\": \"This field is required.\",\n        //     \"errors\": {\n        //       \"username\": [\"This field is required.\"],\n        //       \"recaptcha\": [\"Incorrect, please try again.\"]\n        //     },\n        //     \"success\": false\n        //   }\n        // ]\n        //\n        // username messages:\n        //   * \"username\": [\"username exists\"]\n        //   * \"username\": [\"invalid username\"] (length, charset)\n        //   * \"username\": [\"bad username\"] (cleanspeak)\n        // password messages:\n        //   * \"password\": [\"Ensure this value has at least 6 characters (it has LENGTH_NUM_HERE).\"]\n        // recaptcha messages:\n        //   * \"recaptcha\": [\"This field is required.\"]\n        //   * \"recaptcha\": [\"Incorrect, please try again.\"]\n        //   * \"recaptcha\": [some timeout message?]\n        // other messages:\n        //   * \"birth_month\": [\"Ensure this value is less than or equal to 12.\"]\n        //   * \"birth_month\": [\"Ensure this value is greater than or equal to 1.\"]\n    }, {\n        key: 'handleRegistrationResponse',\n        value: function handleRegistrationResponse(err, body, res) {\n            var _this3 = this;\n            this.setState({\n                numAttempts: this.state.numAttempts + 1\n            }, function () {\n                var success = _this3.registrationIsSuccessful(err, body, res);\n                if (success) {\n                    _this3.props.refreshSessionWithRetry().then(function () {\n                        _this3.setState({\n                            step: _this3.state.step + 1,\n                            waiting: false\n                        });\n                    });\n                    return;\n                }\n                // now we know something went wrong -- either an actual error (client-side\n                // or server-side), or just a problem with the registration content.\n                // if an actual error, prompt user to try again.\n                if (err || res.statusCode !== 200) {\n                    _this3.setState({\n                        registrationError: { errorAllowsTryAgain: true },\n                        waiting: false\n                    });\n                    return;\n                }\n                // now we know there was a problem with the registration content.\n                // If the server provided us info on why registration failed,\n                // build a summary explanation string\n                var errorMsg = null;\n                var errorsFromResponse = _this3.getErrorsFromResponse(err, body, res);\n                // if there was exactly one error, check if we have a pre-written message\n                // about that precise error\n                if (errorsFromResponse.length === 1) {\n                    var singleErrMsgId = validate.responseErrorMsg(errorsFromResponse[0].fieldName, errorsFromResponse[0].errorStr);\n                    if (singleErrMsgId) {\n                        // one error that we have a predefined explanation string for\n                        errorMsg = _this3.props.intl.formatMessage({ id: singleErrMsgId });\n                    }\n                }\n                // if we have more than one error, build a custom message with all of the\n                // server-provided error messages\n                if (!errorMsg && errorsFromResponse.length > 0) {\n                    errorMsg = _this3.getCustomErrMsg(errorsFromResponse);\n                }\n                _this3.setState({\n                    registrationError: {\n                        errorAllowsTryAgain: false,\n                        errorMsg: errorMsg\n                    },\n                    waiting: false\n                });\n            });\n        }\n    }, {\n        key: 'handleSubmitRegistration',\n        value: function handleSubmitRegistration(formData) {\n            var _this4 = this;\n            this.setState({\n                registrationError: null, // clear any existing error\n                waiting: true\n            }, function () {\n                api({\n                    host: '',\n                    uri: '/accounts/register_new_user/',\n                    method: 'post',\n                    useCsrf: true,\n                    formData: {\n                        'username': formData.username,\n                        'email': formData.email,\n                        'password': formData.password,\n                        'birth_month': formData.birth_month,\n                        'birth_year': formData.birth_year,\n                        'g-recaptcha-response': formData['g-recaptcha-response'],\n                        'gender': formData.gender,\n                        'country': formData.country,\n                        'is_robot': formData.yesno\n                        // no need to include csrfmiddlewaretoken; will be provided in\n                        // X-CSRFToken header, which scratchr2 looks for in\n                        // scratchr2/middleware/csrf.py line 237.\n                    }\n                }, function (err, body, res) {\n                    _this4.handleRegistrationResponse(err, body, res);\n                });\n            });\n        }\n    }, {\n        key: 'handleAdvanceStep',\n        value: function handleAdvanceStep(newFormData) {\n            newFormData = newFormData || {};\n            this.setState({\n                formData: defaults({}, newFormData, this.state.formData),\n                step: this.state.step + 1\n            });\n        }\n    }, {\n        key: 'handleErrorNext',\n        value: function handleErrorNext() {\n            if (this.canTryAgain()) {\n                this.handleSubmitRegistration(this.state.formData);\n            } else {\n                this.resetState();\n            }\n        }\n    }, {\n        key: 'resetState',\n        value: function resetState() {\n            this.setState(this.initialState);\n        }\n    }, {\n        key: 'sendAnalytics',\n        value: function sendAnalytics(path) {\n            var gaID = window.GA_ID;\n            if (!window.ga) {\n                return;\n            }\n            window.ga('send', {\n                hitType: 'pageview',\n                page: path,\n                tid: gaID\n            });\n        }\n    }, {\n        key: 'render',\n        value: function render() {\n            return React.createElement(\n                React.Fragment,\n                null,\n                this.state.registrationError ? React.createElement(RegistrationErrorStep, {\n                    canTryAgain: this.canTryAgain(),\n                    errorMsg: this.state.registrationError.errorMsg,\n                    sendAnalytics: this.sendAnalytics\n                    /* eslint-disable react/jsx-no-bind */\n                    , onSubmit: this.handleErrorNext\n                    /* eslint-enable react/jsx-no-bind */\n                }) : React.createElement(\n                    Progression,\n                    { step: this.state.step },\n                    React.createElement(UsernameStep, {\n                        sendAnalytics: this.sendAnalytics,\n                        onNextStep: this.handleAdvanceStep\n                    }),\n                    React.createElement(CountryStep, {\n                        sendAnalytics: this.sendAnalytics,\n                        onNextStep: this.handleAdvanceStep\n                    }),\n                    React.createElement(BirthDateStep, {\n                        sendAnalytics: this.sendAnalytics,\n                        onNextStep: this.handleAdvanceStep\n                    }),\n                    React.createElement(GenderStep, {\n                        sendAnalytics: this.sendAnalytics,\n                        onNextStep: this.handleAdvanceStep\n                    }),\n                    React.createElement(EmailStep, {\n                        sendAnalytics: this.sendAnalytics,\n                        waiting: this.state.waiting,\n                        onCaptchaError: this.handleCaptchaError,\n                        onNextStep: this.handlePrepareToRegister\n                    }),\n                    React.createElement(WelcomeStep, {\n                        createProjectOnComplete: this.props.createProjectOnComplete,\n                        email: this.state.formData.email,\n                        sendAnalytics: this.sendAnalytics,\n                        username: this.state.formData.username,\n                        onNextStep: this.props.onCompleteRegistration\n                    })\n                )\n            );\n        }\n    }]);\n    return JoinFlow;\n}(React.Component);\nJoinFlow.propTypes = {\n    createProjectOnComplete: PropTypes.bool,\n    intl: intlShape,\n    onCompleteRegistration: PropTypes.func,\n    refreshSessionWithRetry: PropTypes.func\n};\nvar IntlJoinFlow = injectIntl(JoinFlow);\nvar mapDispatchToProps = function mapDispatchToProps(dispatch) {\n    return {\n        refreshSessionWithRetry: function refreshSessionWithRetry() {\n            return dispatch(sessionActions.refreshSessionWithRetry());\n        }\n    };\n};\n// Allow incoming props to override redux-provided props. Used to mock in tests.\nvar mergeProps = function mergeProps(stateProps, dispatchProps, ownProps) {\n    return Object.assign({}, stateProps, dispatchProps, ownProps);\n};\nvar ConnectedJoinFlow = connect(function () {\n    return {};\n}, mapDispatchToProps, mergeProps)(IntlJoinFlow);\nmodule.exports = ConnectedJoinFlow;\n// ./src/components/join-flow/join-flow.jsx\n// module id = 584\n// module chunks = 0 1\n//# sourceURL=scratch:///./src/components/join-flow/join-flow.jsx?");
 })