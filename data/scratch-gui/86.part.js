/* 86 */\n (function(module, __webpack_exports__, __webpack_require__) {\n\"use strict\";\n(function(process) { var react_ga__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(337);\n var react_ga__WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(react_ga__WEBPACK_IMPORTED_MODULE_0__);\n var _log__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(30);\nvar GA_ID = process.env.GA_ID || window.GA_ID;\nif (GA_ID) {\n  react_ga__WEBPACK_IMPORTED_MODULE_0___default.a.initialize(GA_ID, {\n    debug: \"production\" !== 'production',\n    titleCase: true,\n    sampleRate:  true ? 100 : undefined,\n    forceSSL: true\n  });\n} else {\n  //_log__WEBPACK_IMPORTED_MODULE_1__[/* default */ \"a\"].info('Disabling GA because GA_ID is not set.');\n  window.ga = function () {// The `react-ga` module calls this function to implement all Google Analytics calls. Providing an empty\n    // function effectively disables `react-ga`. This is similar to the `testModeAPI` feature of `react-ga` except\n    // that `testModeAPI` logs the arguments of every call into an array. That's nice for testing purposes but\n    // would look like a memory leak in a live program.\n  };\n}\n/* harmony default export */ __webpack_exports__[\"a\"] = (react_ga__WEBPACK_IMPORTED_MODULE_0___default.a);\n}.call(this, __webpack_require__(93)))\n })