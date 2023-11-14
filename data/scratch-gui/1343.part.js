/* 1343 */\n (function(module, exports, __webpack_require__) {\n\"use strict\";\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.removeEventListener = exports.addEventListener = exports.off = exports.on = undefined;\nvar _platform = __webpack_require__(231);\nvar _utils = __webpack_require__(317);\n/* eslint no-param-reassign: 0 */\nvar requestAnimationFrame = _platform.isServer ? _utils.noop : _platform.window.requestAnimationFrame || _platform.window.mozRequestAnimationFrame || _platform.window.webkitRequestAnimationFrame || function (fn) {\n  _platform.window.setTimeout(fn, 20);\n};\nvar cancelAnimationFrame = _platform.isServer ? _utils.noop : _platform.window.cancelAnimationFrame || _platform.window.mozCancelAnimationFrame || _platform.window.webkitCancelAnimationFrame || _platform.window.clearTimeout;\nvar isIE = _platform.isServer ? false : navigator.userAgent.match(/Trident/);\nvar namespace = \"__resizeDetector__\";\nvar uninitialize = function uninitialize(el) {\n  el[namespace].destroy();\n  el[namespace] = undefined;\n};\nvar createElementHack = function createElementHack() {\n  var el = document.createElement(\"object\");\n  el.className = \"resize-sensor\";\n  el.setAttribute(\"style\", \"display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; pointer-events: none; z-index: -1;\");\n  el.setAttribute(\"class\", \"resize-sensor\");\n  el.setAttribute(\"tabindex\", \"-1\");\n  el.type = \"text/html\";\n  el.data = \"about:blank\";\n  return el;\n};\nvar initialize = function initialize(el) {\n  var detector = el[namespace] = {};\n  detector.listeners = [];\n  var onResize = function onResize(e) {\n    /* Keep in mind e.target could be el OR objEl. In this current implementation we don't seem to need to know this but its important\n    to not forget e.g. in some future refactoring scenario. */\n    if (detector.resizeRAF) cancelAnimationFrame(detector.resizeRAF);\n    detector.resizeRAF = requestAnimationFrame(function () {\n      detector.listeners.forEach(function (fn) {\n        fn(e);\n      });\n    });\n  };\n  if (isIE) {\n    /* We do not support ie8 and below (or ie9 in compat mode).\n    Therefore there is no presence of `attachEvent` here. */\n    el.addEventListener(\"onresize\", onResize);\n    detector.destroy = function () {\n      el.removeEventListener(\"onresize\", onResize);\n    };\n  } else {\n    if (getComputedStyle(el).position === \"static\") {\n      detector.elWasStaticPosition = true;\n      el.style.position = \"relative\";\n    }\n    var objEl = createElementHack();\n    objEl.onload = function () /* event */{\n      this.contentDocument.defaultView.addEventListener(\"resize\", onResize);\n    };\n    detector.destroy = function () {\n      if (detector.elWasStaticPosition) el.style.position = \"\";\n      if (el.contains(objEl)) {\n        // Event handlers will be automatically removed.\n        // http://stackoverflow.com/questions/12528049/if-a-dom-element-is-removed-are-its-listeners-also-removed-from-memory\n        el.removeChild(objEl);\n      }\n    };\n    el.appendChild(objEl);\n  }\n};\nvar on = function on(el, fn) {\n  /* Window object natively publishes resize events. We handle it as a\n  special case here so that users do not have to think about two APIs. */\n  if (el === _platform.window) {\n    _platform.window.addEventListener(\"resize\", fn);\n    return;\n  }\n  /* Not caching namespace read here beacuse not guaranteed that its available. */\n  if (!el[namespace]) initialize(el);\n  el[namespace].listeners.push(fn);\n};\nvar off = function off(el, fn) {\n  if (el === _platform.window) {\n    _platform.window.removeEventListener(\"resize\", fn);\n    return;\n  }\n  var detector = el[namespace];\n  if (!detector) return;\n  var i = detector.listeners.indexOf(fn);\n  if (i !== -1) detector.listeners.splice(i, 1);\n  if (!detector.listeners.length) uninitialize(el);\n};\nexports.default = {\n  on: on,\n  off: off,\n  addEventListener: on,\n  removeEventListener: off\n};\nexports.on = on;\nexports.off = off;\nexports.addEventListener = on;\nexports.removeEventListener = off;\n })