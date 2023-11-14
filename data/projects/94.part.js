/* 94 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar classNames = __webpack_require__(5);\nvar FormattedMessage = __webpack_require__(4).FormattedMessage;\nvar injectIntl = __webpack_require__(4).injectIntl;\nvar PropTypes = __webpack_require__(1);\nvar React = __webpack_require__(0);\n\nvar Avatar = __webpack_require__(40);\nvar Dropdown = __webpack_require__(31);\n\n__webpack_require__(126);\n\nvar AccountNav = function AccountNav(_ref) {\n    var classroomId = _ref.classroomId,\n        isEducator = _ref.isEducator,\n        isOpen = _ref.isOpen,\n        isStudent = _ref.isStudent,\n        profileUrl = _ref.profileUrl,\n        thumbnailUrl = _ref.thumbnailUrl,\n        username = _ref.username,\n        onClick = _ref.onClick,\n        onClickLogout = _ref.onClickLogout,\n        onClose = _ref.onClose;\n    return React.createElement(\n        'div',\n        { className: 'account-nav' },\n        React.createElement(\n            'a',\n            {\n                className: classNames(['ignore-react-onclickoutside', 'user-info', { open: isOpen }]),\n                href: '#',\n                onClick: onClick\n            },\n            React.createElement(Avatar, {\n                alt: '',\n                src: thumbnailUrl\n            }),\n            React.createElement(\n                'span',\n                { className: 'profile-name' },\n                username\n            )\n        ),\n        React.createElement(\n            Dropdown,\n            {\n                as: 'ul',\n                className: \"development\",\n                isOpen: isOpen,\n                onRequestClose: onClose\n            },\n            React.createElement(\n                'li',\n                null,\n                React.createElement(\n                    'a',\n                    { href: profileUrl },\n                    React.createElement(FormattedMessage, { id: 'general.profile' })\n                )\n            ),\n            React.createElement(\n                'li',\n                null,\n                React.createElement(\n                    'a',\n                    { href: '/mystuff/' },\n                    React.createElement(FormattedMessage, { id: 'general.myStuff' })\n                )\n            ),\n            isEducator ? [React.createElement(\n                'li',\n                { key: 'my-classes-li' },\n                React.createElement(\n                    'a',\n                    { href: '/educators/classes/' },\n                    React.createElement(FormattedMessage, { id: 'general.myClasses' })\n                )\n            )] : [],\n            isStudent ? [React.createElement(\n                'li',\n                { key: 'my-class-li' },\n                React.createElement(\n                    'a',\n                    { href: '/classes/' + classroomId + '/' },\n                    React.createElement(FormattedMessage, { id: 'general.myClass' })\n                )\n            )] : [],\n            React.createElement(\n                'li',\n                null,\n                React.createElement(\n                    'a',\n                    { href: '/accounts/settings/' },\n                    React.createElement(FormattedMessage, { id: 'general.accountSettings' })\n                )\n            ),\n            React.createElement(\n                'li',\n                { className: 'divider' },\n                React.createElement(\n                    'a',\n                    {\n                        href: '#',\n                        onClick: onClickLogout\n                    },\n                    React.createElement(FormattedMessage, { id: 'navigation.signOut' })\n                )\n            )\n        )\n    );\n};\n\nAccountNav.propTypes = {\n    classroomId: PropTypes.string,\n    isEducator: PropTypes.bool,\n    isOpen: PropTypes.bool,\n    isStudent: PropTypes.bool,\n    onClick: PropTypes.func,\n    onClickLogout: PropTypes.func,\n    onClose: PropTypes.func,\n    profileUrl: PropTypes.string,\n    thumbnailUrl: PropTypes.string,\n    username: PropTypes.string\n};\n\nmodule.exports = injectIntl(AccountNav);\n\n//////////////////\n// WEBPACK FOOTER\n// ./src/components/navigation/www/accountnav.jsx\n// module id = 94\n// module chunks = 0 1 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39\n\n//# sourceURL=scratch:///./src/components/navigation/www/accountnav.jsx?");

/***/ })