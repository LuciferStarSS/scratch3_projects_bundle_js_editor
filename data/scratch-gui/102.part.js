/* 102 */\n (function(module, exports, __webpack_require__) {\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\nvar log = __webpack_require__(39);\nvar StringUtil = function () {\n  function StringUtil() {\n    _classCallCheck(this, StringUtil);\n  }\n  _createClass(StringUtil, null, [{\n    key: \"withoutTrailingDigits\",\n    value: function withoutTrailingDigits(s) {\n      var i = s.length - 1;\n      while (i >= 0 && '0123456789'.indexOf(s.charAt(i)) > -1) {\n        i--;\n      }\n      return s.slice(0, i + 1);\n    }\n  }, {\n    key: \"unusedName\",\n    value: function unusedName(name, existingNames) {\n      if (existingNames.indexOf(name) < 0) return name;\n      name = StringUtil.withoutTrailingDigits(name);\n      var i = 2;\n      while (existingNames.indexOf(name + i) >= 0) {\n        i++;\n      }\n      return name + i;\n    }\n    /**\n     * Split a string on the first occurrence of a split character.\n     * @param {string} text - the string to split.\n     * @param {string} separator - split the text on this character.\n     * @returns {string[]} - the two parts of the split string, or [text, null] if no split character found.\n     * @example\n     * // returns ['foo', 'tar.gz']\n     * splitFirst('foo.tar.gz', '.');\n     * @example\n     * // returns ['foo', null]\n     * splitFirst('foo', '.');\n     * @example\n     * // returns ['foo', '']\n     * splitFirst('foo.', '.');\n     */\n  }, {\n    key: \"splitFirst\",\n    value: function splitFirst(text, separator) {\n      var index = text.indexOf(separator);\n      if (index >= 0) {\n        return [text.substring(0, index), text.substring(index + 1)];\n      }\n      return [text, null];\n    }\n    /**\n     * A customized version of JSON.stringify that sets Infinity/NaN to 0,\n     * instead of the default (null).\n     * Needed because null is not of type number, but Infinity/NaN are, which\n     * can lead to serialization producing JSON that isn't valid based on the parser schema.\n     * It is also consistent with the behavior of saving 2.0 projects.\n     * This is only needed when stringifying an object for saving.\n     *\n     * @param {!object} obj - The object to serialize\n     * @return {!string} The JSON.stringified string with Infinity/NaN replaced with 0\n     */\n  }, {\n    key: \"stringify\",\n    value: function stringify(obj) {\n      return JSON.stringify(obj, function (_key, value) {\n        if (typeof value === 'number' && (value === Infinity || value === -Infinity || isNaN(value))) {\n          return 0;\n        }\n        return value;\n      });\n    }\n    /**\n     * A function to replace unsafe characters (not allowed in XML) with safe ones. This is used\n     * in cases where we're replacing non-user facing strings (e.g. variable IDs).\n     * When replacing user facing strings, the xmlEscape utility function should be used\n     * instead so that the user facing string does not change how it displays.\n     * @param {!string | !Array.<string>} unsafe Unsafe string possibly containing unicode control characters.\n     * In some cases this argument may be an array (e.g. hacked inputs from 2.0)\n     * @return {string} String with control characters replaced.\n     */\n  }, {\n    key: \"replaceUnsafeChars\",\n    value: function replaceUnsafeChars(unsafe) {\n      if (typeof unsafe !== 'string') {\n        if (Array.isArray(unsafe)) {\n          // This happens when we have hacked blocks from 2.0\n          // See #1030\n          unsafe = String(unsafe);\n        } else {\n          log.error('Unexpected input recieved in replaceUnsafeChars');\n          return unsafe;\n        }\n      }\n      return unsafe.replace(/[<>&'\"]/g, function (c) {\n        switch (c) {\n          case '<':\n            return 'lt';\n          case '>':\n            return 'gt';\n          case '&':\n            return 'amp';\n          case '\\'':\n            return 'apos';\n          case '\"':\n            return 'quot';\n        }\n      });\n    }\n  }]);\n  return StringUtil;\n}();\nmodule.exports = StringUtil;\n })