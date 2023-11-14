/* 1198 */\n (function(module, exports, __webpack_require__) {\n\"use strict\";\n/*\nCopyright (c) 2014, Yahoo! Inc. All rights reserved.\nCopyrights licensed under the New BSD License.\nSee the accompanying LICENSE file for terms.\n*/\nObject.defineProperty(exports, \"__esModule\", { value: true });\n/* jslint esnext: true */\nvar round = Math.round;\nfunction daysToYears(days) {\n    // 400 years have 146097 days (taking into account leap year rules)\n    return days * 400 / 146097;\n}\n// Thanks to date-fns\n// https://github.com/date-fns/date-fns\n// MIT © Sasha Koss\nvar MILLISECONDS_IN_MINUTE = 60000;\nvar MILLISECONDS_IN_DAY = 86400000;\nfunction startOfDay(dirtyDate) {\n    var date = new Date(dirtyDate);\n    date.setHours(0, 0, 0, 0);\n    return date;\n}\nfunction differenceInCalendarDays(dirtyDateLeft, dirtyDateRight) {\n    var startOfDayLeft = startOfDay(dirtyDateLeft);\n    var startOfDayRight = startOfDay(dirtyDateRight);\n    var timestampLeft = startOfDayLeft.getTime() -\n        startOfDayLeft.getTimezoneOffset() * MILLISECONDS_IN_MINUTE;\n    var timestampRight = startOfDayRight.getTime() -\n        startOfDayRight.getTimezoneOffset() * MILLISECONDS_IN_MINUTE;\n    // Round the number of days to the nearest integer\n    // because the number of milliseconds in a day is not constant\n    // (e.g. it's different in the day of the daylight saving time clock shift)\n    return Math.round((timestampLeft - timestampRight) / MILLISECONDS_IN_DAY);\n}\nfunction default_1(from, to) {\n    // Convert to ms timestamps.\n    from = +from;\n    to = +to;\n    var millisecond = round(to - from), second = round(millisecond / 1000), minute = round(second / 60), hour = round(minute / 60);\n    // We expect a more precision in rounding when dealing with\n    // days as it feels wrong when something happended 13 hours ago and\n    // is regarded as \"yesterday\" even if the time was this morning.\n    var day = differenceInCalendarDays(to, from);\n    var week = round(day / 7);\n    var rawYears = daysToYears(day), month = round(rawYears * 12), year = round(rawYears);\n    return {\n        millisecond: millisecond,\n        second: second,\n        'second-short': second,\n        minute: minute,\n        'minute-short': minute,\n        hour: hour,\n        'hour-short': hour,\n        day: day,\n        'day-short': day,\n        week: week,\n        'week-short': week,\n        month: month,\n        'month-short': month,\n        year: year,\n        'year-short': year\n    };\n}\nexports.default = default_1;\n/*# sourceMappingURL=diff.js.map*/ })