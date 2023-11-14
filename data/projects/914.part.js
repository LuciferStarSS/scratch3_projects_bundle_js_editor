/* 914 */
 (function(module, exports, __webpack_require__) {
"use strict";
eval("\nvar _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\nfunction _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return call && (typeof call === \"object\" || typeof call === \"function\") ? call : self; }\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function, not \" + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }\nvar React = __webpack_require__(0);\nvar PropTypes = __webpack_require__(1);\n/**\n * Higher-order component for building an animated studio button\n * it is used to decorate the onToggleStudio function with noticing\n * when the button has first been clicked.\n * This is needed so the buttons don't play the animation when they are\n * first rendered but when they are first clicked.\n * @param  {React.Component} Component a studio button component\n * @return {React.Component}           a wrapped studio button component\n */\nvar AnimateHOC = function AnimateHOC(Component) {\n    var WrappedComponent = function (_React$Component) {\n        _inherits(WrappedComponent, _React$Component);\n        function WrappedComponent(props) {\n            _classCallCheck(this, WrappedComponent);\n            var _this = _possibleConstructorReturn(this, (WrappedComponent.__proto__ || Object.getPrototypeOf(WrappedComponent)).call(this, props));\n            _this.state = {\n                wasClicked: false\n            };\n            _this.handleClick = _this.handleClick.bind(_this);\n            return _this;\n        }\n        _createClass(WrappedComponent, [{\n            key: 'handleClick',\n            value: function handleClick() {\n                var _this2 = this;\n                this.setState({ // else tell the state that the button has been clicked\n                    wasClicked: true\n                }, function () {\n                    return _this2.props.onClick(_this2.props.id);\n                }); // callback after state has been updated\n            }\n        }, {\n            key: 'render',\n            value: function render() {\n                var wasClicked = this.state.wasClicked;\n                return React.createElement(Component, _extends({}, this.props, {\n                    wasClicked: wasClicked,\n                    onClick: this.handleClick\n                }));\n            }\n        }]);\n        return WrappedComponent;\n    }(React.Component);\n    WrappedComponent.propTypes = {\n        id: PropTypes.number,\n        onClick: PropTypes.func\n    };\n    return WrappedComponent;\n};\nmodule.exports = AnimateHOC;\n// ./src/components/modal/addtostudio/animate-hoc.jsx\n// module id = 914\n// module chunks = 0\n//# sourceURL=scratch:///./src/components/modal/addtostudio/animate-hoc.jsx?");
 })