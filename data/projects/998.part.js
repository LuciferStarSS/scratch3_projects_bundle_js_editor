/* 998 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar FormattedDate = __webpack_require__(4).FormattedDate;\nvar FormattedMessage = __webpack_require__(4).FormattedMessage;\nvar PropTypes = __webpack_require__(1);\nvar React = __webpack_require__(0);\nvar FlexRow = __webpack_require__(12);\n\nvar Button = __webpack_require__(15);\nvar AddToStudioModal = __webpack_require__(983);\nvar SocialModal = __webpack_require__(925);\nvar ReportModal = __webpack_require__(923);\nvar projectShape = __webpack_require__(255).projectShape;\n\n__webpack_require__(1435);\n\nvar Subactions = function Subactions(props) {\n    return React.createElement(\n        FlexRow,\n        { className: 'subactions' },\n        React.createElement(\n            'div',\n            { className: 'share-date' },\n            React.createElement(\n                'div',\n                { className: 'copyleft' },\n                '\\xA9'\n            ),\n            ' ',\n            props.shareDate ? React.createElement(FormattedDate, {\n                value: Date.parse(props.shareDate),\n                day: '2-digit',\n                month: 'short',\n                year: 'numeric'\n            }) : 'Unshared'\n        ),\n        React.createElement(\n            FlexRow,\n            { className: 'action-buttons' },\n            props.canReport && React.createElement(\n                React.Fragment,\n                null,\n                React.createElement(\n                    Button,\n                    {\n                        className: 'action-button report-button',\n                        key: 'report-button',\n                        onClick: props.onReportClicked\n                    },\n                    React.createElement(FormattedMessage, { id: 'general.report' })\n                ),\n                props.reportOpen && React.createElement(ReportModal, {\n                    isOpen: true,\n                    key: 'report-modal',\n                    type: 'project',\n                    onReport: props.onReportSubmit,\n                    onRequestClose: props.onReportClose\n                })\n            ),\n            props.canAddToStudio && React.createElement(\n                React.Fragment,\n                null,\n                React.createElement(\n                    Button,\n                    {\n                        className: 'action-button studio-button',\n                        key: 'add-to-studio-button',\n                        onClick: props.onAddToStudioClicked\n                    },\n                    React.createElement(FormattedMessage, { id: 'addToStudio.title' })\n                ),\n                props.addToStudioOpen && React.createElement(AddToStudioModal, {\n                    isOpen: true,\n                    isAdmin: props.isAdmin,\n                    key: 'add-to-studio-modal',\n                    userOwnsProject: props.userOwnsProject,\n                    onRequestClose: props.onAddToStudioClosed,\n                    onToggleStudio: props.onToggleStudio\n                })\n            ),\n            props.isShared && props.projectInfo && props.projectInfo.id && React.createElement(\n                React.Fragment,\n                null,\n                React.createElement(\n                    Button,\n                    {\n                        className: 'action-button copy-link-button',\n                        onClick: props.onSocialClicked\n                    },\n                    React.createElement(FormattedMessage, { id: 'general.copyLink' })\n                ),\n                props.socialOpen && React.createElement(SocialModal, {\n                    isOpen: true,\n                    key: 'social-modal',\n                    projectId: props.projectInfo && props.projectInfo.id,\n                    onRequestClose: props.onSocialClosed\n                })\n            )\n        )\n    );\n};\n\nSubactions.propTypes = {\n    addToStudioOpen: PropTypes.bool,\n    canAddToStudio: PropTypes.bool,\n    canReport: PropTypes.bool,\n    isAdmin: PropTypes.bool,\n    isShared: PropTypes.bool,\n    onAddToStudioClicked: PropTypes.func,\n    onAddToStudioClosed: PropTypes.func,\n    onReportClicked: PropTypes.func.isRequired,\n    onReportClose: PropTypes.func.isRequired,\n    onReportSubmit: PropTypes.func.isRequired,\n    onSocialClicked: PropTypes.func,\n    onSocialClosed: PropTypes.func,\n    onToggleStudio: PropTypes.func,\n    projectInfo: projectShape,\n    reportOpen: PropTypes.bool,\n    shareDate: PropTypes.string,\n    socialOpen: PropTypes.bool,\n    userOwnsProject: PropTypes.bool\n};\n\nmodule.exports = Subactions;\n\n//////////////////\n// WEBPACK FOOTER\n// ./src/views/preview/subactions.jsx\n// module id = 998\n// module chunks = 0\n\n//# sourceURL=scratch:///./src/views/preview/subactions.jsx?");

/***/ })