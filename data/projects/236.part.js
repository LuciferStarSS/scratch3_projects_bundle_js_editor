/* 236 */
 (function(module, exports, __webpack_require__) {
"use strict";
eval("\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\nfunction _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return call && (typeof call === \"object\" || typeof call === \"function\") ? call : self; }\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function, not \" + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }\nvar bindAll = __webpack_require__(9);\nvar PropTypes = __webpack_require__(1);\nvar React = __webpack_require__(0);\nvar Captcha = function (_React$Component) {\n    _inherits(Captcha, _React$Component);\n    function Captcha(props) {\n        _classCallCheck(this, Captcha);\n        var _this = _possibleConstructorReturn(this, (Captcha.__proto__ || Object.getPrototypeOf(Captcha)).call(this, props));\n        bindAll(_this, ['setCaptchaRef', 'onCaptchaLoad', 'executeCaptcha']);\n        return _this;\n    }\n    _createClass(Captcha, [{\n        key: 'componentDidMount',\n        value: function componentDidMount() {\n            if (window.grecaptcha) {\n                this.onCaptchaLoad();\n            } else {\n                // If grecaptcha doesn't exist on window, we havent loaded the captcha js yet. Load it.\n                // ReCaptcha calls a callback when the grecatpcha object is usable. That callback\n                // needs to be global so set it on the window.\n                window.grecaptchaOnLoad = this.onCaptchaLoad;\n                // Load Google ReCaptcha script.\n                var script = document.createElement('script');\n                script.async = true;\n                script.onerror = this.props.onCaptchaError;\n                script.src = 'https://www.recaptcha.net/recaptcha/api.js?onload=grecaptchaOnLoad&render=explicit&hl=' + window._locale;\n                document.body.appendChild(script);\n            }\n        }\n    }, {\n        key: 'componentWillUnmount',\n        value: function componentWillUnmount() {\n            window.grecaptchaOnLoad = null;\n        }\n    }, {\n        key: 'onCaptchaLoad',\n        value: function onCaptchaLoad() {\n            // Let the owner of this component do some work\n            // when captcha is done loading (e.g. enabling a button)\n            this.props.onCaptchaLoad();\n            this.grecaptcha = window.grecaptcha;\n            if (!this.grecaptcha) {\n                // According to the reCaptcha documentation, this callback shouldn't get\n                // called unless window.grecaptcha exists. This is just here to be extra defensive.\n                this.props.onCaptchaError();\n                return;\n            }\n            this.widgetId = this.grecaptcha.render(this.captchaRef, {\n                callback: this.props.onCaptchaSolved,\n                sitekey: \"6Lf6kK4UAAAAABKTyvdSqgcSVASEnMrCquiAkjVW\"\n            }, true);\n        }\n    }, {\n        key: 'setCaptchaRef',\n        value: function setCaptchaRef(ref) {\n            this.captchaRef = ref;\n        }\n    }, {\n        key: 'executeCaptcha',\n        value: function executeCaptcha() {\n            this.grecaptcha.execute(this.widgetId);\n        }\n    }, {\n        key: 'render',\n        value: function render() {\n            return React.createElement('div', {\n                className: 'g-recaptcha',\n                'data-badge': 'bottomright',\n                'data-sitekey': \"6Lf6kK4UAAAAABKTyvdSqgcSVASEnMrCquiAkjVW\",\n                'data-size': 'invisible',\n                ref: this.setCaptchaRef\n            });\n        }\n    }]);\n    return Captcha;\n}(React.Component);\nCaptcha.propTypes = {\n    onCaptchaError: PropTypes.func.isRequired,\n    onCaptchaLoad: PropTypes.func.isRequired,\n    onCaptchaSolved: PropTypes.func.isRequired\n};\nmodule.exports = Captcha;\n// ./src/components/captcha/captcha.jsx\n// module id = 236\n// module chunks = 0 1 2 3 4 5 6\n//# sourceURL=scratch:///./src/components/captcha/captcha.jsx?");
 })