/* 429 */\n (function(module, exports) {\n// @flow\nvar LONG = 'long'\nvar SHORT = 'short'\nvar NARROW = 'narrow'\nvar NUMERIC = 'numeric'\nvar TWODIGIT = '2-digit'\n/**\n * formatting information\n **/\nmodule.exports = {\n  number: {\n    decimal: {\n      style: 'decimal'\n    },\n    integer: {\n      style: 'decimal',\n      maximumFractionDigits: 0\n    },\n    currency: {\n      style: 'currency',\n      currency: 'USD'\n    },\n    percent: {\n      style: 'percent'\n    },\n    default: {\n      style: 'decimal'\n    }\n  },\n  date: {\n    short: {\n      month: NUMERIC,\n      day: NUMERIC,\n      year: TWODIGIT\n    },\n    medium: {\n      month: SHORT,\n      day: NUMERIC,\n      year: NUMERIC\n    },\n    long: {\n      month: LONG,\n      day: NUMERIC,\n      year: NUMERIC\n    },\n    full: {\n      month: LONG,\n      day: NUMERIC,\n      year: NUMERIC,\n      weekday: LONG\n    },\n    default: {\n      month: SHORT,\n      day: NUMERIC,\n      year: NUMERIC\n    }\n  },\n  time: {\n    short: {\n      hour: NUMERIC,\n      minute: NUMERIC\n    },\n    medium: {\n      hour: NUMERIC,\n      minute: NUMERIC,\n      second: NUMERIC\n    },\n    long: {\n      hour: NUMERIC,\n      minute: NUMERIC,\n      second: NUMERIC,\n      timeZoneName: SHORT\n    },\n    full: {\n      hour: NUMERIC,\n      minute: NUMERIC,\n      second: NUMERIC,\n      timeZoneName: SHORT\n    },\n    default: {\n      hour: NUMERIC,\n      minute: NUMERIC,\n      second: NUMERIC\n    }\n  },\n  duration: {\n    default: {\n      hours: {\n        minimumIntegerDigits: 1,\n        maximumFractionDigits: 0\n      },\n      minutes: {\n        minimumIntegerDigits: 2,\n        maximumFractionDigits: 0\n      },\n      seconds: {\n        minimumIntegerDigits: 2,\n        maximumFractionDigits: 3\n      }\n    }\n  },\n  parseNumberPattern: function (pattern/*: ?string */) {\n    if (!pattern) return\n    var options = {}\n    var currency = pattern.match(/\\b[A-Z]{3}\\b/i)\n    var syms = pattern.replace(/[^¤]/g, '').length\n    if (!syms && currency) syms = 1\n    if (syms) {\n      options.style = 'currency'\n      options.currencyDisplay = syms === 1 ? 'symbol' : syms === 2 ? 'code' : 'name'\n      options.currency = currency ? currency[0].toUpperCase() : 'USD'\n    } else if (pattern.indexOf('%') >= 0) {\n      options.style = 'percent'\n    }\n    if (!/[@#0]/.test(pattern)) return options.style ? options : undefined\n    options.useGrouping = pattern.indexOf(',') >= 0\n    if (/E\\+?[@#0]+/i.test(pattern) || pattern.indexOf('@') >= 0) {\n      var size = pattern.replace(/E\\+?[@#0]+|[^@#0]/gi, '')\n      options.minimumSignificantDigits = Math.min(Math.max(size.replace(/[^@0]/g, '').length, 1), 21)\n      options.maximumSignificantDigits = Math.min(Math.max(size.length, 1), 21)\n    } else {\n      var parts = pattern.replace(/[^#0.]/g, '').split('.')\n      var integer = parts[0]\n      var n = integer.length - 1\n      while (integer[n] === '0') --n\n      options.minimumIntegerDigits = Math.min(Math.max(integer.length - 1 - n, 1), 21)\n      var fraction = parts[1] || ''\n      n = 0\n      while (fraction[n] === '0') ++n\n      options.minimumFractionDigits = Math.min(Math.max(n, 0), 20)\n      while (fraction[n] === '#') ++n\n      options.maximumFractionDigits = Math.min(Math.max(n, 0), 20)\n    }\n    return options\n  },\n  parseDatePattern: function (pattern/*: ?string */) {\n    if (!pattern) return\n    var options = {}\n    for (var i = 0; i < pattern.length;) {\n      var current = pattern[i]\n      var n = 1\n      while (pattern[++i] === current) ++n\n      switch (current) {\n        case 'G':\n          options.era = n === 5 ? NARROW : n === 4 ? LONG : SHORT\n          break\n        case 'y':\n        case 'Y':\n          options.year = n === 2 ? TWODIGIT : NUMERIC\n          break\n        case 'M':\n        case 'L':\n          n = Math.min(Math.max(n - 1, 0), 4)\n          options.month = [ NUMERIC, TWODIGIT, SHORT, LONG, NARROW ][n]\n          break\n        case 'E':\n        case 'e':\n        case 'c':\n          options.weekday = n === 5 ? NARROW : n === 4 ? LONG : SHORT\n          break\n        case 'd':\n        case 'D':\n          options.day = n === 2 ? TWODIGIT : NUMERIC\n          break\n        case 'h':\n        case 'K':\n          options.hour12 = true\n          options.hour = n === 2 ? TWODIGIT : NUMERIC\n          break\n        case 'H':\n        case 'k':\n          options.hour12 = false\n          options.hour = n === 2 ? TWODIGIT : NUMERIC\n          break\n        case 'm':\n          options.minute = n === 2 ? TWODIGIT : NUMERIC\n          break\n        case 's':\n        case 'S':\n          options.second = n === 2 ? TWODIGIT : NUMERIC\n          break\n        case 'z':\n        case 'Z':\n        case 'v':\n        case 'V':\n          options.timeZoneName = n === 1 ? SHORT : LONG\n          break\n      }\n    }\n    return Object.keys(options).length ? options : undefined\n  }\n}\n })