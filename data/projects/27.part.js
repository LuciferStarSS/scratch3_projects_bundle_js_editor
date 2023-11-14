/* 27 */
/***/ (function(module, exports, __webpack_require__) {
"use strict";
eval("\n\nvar classNames = __webpack_require__(5);\nvar PropTypes = __webpack_require__(1);\nvar React = __webpack_require__(0);\n\nvar Navigation = __webpack_require__(95);\nvar Footer = __webpack_require__(91);\nvar DonorRecognition = __webpack_require__(96);\nvar ErrorBoundary = __webpack_require__(63);\nvar WarningBanner = __webpack_require__(97);\n\n// Mandrill outage banner\nvar MANDRILL_OUTAGE_START_TIME = 1578718800000; // 2020-01-11 12:00:00\nvar MANDRILL_OUTAGE_END_TIME = 1578747600000; // 2020-01-11 08:00:00\n\nvar Page = function Page(_ref) {\n    var children = _ref.children,\n        className = _ref.className,\n        showDonorRecognition = _ref.showDonorRecognition;\n    return React.createElement(\n        ErrorBoundary,\n        { componentName: 'Page' },\n        React.createElement(\n            'div',\n            { className: classNames('page', className) },\n            React.createElement(\n                'div',\n                {\n                    className: classNames({\n                        staging: \"development\" === 'staging'\n                    }),\n                    id: 'navigation'\n                },\n                React.createElement(Navigation, null)\n            ),\n            React.createElement(\n                'div',\n                { id: 'view' },\n                Date.now() >= MANDRILL_OUTAGE_START_TIME && Date.now() < MANDRILL_OUTAGE_END_TIME && React.createElement(\n                    WarningBanner,\n                    null,\n                    'We are experiencing a disruption with email delivery. If you are not receiving emails from us, please try after 8am EST.'\n                ),\n                children\n            ),\n            React.createElement(\n                'div',\n                { id: 'footer' },\n                React.createElement(Footer, null)\n            ),\n            showDonorRecognition && React.createElement(\n                'div',\n                { id: 'donor' },\n                React.createElement(DonorRecognition, null)\n            )\n        )\n    );\n};\n\nPage.propTypes = {\n    children: PropTypes.node,\n    className: PropTypes.string,\n    showDonorRecognition: PropTypes.bool\n};\n\nmodule.exports = Page;\n\n//////////////////\n// WEBPACK FOOTER\n// ./src/components/page/www/page.jsx\n// module id = 27\n// module chunks = 0 1 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39\n\n//# sourceURL=scratch:///./src/components/page/www/page.jsx?");

/***/ })