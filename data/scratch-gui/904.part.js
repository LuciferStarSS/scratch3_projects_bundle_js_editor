/* 904 */\n (function(module, exports, __webpack_require__) {\nvar __WEBPACK_AMD_DEFINE_RESULT__;/*!\n  Copyright (c) 2015 Jed Watson.\n  Based on code that is Copyright 2013-2015, Facebook, Inc.\n  All rights reserved.\n*/\n/* global define */\n(function () {\n\t'use strict';\n\tvar canUseDOM = !!(\n\t\ttypeof window !== 'undefined' &&\n\t\twindow.document &&\n\t\twindow.document.createElement\n\t);\n\tvar ExecutionEnvironment = {\n\t\tcanUseDOM: canUseDOM,\n\t\tcanUseWorkers: typeof Worker !== 'undefined',\n\t\tcanUseEventListeners:\n\t\t\tcanUseDOM && !!(window.addEventListener || window.attachEvent),\n\t\tcanUseViewport: canUseDOM && !!window.screen\n\t};\n\tif (true) {\n\t\t!(__WEBPACK_AMD_DEFINE_RESULT__ = (function () {\n\t\t\treturn ExecutionEnvironment;\n\t\t}).call(exports, __webpack_require__, exports, module),\n\t\t\t\t__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));\n\t} else {}\n}());\n })