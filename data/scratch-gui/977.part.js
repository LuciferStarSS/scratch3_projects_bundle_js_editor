/* 977 */\n (function(module, exports, __webpack_require__) {\nvar ElementType = __webpack_require__(155);\nvar isTag = exports.isTag = ElementType.isTag;\nexports.testElement = function(options, element){\n\tfor(var key in options){\n\t\tif(!options.hasOwnProperty(key));\n\t\telse if(key === \"tag_name\"){\n\t\t\tif(!isTag(element) || !options.tag_name(element.name)){\n\t\t\t\treturn false;\n\t\t\t}\n\t\t} else if(key === \"tag_type\"){\n\t\t\tif(!options.tag_type(element.type)) return false;\n\t\t} else if(key === \"tag_contains\"){\n\t\t\tif(isTag(element) || !options.tag_contains(element.data)){\n\t\t\t\treturn false;\n\t\t\t}\n\t\t} else if(!element.attribs || !options[key](element.attribs[key])){\n\t\t\treturn false;\n\t\t}\n\t}\n\treturn true;\n};\nvar Checks = {\n\ttag_name: function(name){\n\t\tif(typeof name === \"function\"){\n\t\t\treturn function(elem){ return isTag(elem) && name(elem.name); };\n\t\t} else if(name === \"*\"){\n\t\t\treturn isTag;\n\t\t} else {\n\t\t\treturn function(elem){ return isTag(elem) && elem.name === name; };\n\t\t}\n\t},\n\ttag_type: function(type){\n\t\tif(typeof type === \"function\"){\n\t\t\treturn function(elem){ return type(elem.type); };\n\t\t} else {\n\t\t\treturn function(elem){ return elem.type === type; };\n\t\t}\n\t},\n\ttag_contains: function(data){\n\t\tif(typeof data === \"function\"){\n\t\t\treturn function(elem){ return !isTag(elem) && data(elem.data); };\n\t\t} else {\n\t\t\treturn function(elem){ return !isTag(elem) && elem.data === data; };\n\t\t}\n\t}\n};\nfunction getAttribCheck(attrib, value){\n\tif(typeof value === \"function\"){\n\t\treturn function(elem){ return elem.attribs && value(elem.attribs[attrib]); };\n\t} else {\n\t\treturn function(elem){ return elem.attribs && elem.attribs[attrib] === value; };\n\t}\n}\nfunction combineFuncs(a, b){\n\treturn function(elem){\n\t\treturn a(elem) || b(elem);\n\t};\n}\nexports.getElements = function(options, element, recurse, limit){\n\tvar funcs = Object.keys(options).map(function(key){\n\t\tvar value = options[key];\n\t\treturn key in Checks ? Checks[key](value) : getAttribCheck(key, value);\n\t});\n\treturn funcs.length === 0 ? [] : this.filter(\n\t\tfuncs.reduce(combineFuncs),\n\t\telement, recurse, limit\n\t);\n};\nexports.getElementById = function(id, element, recurse){\n\tif(!Array.isArray(element)) element = [element];\n\treturn this.findOne(getAttribCheck(\"id\", id), element, recurse !== false);\n};\nexports.getElementsByTagName = function(name, element, recurse, limit){\n\treturn this.filter(Checks.tag_name(name), element, recurse, limit);\n};\nexports.getElementsByTagType = function(type, element, recurse, limit){\n\treturn this.filter(Checks.tag_type(type), element, recurse, limit);\n};\n })