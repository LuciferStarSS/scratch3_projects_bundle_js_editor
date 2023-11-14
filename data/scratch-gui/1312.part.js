/* 1312 */\n (function(module, exports, __webpack_require__) {\n\"use strict\";\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.default = function (target) {\n  target.prototype.bindRemovalTracker = function () {\n    var _this = this;\n    var MutationObserver = getMutationObserverClass();\n    if (MutationObserver == null) return;\n    var observer = new MutationObserver(function (mutations) {\n      for (var m1 = 0; m1 < mutations.length; m1++) {\n        var mutation = mutations[m1];\n        for (var m2 = 0; m2 < mutation.removedNodes.length; m2++) {\n          var element = mutation.removedNodes[m2];\n          if (element === _this.state.currentTarget) {\n            _this.hideTooltip();\n            return;\n          }\n        }\n      }\n    });\n    observer.observe(window.document, { childList: true, subtree: true });\n    this.removalTracker = observer;\n  };\n  target.prototype.unbindRemovalTracker = function () {\n    if (this.removalTracker) {\n      this.removalTracker.disconnect();\n      this.removalTracker = null;\n    }\n  };\n};\n/**\n * Tracking target removing from DOM.\n * It's nessesary to hide tooltip when it's target disappears.\n * Otherwise, the tooltip would be shown forever until another target\n * is triggered.\n *\n * If MutationObserver is not available, this feature just doesn't work.\n */\n// https://hacks.mozilla.org/2012/05/dom-mutationobserver-reacting-to-dom-changes-without-killing-browser-performance/\nvar getMutationObserverClass = function getMutationObserverClass() {\n  return window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;\n};\n })