/* 221 */\n (function(module, exports, __webpack_require__) {\nfunction _typeof(obj) { \"@babel/helpers - typeof\"; if (typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; }; } return _typeof(obj); }\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function\"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }\nfunction _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }\nfunction _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }\nfunction _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === \"object\" || typeof call === \"function\")) { return call; } return _assertThisInitialized(self); }\nfunction _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return self; }\nfunction _isNativeReflectConstruct() { if (typeof Reflect === \"undefined\" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === \"function\") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }\nfunction _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }\nvar JSONRPC = __webpack_require__(443);\nvar BLE = function (_JSONRPC) {\n  _inherits(BLE, _JSONRPC);\n  var _super = _createSuper(BLE);\n  /**\n   * A BLE peripheral socket object.  It handles connecting, over web sockets, to\n   * BLE peripherals, and reading and writing data to them.\n   * @param {Runtime} runtime - the Runtime for sending/receiving GUI update events.\n   * @param {string} extensionId - the id of the extension using this socket.\n   * @param {object} peripheralOptions - the list of options for peripheral discovery.\n   * @param {object} connectCallback - a callback for connection.\n   * @param {object} resetCallback - a callback for resetting extension state.\n   */\n  function BLE(runtime, extensionId, peripheralOptions, connectCallback) {\n    var _this;\n    var resetCallback = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;\n    _classCallCheck(this, BLE);\n    _this = _super.call(this);\n    _this._socket = runtime.getScratchLinkSocket('BLE');\n    _this._socket.setOnOpen(_this.requestPeripheral.bind(_assertThisInitialized(_this)));\n    _this._socket.setOnClose(_this.handleDisconnectError.bind(_assertThisInitialized(_this)));\n    _this._socket.setOnError(_this._handleRequestError.bind(_assertThisInitialized(_this)));\n    _this._socket.setHandleMessage(_this._handleMessage.bind(_assertThisInitialized(_this)));\n    _this._sendMessage = _this._socket.sendMessage.bind(_this._socket);\n    _this._availablePeripherals = {};\n    _this._connectCallback = connectCallback;\n    _this._connected = false;\n    _this._characteristicDidChangeCallback = null;\n    _this._resetCallback = resetCallback;\n    _this._discoverTimeoutID = null;\n    _this._extensionId = extensionId;\n    _this._peripheralOptions = peripheralOptions;\n    _this._runtime = runtime;\n    _this._socket.open();\n    return _this;\n  }\n  /**\n   * Request connection to the peripheral.\n   * If the web socket is not yet open, request when the socket promise resolves.\n   */\n  _createClass(BLE, [{\n    key: \"requestPeripheral\",\n    value: function requestPeripheral() {\n      var _this2 = this;\n      this._availablePeripherals = {};\n      if (this._discoverTimeoutID) {\n        window.clearTimeout(this._discoverTimeoutID);\n      }\n      this._discoverTimeoutID = window.setTimeout(this._handleDiscoverTimeout.bind(this), 15000);\n      this.sendRemoteRequest('discover', this._peripheralOptions).catch(function (e) {\n        _this2._handleRequestError(e);\n      });\n    }\n    /**\n     * Try connecting to the input peripheral id, and then call the connect\n     * callback if connection is successful.\n     * @param {number} id - the id of the peripheral to connect to\n     */\n  }, {\n    key: \"connectPeripheral\",\n    value: function connectPeripheral(id) {\n      var _this3 = this;\n      this.sendRemoteRequest('connect', {\n        peripheralId: id\n      }).then(function () {\n        _this3._connected = true;\n        _this3._runtime.emit(_this3._runtime.constructor.PERIPHERAL_CONNECTED);\n        _this3._connectCallback();\n      }).catch(function (e) {\n        _this3._handleRequestError(e);\n      });\n    }\n    /**\n     * Close the websocket.\n     */\n  }, {\n    key: \"disconnect\",\n    value: function disconnect() {\n      if (this._connected) {\n        this._connected = false;\n      }\n      if (this._socket.isOpen()) {\n        this._socket.close();\n      }\n      if (this._discoverTimeoutID) {\n        window.clearTimeout(this._discoverTimeoutID);\n      } // Sets connection status icon to orange\n      this._runtime.emit(this._runtime.constructor.PERIPHERAL_DISCONNECTED);\n    }\n    /**\n     * @return {bool} whether the peripheral is connected.\n     */\n  }, {\n    key: \"isConnected\",\n    value: function isConnected() {\n      return this._connected;\n    }\n    /**\n     * Start receiving notifications from the specified ble service.\n     * @param {number} serviceId - the ble service to read.\n     * @param {number} characteristicId - the ble characteristic to get notifications from.\n     * @param {object} onCharacteristicChanged - callback for characteristic change notifications.\n     * @return {Promise} - a promise from the remote startNotifications request.\n     */\n  }, {\n    key: \"startNotifications\",\n    value: function startNotifications(serviceId, characteristicId) {\n      var _this4 = this;\n      var onCharacteristicChanged = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;\n      var params = {\n        serviceId: serviceId,\n        characteristicId: characteristicId\n      };\n      this._characteristicDidChangeCallback = onCharacteristicChanged;\n      return this.sendRemoteRequest('startNotifications', params).catch(function (e) {\n        _this4.handleDisconnectError(e);\n      });\n    }\n    /**\n     * Read from the specified ble service.\n     * @param {number} serviceId - the ble service to read.\n     * @param {number} characteristicId - the ble characteristic to read.\n     * @param {boolean} optStartNotifications - whether to start receiving characteristic change notifications.\n     * @param {object} onCharacteristicChanged - callback for characteristic change notifications.\n     * @return {Promise} - a promise from the remote read request.\n     */\n  }, {\n    key: \"read\",\n    value: function read(serviceId, characteristicId) {\n      var _this5 = this;\n      var optStartNotifications = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;\n      var onCharacteristicChanged = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;\n      var params = {\n        serviceId: serviceId,\n        characteristicId: characteristicId\n      };\n      if (optStartNotifications) {\n        params.startNotifications = true;\n      }\n      if (onCharacteristicChanged) {\n        this._characteristicDidChangeCallback = onCharacteristicChanged;\n      }\n      return this.sendRemoteRequest('read', params).catch(function (e) {\n        _this5.handleDisconnectError(e);\n      });\n    }\n    /**\n     * Write data to the specified ble service.\n     * @param {number} serviceId - the ble service to write.\n     * @param {number} characteristicId - the ble characteristic to write.\n     * @param {string} message - the message to send.\n     * @param {string} encoding - the message encoding type.\n     * @param {boolean} withResponse - if true, resolve after peripheral's response.\n     * @return {Promise} - a promise from the remote send request.\n     */\n  }, {\n    key: \"write\",\n    value: function write(serviceId, characteristicId, message) {\n      var _this6 = this;\n      var encoding = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;\n      var withResponse = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;\n      var params = {\n        serviceId: serviceId,\n        characteristicId: characteristicId,\n        message: message\n      };\n      if (encoding) {\n        params.encoding = encoding;\n      }\n      if (withResponse !== null) {\n        params.withResponse = withResponse;\n      }\n      return this.sendRemoteRequest('write', params).catch(function (e) {\n        _this6.handleDisconnectError(e);\n      });\n    }\n    /**\n     * Handle a received call from the socket.\n     * @param {string} method - a received method label.\n     * @param {object} params - a received list of parameters.\n     * @return {object} - optional return value.\n     */\n  }, {\n    key: \"didReceiveCall\",\n    value: function didReceiveCall(method, params) {\n      switch (method) {\n        case 'didDiscoverPeripheral':\n          this._availablePeripherals[params.peripheralId] = params;\n          this._runtime.emit(this._runtime.constructor.PERIPHERAL_LIST_UPDATE, this._availablePeripherals);\n          if (this._discoverTimeoutID) {\n            window.clearTimeout(this._discoverTimeoutID);\n          }\n          break;\n        case 'userDidPickPeripheral':\n          this._availablePeripherals[params.peripheralId] = params;\n          this._runtime.emit(this._runtime.constructor.USER_PICKED_PERIPHERAL, this._availablePeripherals);\n          if (this._discoverTimeoutID) {\n            window.clearTimeout(this._discoverTimeoutID);\n          }\n          break;\n        case 'userDidNotPickPeripheral':\n          this._runtime.emit(this._runtime.constructor.PERIPHERAL_SCAN_TIMEOUT);\n          if (this._discoverTimeoutID) {\n            window.clearTimeout(this._discoverTimeoutID);\n          }\n          break;\n        case 'characteristicDidChange':\n          if (this._characteristicDidChangeCallback) {\n            this._characteristicDidChangeCallback(params.message);\n          }\n          break;\n        case 'ping':\n          return 42;\n      }\n    }\n    /**\n     * Handle an error resulting from losing connection to a peripheral.\n     *\n     * This could be due to:\n     * - battery depletion\n     * - going out of bluetooth range\n     * - being powered down\n     *\n     * Disconnect the socket, and if the extension using this socket has a\n     * reset callback, call it. Finally, emit an error to the runtime.\n     */\n  }, {\n    key: \"handleDisconnectError\",\n    value: function handleDisconnectError()\n    /* e */\n    {\n      // log.error(`BLE error: ${JSON.stringify(e)}`);\n      if (!this._connected) return;\n      this.disconnect();\n      if (this._resetCallback) {\n        this._resetCallback();\n      }\n      this._runtime.emit(this._runtime.constructor.PERIPHERAL_CONNECTION_LOST_ERROR, {\n        message: \"Scratch lost connection to\",\n        extensionId: this._extensionId\n      });\n    }\n  }, {\n    key: \"_handleRequestError\",\n    value: function _handleRequestError()\n    /* e */\n    {\n      // log.error(`BLE error: ${JSON.stringify(e)}`);\n      this._runtime.emit(this._runtime.constructor.PERIPHERAL_REQUEST_ERROR, {\n        message: \"Scratch lost connection to\",\n        extensionId: this._extensionId\n      });\n    }\n  }, {\n    key: \"_handleDiscoverTimeout\",\n    value: function _handleDiscoverTimeout() {\n      if (this._discoverTimeoutID) {\n        window.clearTimeout(this._discoverTimeoutID);\n      }\n      this._runtime.emit(this._runtime.constructor.PERIPHERAL_SCAN_TIMEOUT);\n    }\n  }]);\n  return BLE;\n}(JSONRPC);\nmodule.exports = BLE;\n })