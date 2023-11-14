/* 155 */\n (function(module, exports) {\n//Types of elements found in the DOM\nmodule.exports = {\n\tText: \"text\", //Text\n\tDirective: \"directive\", //<? ... ?>\n\tComment: \"comment\", //<!-- ... -->\n\tScript: \"script\", //<script> tags\n\tStyle: \"style\", //<style> tags\n\tTag: \"tag\", //Any tag\n\tCDATA: \"cdata\", //<![CDATA[ ... ]]>\n\tDoctype: \"doctype\",\n\tisTag: function(elem){\n\t\treturn elem.type === \"tag\" || elem.type === \"script\" || elem.type === \"style\";\n\t}\n};\n })