/* 1309 */\n (function(module, exports, __webpack_require__) {\n\"use strict\";\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.default = function (target) {\n  target.prototype.isCustomEvent = function (ele) {\n    var event = this.state.event;\n    return event || !!ele.getAttribute('data-event');\n  };\n  /* Bind listener for custom event */\n  target.prototype.customBindListener = function (ele) {\n    var _this = this;\n    var _state = this.state,\n        event = _state.event,\n        eventOff = _state.eventOff;\n    var dataEvent = ele.getAttribute('data-event') || event;\n    var dataEventOff = ele.getAttribute('data-event-off') || eventOff;\n    dataEvent.split(' ').forEach(function (event) {\n      ele.removeEventListener(event, customListeners.get(ele, event));\n      var customListener = checkStatus.bind(_this, dataEventOff);\n      customListeners.set(ele, event, customListener);\n      ele.addEventListener(event, customListener, false);\n    });\n    if (dataEventOff) {\n      dataEventOff.split(' ').forEach(function (event) {\n        ele.removeEventListener(event, _this.hideTooltip);\n        ele.addEventListener(event, _this.hideTooltip, false);\n      });\n    }\n  };\n  /* Unbind listener for custom event */\n  target.prototype.customUnbindListener = function (ele) {\n    var _state2 = this.state,\n        event = _state2.event,\n        eventOff = _state2.eventOff;\n    var dataEvent = event || ele.getAttribute('data-event');\n    var dataEventOff = eventOff || ele.getAttribute('data-event-off');\n    ele.removeEventListener(dataEvent, customListeners.get(ele, event));\n    if (dataEventOff) ele.removeEventListener(dataEventOff, this.hideTooltip);\n  };\n};\nfunction _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }\n/**\n * Custom events to control showing and hiding of tooltip\n *\n * @attributes\n * - `event` {String}\n * - `eventOff` {String}\n */\nvar checkStatus = function checkStatus(dataEventOff, e) {\n  var show = this.state.show;\n  var id = this.props.id;\n  var dataIsCapture = e.currentTarget.getAttribute('data-iscapture');\n  var isCapture = dataIsCapture && dataIsCapture === 'true' || this.props.isCapture;\n  var currentItem = e.currentTarget.getAttribute('currentItem');\n  if (!isCapture) e.stopPropagation();\n  if (show && currentItem === 'true') {\n    if (!dataEventOff) this.hideTooltip(e);\n  } else {\n    e.currentTarget.setAttribute('currentItem', 'true');\n    setUntargetItems(e.currentTarget, this.getTargetArray(id));\n    this.showTooltip(e);\n  }\n};\nvar setUntargetItems = function setUntargetItems(currentTarget, targetArray) {\n  for (var i = 0; i < targetArray.length; i++) {\n    if (currentTarget !== targetArray[i]) {\n      targetArray[i].setAttribute('currentItem', 'false');\n    } else {\n      targetArray[i].setAttribute('currentItem', 'true');\n    }\n  }\n};\nvar customListeners = {\n  id: '9b69f92e-d3fe-498b-b1b4-c5e63a51b0cf',\n  set: function set(target, event, listener) {\n    if (this.id in target) {\n      var map = target[this.id];\n      map[event] = listener;\n    } else {\n      // this is workaround for WeakMap, which is not supported in older browsers, such as IE\n      Object.defineProperty(target, this.id, {\n        configurable: true,\n        value: _defineProperty({}, event, listener)\n      });\n    }\n  },\n  get: function get(target, event) {\n    var map = target[this.id];\n    if (map !== undefined) {\n      return map[event];\n    }\n  }\n};\n })