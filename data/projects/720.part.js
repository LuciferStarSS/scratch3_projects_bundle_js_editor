/* 720 */
 (function(module, exports, __webpack_require__) {
"use strict";
eval("\nfunction _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }\nvar React = __webpack_require__(0);\nvar React__default = _interopDefault(React);\nvar ExecutionEnvironment = _interopDefault(__webpack_require__(721));\nvar shallowEqual = _interopDefault(__webpack_require__(728));\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\nfunction _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return call && (typeof call === \"object\" || typeof call === \"function\") ? call : self; }\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function, not \" + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }\nfunction withSideEffect(reducePropsToState, handleStateChangeOnClient, mapStateOnServer) {\n  if (typeof reducePropsToState !== 'function') {\n    throw new Error('Expected reducePropsToState to be a function.');\n  }\n  if (typeof handleStateChangeOnClient !== 'function') {\n    throw new Error('Expected handleStateChangeOnClient to be a function.');\n  }\n  if (typeof mapStateOnServer !== 'undefined' && typeof mapStateOnServer !== 'function') {\n    throw new Error('Expected mapStateOnServer to either be undefined or a function.');\n  }\n  function getDisplayName(WrappedComponent) {\n    return WrappedComponent.displayName || WrappedComponent.name || 'Component';\n  }\n  return function wrap(WrappedComponent) {\n    if (typeof WrappedComponent !== 'function') {\n      throw new Error('Expected WrappedComponent to be a React component.');\n    }\n    var mountedInstances = [];\n    var state = void 0;\n    function emitChange() {\n      state = reducePropsToState(mountedInstances.map(function (instance) {\n        return instance.props;\n      }));\n      if (SideEffect.canUseDOM) {\n        handleStateChangeOnClient(state);\n      } else if (mapStateOnServer) {\n        state = mapStateOnServer(state);\n      }\n    }\n    var SideEffect = function (_Component) {\n      _inherits(SideEffect, _Component);\n      function SideEffect() {\n        _classCallCheck(this, SideEffect);\n        return _possibleConstructorReturn(this, _Component.apply(this, arguments));\n      }\n      // Try to use displayName of wrapped component\n      SideEffect.peek = function peek() {\n        return state;\n      };\n      // Expose canUseDOM so tests can monkeypatch it\n      SideEffect.rewind = function rewind() {\n        if (SideEffect.canUseDOM) {\n          throw new Error('You may only call rewind() on the server. Call peek() to read the current state.');\n        }\n        var recordedState = state;\n        state = undefined;\n        mountedInstances = [];\n        return recordedState;\n      };\n      SideEffect.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps) {\n        return !shallowEqual(nextProps, this.props);\n      };\n      SideEffect.prototype.componentWillMount = function componentWillMount() {\n        mountedInstances.push(this);\n        emitChange();\n      };\n      SideEffect.prototype.componentDidUpdate = function componentDidUpdate() {\n        emitChange();\n      };\n      SideEffect.prototype.componentWillUnmount = function componentWillUnmount() {\n        var index = mountedInstances.indexOf(this);\n        mountedInstances.splice(index, 1);\n        emitChange();\n      };\n      SideEffect.prototype.render = function render() {\n        return React__default.createElement(WrappedComponent, this.props);\n      };\n      return SideEffect;\n    }(React.Component);\n    SideEffect.displayName = 'SideEffect(' + getDisplayName(WrappedComponent) + ')';\n    SideEffect.canUseDOM = ExecutionEnvironment.canUseDOM;\n    return SideEffect;\n  };\n}\nmodule.exports = withSideEffect;\n// ./~/react-side-effect/lib/index.js\n// module id = 720\n// module chunks = 0 8\n//# sourceURL=scratch:///./~/react-side-effect/lib/index.js?");
 })