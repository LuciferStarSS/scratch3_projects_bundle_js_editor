/* 560 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar PropTypes = __webpack_require__(1);\nvar React = __webpack_require__(0);\nvar connect = __webpack_require__(13).connect;\n\nvar navigationActions = __webpack_require__(16);\nvar JoinModal = __webpack_require__(589);\n\n__webpack_require__(65);\n\nvar Registration = function Registration(_ref) {\n    var createProjectOnComplete = _ref.createProjectOnComplete,\n        handleCloseRegistration = _ref.handleCloseRegistration,\n        handleCompleteRegistration = _ref.handleCompleteRegistration,\n        isOpen = _ref.isOpen,\n        showCloseButton = _ref.showCloseButton;\n    return React.createElement(\n        'div',\n        null,\n        React.createElement(JoinModal, {\n            createProjectOnComplete: createProjectOnComplete,\n            isOpen: isOpen,\n            key: 'join-modal',\n            showCloseButton: showCloseButton,\n            onCompleteRegistration: handleCompleteRegistration,\n            onRequestClose: handleCloseRegistration\n        })\n    );\n};\n\nRegistration.propTypes = {\n    createProjectOnComplete: PropTypes.bool,\n    handleCloseRegistration: PropTypes.func,\n    handleCompleteRegistration: PropTypes.func,\n    isOpen: PropTypes.bool,\n    showCloseButton: PropTypes.bool\n};\n\nvar mapDispatchToProps = function mapDispatchToProps(dispatch, ownProps) {\n    return {\n        handleCloseRegistration: function handleCloseRegistration() {\n            dispatch(navigationActions.setRegistrationOpen(false));\n        },\n        handleCompleteRegistration: function handleCompleteRegistration() {\n            dispatch(navigationActions.handleCompleteRegistration(ownProps.createProjectOnComplete));\n        }\n    };\n};\n\nmodule.exports = connect(function () {\n    return {};\n}, mapDispatchToProps)(Registration);\n\n//////////////////\n// WEBPACK FOOTER\n// ./src/components/registration/scratch3-registration.jsx\n// module id = 560\n// module chunks = 0 1\n\n//# sourceURL=scratch:///./src/components/registration/scratch3-registration.jsx?");

/***/ })