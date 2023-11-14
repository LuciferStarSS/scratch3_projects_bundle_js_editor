/* 42 */
 (function(module, exports, __webpack_require__) {
"use strict";
eval("\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\nfunction _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return call && (typeof call === \"object\" || typeof call === \"function\") ? call : self; }\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function, not \" + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }\nvar bindAll = __webpack_require__(9);\nvar classNames = __webpack_require__(5);\nvar PropTypes = __webpack_require__(1);\nvar React = __webpack_require__(0);\nvar jar = __webpack_require__(137);\nvar languages = __webpack_require__(138).default;\nvar Form = __webpack_require__(22);\nvar Select = __webpack_require__(135);\n__webpack_require__(50);\n/**\n * Footer dropdown menu that allows one to change their language.\n */\nvar LanguageChooser = function (_React$Component) {\n    _inherits(LanguageChooser, _React$Component);\n    function LanguageChooser(props) {\n        _classCallCheck(this, LanguageChooser);\n        var _this = _possibleConstructorReturn(this, (LanguageChooser.__proto__ || Object.getPrototypeOf(LanguageChooser)).call(this, props));\n        bindAll(_this, ['handleSetLanguage']);\n        return _this;\n    }\n    _createClass(LanguageChooser, [{\n        key: 'handleSetLanguage',\n        value: function handleSetLanguage(name, value) {\n            var opts = {};\n            if (window.location.hostname !== 'localhost') {\n                opts = { domain: '.' + window.location.hostname };\n            }\n            jar.set('scratchlanguage', value, opts);\n            window.location.reload();\n        }\n    }, {\n        key: 'render',\n        value: function render() {\n            var _this2 = this;\n            var languageOptions = Object.keys(this.props.languages).map(function (value) {\n                return {\n                    value: value,\n                    label: _this2.props.languages[value].name\n                };\n            });\n            return React.createElement(\n                Form,\n                { className: classNames('language-chooser', this.props.className) },\n                React.createElement(Select, {\n                    required: true,\n                    name: 'language',\n                    options: languageOptions,\n                    value: this.props.locale,\n                    onChange: this.handleSetLanguage\n                })\n            );\n        }\n    }]);\n    return LanguageChooser;\n}(React.Component);\nLanguageChooser.propTypes = {\n    className: PropTypes.string,\n    languages: PropTypes.object, // eslint-disable-line react/forbid-prop-types\n    locale: PropTypes.string\n};\nLanguageChooser.defaultProps = {\n    languages: languages,\n    locale: 'en'\n};\nmodule.exports = LanguageChooser;\n// ./src/components/languagechooser/languagechooser.jsx\n// module id = 42\n// module chunks = 0 1 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47\n//# sourceURL=scratch:///./src/components/languagechooser/languagechooser.jsx?");
 })