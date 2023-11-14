/* 970 */\n (function(module, exports, __webpack_require__) {\n/*\n  Module dependencies\n*/\nvar ElementType = __webpack_require__(155);\nvar entities = __webpack_require__(971);\nvar unencodedElements = {\n  __proto__: null,\n  style: true,\n  script: true,\n  xmp: true,\n  iframe: true,\n  noembed: true,\n  noframes: true,\n  plaintext: true,\n  noscript: true\n};\n/*\n  Format attributes\n*/\nfunction formatAttrs(attributes, opts) {\n  if (!attributes) return;\n  var output = '',\n      value;\n  // Loop through the attributes\n  for (var key in attributes) {\n    value = attributes[key];\n    if (output) {\n      output += ' ';\n    }\n    output += key;\n    if ((value !== null && value !== '') || opts.xmlMode) {\n        output += '=\"' + (opts.decodeEntities ? entities.encodeXML(value) : value) + '\"';\n    }\n  }\n  return output;\n}\n/*\n  Self-enclosing tags (stolen from node-htmlparser)\n*/\nvar singleTag = {\n  __proto__: null,\n  area: true,\n  base: true,\n  basefont: true,\n  br: true,\n  col: true,\n  command: true,\n  embed: true,\n  frame: true,\n  hr: true,\n  img: true,\n  input: true,\n  isindex: true,\n  keygen: true,\n  link: true,\n  meta: true,\n  param: true,\n  source: true,\n  track: true,\n  wbr: true,\n};\nvar render = module.exports = function(dom, opts) {\n  if (!Array.isArray(dom) && !dom.cheerio) dom = [dom];\n  opts = opts || {};\n  var output = '';\n  for(var i = 0; i < dom.length; i++){\n    var elem = dom[i];\n    if (elem.type === 'root')\n      output += render(elem.children, opts);\n    else if (ElementType.isTag(elem))\n      output += renderTag(elem, opts);\n    else if (elem.type === ElementType.Directive)\n      output += renderDirective(elem);\n    else if (elem.type === ElementType.Comment)\n      output += renderComment(elem);\n    else if (elem.type === ElementType.CDATA)\n      output += renderCdata(elem);\n    else\n      output += renderText(elem, opts);\n  }\n  return output;\n};\nfunction renderTag(elem, opts) {\n  // Handle SVG\n  if (elem.name === \"svg\") opts = {decodeEntities: opts.decodeEntities, xmlMode: true};\n  var tag = '<' + elem.name,\n      attribs = formatAttrs(elem.attribs, opts);\n  if (attribs) {\n    tag += ' ' + attribs;\n  }\n  if (\n    opts.xmlMode\n    && (!elem.children || elem.children.length === 0)\n  ) {\n    tag += '/>';\n  } else {\n    tag += '>';\n    if (elem.children) {\n      tag += render(elem.children, opts);\n    }\n    if (!singleTag[elem.name] || opts.xmlMode) {\n      tag += '</' + elem.name + '>';\n    }\n  }\n  return tag;\n}\nfunction renderDirective(elem) {\n  return '<' + elem.data + '>';\n}\nfunction renderText(elem, opts) {\n  var data = elem.data || '';\n  // if entities weren't decoded, no need to encode them back\n  if (opts.decodeEntities && !(elem.parent && elem.parent.name in unencodedElements)) {\n    data = entities.encodeXML(data);\n  }\n  return data;\n}\nfunction renderCdata(elem) {\n  return '<![CDATA[' + elem.children[0].data + ']]>';\n}\nfunction renderComment(elem) {\n  return '<!--' + elem.data + '-->';\n}\n })