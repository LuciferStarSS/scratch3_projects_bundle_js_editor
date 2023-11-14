/* 57 */\n (function(module, __webpack_exports__, __webpack_require__) {\n\"use strict\";\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"c\", function() { return alerts; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"a\", function() { return AlertLevels; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"b\", function() { return AlertTypes; });\n var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);\n var react__WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2);\n var keymirror__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(40);\n var keymirror__WEBPACK_IMPORTED_MODULE_2___default = __webpack_require__.n(keymirror__WEBPACK_IMPORTED_MODULE_2__);\n var _assets_icon_success_svg__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(209);\n var _assets_icon_success_svg__WEBPACK_IMPORTED_MODULE_3___default = __webpack_require__.n(_assets_icon_success_svg__WEBPACK_IMPORTED_MODULE_3__);\n\nvar AlertTypes = keymirror__WEBPACK_IMPORTED_MODULE_2___default()({\n  STANDARD: null,\n  EXTENSION: null,\n  INLINE: null\n});\nvar AlertLevels = {\n  SUCCESS: 'success',\n  INFO: 'info',\n  WARN: 'warn'\n};\nvar alerts = [{\n  alertId: 'createSuccess',\n  alertType: AlertTypes.STANDARD,\n  clearList: ['createSuccess', 'creating', 'createCopySuccess', 'creatingCopy', 'createRemixSuccess', 'creatingRemix', 'saveSuccess', 'saving'],\n  content: react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__[\"a\"], {\n    defaultMessage: \"New project created.\",\n    id: \"gui.alerts.createsuccess\"\n  }),\n  iconURL: _assets_icon_success_svg__WEBPACK_IMPORTED_MODULE_3___default.a,\n  level: AlertLevels.SUCCESS,\n  maxDisplaySecs: 5\n}, {\n  alertId: 'createCopySuccess',\n  alertType: AlertTypes.STANDARD,\n  clearList: ['createSuccess', 'creating', 'createCopySuccess', 'creatingCopy', 'createRemixSuccess', 'creatingRemix', 'saveSuccess', 'saving'],\n  content: react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__[\"a\"], {\n    defaultMessage: \"Project saved as a copy.\",\n    id: \"gui.alerts.createcopysuccess\"\n  }),\n  iconURL: _assets_icon_success_svg__WEBPACK_IMPORTED_MODULE_3___default.a,\n  level: AlertLevels.SUCCESS,\n  maxDisplaySecs: 5\n}, {\n  alertId: 'createRemixSuccess',\n  alertType: AlertTypes.STANDARD,\n  clearList: ['createSuccess', 'creating', 'createCopySuccess', 'creatingCopy', 'createRemixSuccess', 'creatingRemix', 'saveSuccess', 'saving'],\n  content: react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__[\"a\"], {\n    defaultMessage: \"Project saved as a remix.\",\n    id: \"gui.alerts.createremixsuccess\"\n  }),\n  iconURL: _assets_icon_success_svg__WEBPACK_IMPORTED_MODULE_3___default.a,\n  level: AlertLevels.SUCCESS,\n  maxDisplaySecs: 5\n}, {\n  alertId: 'creating',\n  alertType: AlertTypes.STANDARD,\n  clearList: ['createSuccess', 'creating', 'createCopySuccess', 'creatingCopy', 'createRemixSuccess', 'creatingRemix', 'saveSuccess', 'saving'],\n  content: react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__[\"a\"], {\n    defaultMessage: \"Creating new\\u2026\",\n    id: \"gui.alerts.creating\"\n  }),\n  iconSpinner: true,\n  level: AlertLevels.SUCCESS\n}, {\n  alertId: 'creatingCopy',\n  alertType: AlertTypes.STANDARD,\n  clearList: ['createSuccess', 'creating', 'createCopySuccess', 'creatingCopy', 'createRemixSuccess', 'creatingRemix', 'saveSuccess', 'saving'],\n  content: react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__[\"a\"], {\n    defaultMessage: \"Copying project\\u2026\",\n    id: \"gui.alerts.creatingCopy\"\n  }),\n  iconSpinner: true,\n  level: AlertLevels.SUCCESS\n}, {\n  alertId: 'creatingRemix',\n  alertType: AlertTypes.STANDARD,\n  clearList: ['createSuccess', 'creating', 'createCopySuccess', 'creatingCopy', 'createRemixSuccess', 'creatingRemix', 'saveSuccess', 'saving'],\n  content: react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__[\"a\"], {\n    defaultMessage: \"Remixing project\\u2026\",\n    id: \"gui.alerts.creatingRemix\"\n  }),\n  iconSpinner: true,\n  level: AlertLevels.SUCCESS\n}, {\n  alertId: 'creatingError',\n  clearList: ['createSuccess', 'creating', 'createCopySuccess', 'creatingCopy', 'createRemixSuccess', 'creatingRemix', 'saveSuccess', 'saving'],\n  closeButton: true,\n  content: react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__[\"a\"], {\n    defaultMessage: \"Could not create the project. Please try again!\",\n    id: \"gui.alerts.creatingError\"\n  }),\n  level: AlertLevels.WARN\n}, {\n  alertId: 'savingError',\n  clearList: ['createSuccess', 'creating', 'createCopySuccess', 'creatingCopy', 'createRemixSuccess', 'creatingRemix', 'saveSuccess', 'saving'],\n  showDownload: true,\n  showSaveNow: true,\n  closeButton: false,\n  content: react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__[\"a\"], {\n    defaultMessage: \"Project could not save.\",\n    id: \"gui.alerts.savingError\"\n  }),\n  level: AlertLevels.WARN\n}, {\n  alertId: 'saveSuccess',\n  alertType: AlertTypes.INLINE,\n  clearList: ['saveSuccess', 'saving', 'savingError'],\n  content: react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__[\"a\"], {\n    defaultMessage: \"Project saved.\",\n    id: \"gui.alerts.savesuccess\"\n  }),\n  iconURL: _assets_icon_success_svg__WEBPACK_IMPORTED_MODULE_3___default.a,\n  level: AlertLevels.SUCCESS,\n  maxDisplaySecs: 3\n}, {\n  alertId: 'saving',\n  alertType: AlertTypes.INLINE,\n  clearList: ['saveSuccess', 'saving', 'savingError'],\n  content: react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__[\"a\"], {\n    defaultMessage: \"Saving project\\u2026\",\n    id: \"gui.alerts.saving\"\n  }),\n  iconSpinner: true,\n  level: AlertLevels.INFO\n}, {\n  alertId: 'cloudInfo',\n  alertType: AlertTypes.STANDARD,\n  clearList: ['cloudInfo'],\n  content: react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__[\"a\"], {\n    defaultMessage: \"Please note, cloud variables only support numbers, not letters or symbols. {learnMoreLink}\" // eslint-disable-line max-len\n    ,\n    id: \"gui.alerts.cloudInfo\",\n    values: {\n      learnMoreLink: react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"a\", {\n        href: \"https://scratch.mit.edu/info/faq/#clouddata\",\n        rel: \"noopener noreferrer\",\n        target: \"_blank\"\n      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__[\"a\"], {\n        defaultMessage: \"Learn more.\",\n        id: \"gui.alerts.cloudInfoLearnMore\"\n      }))\n    }\n  }),\n  closeButton: true,\n  level: AlertLevels.SUCCESS,\n  maxDisplaySecs: 15\n}, {\n  alertId: 'importingAsset',\n  alertType: AlertTypes.STANDARD,\n  clearList: [],\n  content: react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__[\"a\"], {\n    defaultMessage: \"Importing\\u2026\",\n    id: \"gui.alerts.importing\"\n  }),\n  iconSpinner: true,\n  level: AlertLevels.SUCCESS\n}];\n })