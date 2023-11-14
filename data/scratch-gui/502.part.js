/* 502 */\n (function(module, exports, __webpack_require__) {\n\"use strict\";\nvar toUpperFirst = __webpack_require__(503)\nvar re         = /^(Moz|Webkit|Khtml|O|ms|Icab)(?=[A-Z])/\nvar docStyle   = typeof document == 'undefined'?\n                    {}:\n                    document.documentElement.style\nvar prefixInfo = (function(){\n    var prefix = (function(){\n            for (var prop in docStyle) {\n                if( re.test(prop) ) {\n                    // test is faster than match, so it's better to perform\n                    // that on the lot and match only when necessary\n                    return  prop.match(re)[0]\n                }\n            }\n            // Nothing found so far? Webkit does not enumerate over the CSS properties of the style object.\n            // However (prop in style) returns the correct value, so we'll have to test for\n            // the precence of a specific property\n            if ('WebkitOpacity' in docStyle){\n                return 'Webkit'\n            }\n            if ('KhtmlOpacity' in docStyle) {\n                return 'Khtml'\n            }\n            return ''\n        })(),\n    lower = prefix.toLowerCase()\n    return {\n        style       : prefix,\n        css       : '-' + lower + '-',\n        dom       : ({\n            Webkit: 'WebKit',\n            ms    : 'MS',\n            o     : 'WebKit'\n        })[prefix] || toUpperFirst(prefix)\n    }\n})()\nmodule.exports = prefixInfo\n })