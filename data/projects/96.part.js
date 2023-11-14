/* 96 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar FormattedMessage = __webpack_require__(4).FormattedMessage;\nvar injectIntl = __webpack_require__(4).injectIntl;\nvar React = __webpack_require__(0);\n\n__webpack_require__(128);\n\nvar DonorRecognition = function DonorRecognition() {\n    return React.createElement(\n        'div',\n        { id: 'donor-text' },\n        React.createElement(\n            'div',\n            null,\n            React.createElement(FormattedMessage, {\n                id: 'footer.donorRecognition',\n                values: {\n                    donorLink: React.createElement(\n                        'a',\n                        {\n                            href: '/credits#donors'\n                        },\n                        React.createElement(FormattedMessage, { id: 'footer.donors' })\n                    )\n                }\n            })\n        ),\n        React.createElement(\n            'div',\n            null,\n            React.createElement(FormattedMessage, {\n                id: 'footer.donorList',\n                values: {\n                    donor1: 'Massachusetts Institute of Technology',\n                    donor2: 'National Science Foundation',\n                    donor3: 'Siegel Family Endowment'\n                }\n            })\n        )\n    );\n};\n\nmodule.exports = injectIntl(DonorRecognition);\n\n//////////////////\n// WEBPACK FOOTER\n// ./src/components/page/www/donor-recognition.jsx\n// module id = 96\n// module chunks = 0 1 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39\n\n//# sourceURL=scratch:///./src/components/page/www/donor-recognition.jsx?");

/***/ })