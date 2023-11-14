/* 955 */\n (function(module, exports, __webpack_require__) {\n\"use strict\";\n// @flow\n/*::\nexport type AST = Element[]\nexport type Element = string | Placeholder\nexport type Placeholder = Plural | Styled | Typed | Simple\nexport type Plural = [ string, 'plural' | 'selectordinal', number, SubMessages ]\nexport type Styled = [ string, string, string | SubMessages ]\nexport type Typed = [ string, string ]\nexport type Simple = [ string ]\nexport type SubMessages = { [string]: AST }\nexport type Token = [ TokenType, string ]\nexport type TokenType = 'text' | 'space' | 'id' | 'type' | 'style' | 'offset' | 'number' | 'selector' | 'syntax'\ntype Context = {|\n  pattern: string,\n  index: number,\n  tagsType: ?string,\n  tokens: ?Token[]\n|}\n*/\nvar ARG_OPN = '{'\nvar ARG_CLS = '}'\nvar ARG_SEP = ','\nvar NUM_ARG = '#'\nvar TAG_OPN = '<'\nvar TAG_CLS = '>'\nvar TAG_END = '</'\nvar TAG_SELF_CLS = '/>'\nvar ESC = '\\''\nvar OFFSET = 'offset:'\nvar simpleTypes = [\n  'number',\n  'date',\n  'time',\n  'ordinal',\n  'duration',\n  'spellout'\n]\nvar submTypes = [\n  'plural',\n  'select',\n  'selectordinal'\n]\n/**\n * parse\n *\n * Turns this:\n *  `You have { numBananas, plural,\n *       =0 {no bananas}\n *      one {a banana}\n *    other {# bananas}\n *  } for sale`\n *\n * into this:\n *  [ \"You have \", [ \"numBananas\", \"plural\", 0, {\n *       \"=0\": [ \"no bananas\" ],\n *      \"one\": [ \"a banana\" ],\n *    \"other\": [ [ '#' ], \" bananas\" ]\n *  } ], \" for sale.\" ]\n *\n * tokens:\n *  [\n *    [ \"text\", \"You have \" ],\n *    [ \"syntax\", \"{\" ],\n *    [ \"space\", \" \" ],\n *    [ \"id\", \"numBananas\" ],\n *    [ \"syntax\", \", \" ],\n *    [ \"space\", \" \" ],\n *    [ \"type\", \"plural\" ],\n *    [ \"syntax\", \",\" ],\n *    [ \"space\", \"\\n     \" ],\n *    [ \"selector\", \"=0\" ],\n *    [ \"space\", \" \" ],\n *    [ \"syntax\", \"{\" ],\n *    [ \"text\", \"no bananas\" ],\n *    [ \"syntax\", \"}\" ],\n *    [ \"space\", \"\\n    \" ],\n *    [ \"selector\", \"one\" ],\n *    [ \"space\", \" \" ],\n *    [ \"syntax\", \"{\" ],\n *    [ \"text\", \"a banana\" ],\n *    [ \"syntax\", \"}\" ],\n *    [ \"space\", \"\\n  \" ],\n *    [ \"selector\", \"other\" ],\n *    [ \"space\", \" \" ],\n *    [ \"syntax\", \"{\" ],\n *    [ \"syntax\", \"#\" ],\n *    [ \"text\", \" bananas\" ],\n *    [ \"syntax\", \"}\" ],\n *    [ \"space\", \"\\n\" ],\n *    [ \"syntax\", \"}\" ],\n *    [ \"text\", \" for sale.\" ]\n *  ]\n **/\nexports = module.exports = function parse (\n  pattern/*: string */,\n  options/*:: ?: { tagsType?: string, tokens?: Token[] } */\n)/*: AST */ {\n  return parseAST({\n    pattern: String(pattern),\n    index: 0,\n    tagsType: (options && options.tagsType) || null,\n    tokens: (options && options.tokens) || null\n  }, '')\n}\nfunction parseAST (current/*: Context */, parentType/*: string */)/*: AST */ {\n  var pattern = current.pattern\n  var length = pattern.length\n  var elements/*: AST */ = []\n  var start = current.index\n  var text = parseText(current, parentType)\n  if (text) elements.push(text)\n  if (text && current.tokens) current.tokens.push([ 'text', pattern.slice(start, current.index) ])\n  while (current.index < length) {\n    if (pattern[current.index] === ARG_CLS) {\n      if (!parentType) throw expected(current)\n      break\n    }\n    if (parentType && current.tagsType && pattern.slice(current.index, current.index + TAG_END.length) === TAG_END) break\n    elements.push(parsePlaceholder(current))\n    start = current.index\n    text = parseText(current, parentType)\n    if (text) elements.push(text)\n    if (text && current.tokens) current.tokens.push([ 'text', pattern.slice(start, current.index) ])\n  }\n  return elements\n}\nfunction parseText (current/*: Context */, parentType/*: string */)/*: string */ {\n  var pattern = current.pattern\n  var length = pattern.length\n  var isHashSpecial = (parentType === 'plural' || parentType === 'selectordinal')\n  var isAngleSpecial = !!current.tagsType\n  var isArgStyle = (parentType === '{style}')\n  var text = ''\n  while (current.index < length) {\n    var char = pattern[current.index]\n    if (\n      char === ARG_OPN || char === ARG_CLS ||\n      (isHashSpecial && char === NUM_ARG) ||\n      (isAngleSpecial && char === TAG_OPN) ||\n      (isArgStyle && isWhitespace(char.charCodeAt(0)))\n    ) {\n      break\n    } else if (char === ESC) {\n      char = pattern[++current.index]\n      if (char === ESC) { // double is always 1 '\n        text += char\n        ++current.index\n      } else if (\n        // only when necessary\n        char === ARG_OPN || char === ARG_CLS ||\n        (isHashSpecial && char === NUM_ARG) ||\n        (isAngleSpecial && char === TAG_OPN) ||\n        isArgStyle\n      ) {\n        text += char\n        while (++current.index < length) {\n          char = pattern[current.index]\n          if (char === ESC && pattern[current.index + 1] === ESC) { // double is always 1 '\n            text += ESC\n            ++current.index\n          } else if (char === ESC) { // end of quoted\n            ++current.index\n            break\n          } else {\n            text += char\n          }\n        }\n      } else { // lone ' is just a '\n        text += ESC\n        // already incremented\n      }\n    } else {\n      text += char\n      ++current.index\n    }\n  }\n  return text\n}\nfunction isWhitespace (code/*: number */)/*: boolean */ {\n  return (\n    (code >= 0x09 && code <= 0x0D) ||\n    code === 0x20 || code === 0x85 || code === 0xA0 || code === 0x180E ||\n    (code >= 0x2000 && code <= 0x200D) ||\n    code === 0x2028 || code === 0x2029 || code === 0x202F || code === 0x205F ||\n    code === 0x2060 || code === 0x3000 || code === 0xFEFF\n  )\n}\nfunction skipWhitespace (current/*: Context */)/*: void */ {\n  var pattern = current.pattern\n  var length = pattern.length\n  var start = current.index\n  while (current.index < length && isWhitespace(pattern.charCodeAt(current.index))) {\n    ++current.index\n  }\n  if (start < current.index && current.tokens) {\n    current.tokens.push([ 'space', current.pattern.slice(start, current.index) ])\n  }\n}\nfunction parsePlaceholder (current/*: Context */)/*: Placeholder */ {\n  var pattern = current.pattern\n  if (pattern[current.index] === NUM_ARG) {\n    if (current.tokens) current.tokens.push([ 'syntax', NUM_ARG ])\n    ++current.index // move passed #\n    return [ NUM_ARG ]\n  }\n  var tag = parseTag(current)\n  if (tag) return tag\n  /* istanbul ignore if should be unreachable if parseAST and parseText are right */\n  if (pattern[current.index] !== ARG_OPN) throw expected(current, ARG_OPN)\n  if (current.tokens) current.tokens.push([ 'syntax', ARG_OPN ])\n  ++current.index // move passed {\n  skipWhitespace(current)\n  var id = parseId(current)\n  if (!id) throw expected(current, 'placeholder id')\n  if (current.tokens) current.tokens.push([ 'id', id ])\n  skipWhitespace(current)\n  var char = pattern[current.index]\n  if (char === ARG_CLS) { // end placeholder\n    if (current.tokens) current.tokens.push([ 'syntax', ARG_CLS ])\n    ++current.index // move passed }\n    return [ id ]\n  }\n  if (char !== ARG_SEP) throw expected(current, ARG_SEP + ' or ' + ARG_CLS)\n  if (current.tokens) current.tokens.push([ 'syntax', ARG_SEP ])\n  ++current.index // move passed ,\n  skipWhitespace(current)\n  var type = parseId(current)\n  if (!type) throw expected(current, 'placeholder type')\n  if (current.tokens) current.tokens.push([ 'type', type ])\n  skipWhitespace(current)\n  char = pattern[current.index]\n  if (char === ARG_CLS) { // end placeholder\n    if (current.tokens) current.tokens.push([ 'syntax', ARG_CLS ])\n    if (type === 'plural' || type === 'selectordinal' || type === 'select') {\n      throw expected(current, type + ' sub-messages')\n    }\n    ++current.index // move passed }\n    return [ id, type ]\n  }\n  if (char !== ARG_SEP) throw expected(current, ARG_SEP + ' or ' + ARG_CLS)\n  if (current.tokens) current.tokens.push([ 'syntax', ARG_SEP ])\n  ++current.index // move passed ,\n  skipWhitespace(current)\n  var arg\n  if (type === 'plural' || type === 'selectordinal') {\n    var offset = parsePluralOffset(current)\n    skipWhitespace(current)\n    arg = [ id, type, offset, parseSubMessages(current, type) ]\n  } else if (type === 'select') {\n    arg = [ id, type, parseSubMessages(current, type) ]\n  } else if (simpleTypes.indexOf(type) >= 0) {\n    arg = [ id, type, parseSimpleFormat(current) ]\n  } else { // custom placeholder type\n    var index = current.index\n    var format/*: string | SubMessages */ = parseSimpleFormat(current)\n    skipWhitespace(current)\n    if (pattern[current.index] === ARG_OPN) {\n      current.index = index // rewind, since should have been submessages\n      format = parseSubMessages(current, type)\n    }\n    arg = [ id, type, format ]\n  }\n  skipWhitespace(current)\n  if (pattern[current.index] !== ARG_CLS) throw expected(current, ARG_CLS)\n  if (current.tokens) current.tokens.push([ 'syntax', ARG_CLS ])\n  ++current.index // move passed }\n  return arg\n}\nfunction parseTag (current/*: Context */)/*: ?Placeholder */ {\n  var tagsType = current.tagsType\n  if (!tagsType || current.pattern[current.index] !== TAG_OPN) return\n  if (current.pattern.slice(current.index, current.index + TAG_END.length) === TAG_END) {\n    throw expected(current, null, 'closing tag without matching opening tag')\n  }\n  if (current.tokens) current.tokens.push([ 'syntax', TAG_OPN ])\n  ++current.index // move passed <\n  var id = parseId(current, true)\n  if (!id) throw expected(current, 'placeholder id')\n  if (current.tokens) current.tokens.push([ 'id', id ])\n  skipWhitespace(current)\n  if (current.pattern.slice(current.index, current.index + TAG_SELF_CLS.length) === TAG_SELF_CLS) {\n    if (current.tokens) current.tokens.push([ 'syntax', TAG_SELF_CLS ])\n    current.index += TAG_SELF_CLS.length\n    return [ id, tagsType ]\n  }\n  if (current.pattern[current.index] !== TAG_CLS) throw expected(current, TAG_CLS)\n  if (current.tokens) current.tokens.push([ 'syntax', TAG_CLS ])\n  ++current.index // move passed >\n  var children = parseAST(current, tagsType)\n  var end = current.index\n  if (current.pattern.slice(current.index, current.index + TAG_END.length) !== TAG_END) throw expected(current, TAG_END + id + TAG_CLS)\n  if (current.tokens) current.tokens.push([ 'syntax', TAG_END ])\n  current.index += TAG_END.length\n  var closeId = parseId(current, true)\n  if (closeId && current.tokens) current.tokens.push([ 'id', closeId ])\n  if (id !== closeId) {\n    current.index = end // rewind for better error message\n    throw expected(current, TAG_END + id + TAG_CLS, TAG_END + closeId + TAG_CLS)\n  }\n  skipWhitespace(current)\n  if (current.pattern[current.index] !== TAG_CLS) throw expected(current, TAG_CLS)\n  if (current.tokens) current.tokens.push([ 'syntax', TAG_CLS ])\n  ++current.index // move passed >\n  return [ id, tagsType, { children: children } ]\n}\nfunction parseId (current/*: Context */, isTag/*:: ?: boolean */)/*: string */ {\n  var pattern = current.pattern\n  var length = pattern.length\n  var id = ''\n  while (current.index < length) {\n    var char = pattern[current.index]\n    if (\n      char === ARG_OPN || char === ARG_CLS || char === ARG_SEP ||\n      char === NUM_ARG || char === ESC || isWhitespace(char.charCodeAt(0)) ||\n      (isTag && (char === TAG_OPN || char === TAG_CLS || char === '/'))\n    ) break\n    id += char\n    ++current.index\n  }\n  return id\n}\nfunction parseSimpleFormat (current/*: Context */)/*: string */ {\n  var start = current.index\n  var style = parseText(current, '{style}')\n  if (!style) throw expected(current, 'placeholder style name')\n  if (current.tokens) current.tokens.push([ 'style', current.pattern.slice(start, current.index) ])\n  return style\n}\nfunction parsePluralOffset (current/*: Context */)/*: number */ {\n  var pattern = current.pattern\n  var length = pattern.length\n  var offset = 0\n  if (pattern.slice(current.index, current.index + OFFSET.length) === OFFSET) {\n    if (current.tokens) current.tokens.push([ 'offset', 'offset' ], [ 'syntax', ':' ])\n    current.index += OFFSET.length // move passed offset:\n    skipWhitespace(current)\n    var start = current.index\n    while (current.index < length && isDigit(pattern.charCodeAt(current.index))) {\n      ++current.index\n    }\n    if (start === current.index) throw expected(current, 'offset number')\n    if (current.tokens) current.tokens.push([ 'number', pattern.slice(start, current.index) ])\n    offset = +pattern.slice(start, current.index)\n  }\n  return offset\n}\nfunction isDigit (code/*: number */)/*: boolean */ {\n  return (code >= 0x30 && code <= 0x39)\n}\nfunction parseSubMessages (current/*: Context */, parentType/*: string */)/*: SubMessages */ {\n  var pattern = current.pattern\n  var length = pattern.length\n  var options/*: SubMessages */ = {}\n  while (current.index < length && pattern[current.index] !== ARG_CLS) {\n    var selector = parseId(current)\n    if (!selector) throw expected(current, 'sub-message selector')\n    if (current.tokens) current.tokens.push([ 'selector', selector ])\n    skipWhitespace(current)\n    options[selector] = parseSubMessage(current, parentType)\n    skipWhitespace(current)\n  }\n  if (!options.other && submTypes.indexOf(parentType) >= 0) {\n    throw expected(current, null, null, '\"other\" sub-message must be specified in ' + parentType)\n  }\n  return options\n}\nfunction parseSubMessage (current/*: Context */, parentType/*: string */)/*: AST */ {\n  if (current.pattern[current.index] !== ARG_OPN) throw expected(current, ARG_OPN + ' to start sub-message')\n  if (current.tokens) current.tokens.push([ 'syntax', ARG_OPN ])\n  ++current.index // move passed {\n  var message = parseAST(current, parentType)\n  if (current.pattern[current.index] !== ARG_CLS) throw expected(current, ARG_CLS + ' to end sub-message')\n  if (current.tokens) current.tokens.push([ 'syntax', ARG_CLS ])\n  ++current.index // move passed }\n  return message\n}\nfunction expected (current/*: Context */, expected/*:: ?: ?string */, found/*:: ?: ?string */, message/*:: ?: string */) {\n  var pattern = current.pattern\n  var lines = pattern.slice(0, current.index).split(/\\r?\\n/)\n  var offset = current.index\n  var line = lines.length\n  var column = lines.slice(-1)[0].length\n  found = found || (\n    (current.index >= pattern.length) ? 'end of message pattern'\n      : (parseId(current) || pattern[current.index])\n  )\n  if (!message) message = errorMessage(expected, found)\n  message += ' in ' + pattern.replace(/\\r?\\n/g, '\\n')\n  return new SyntaxError(message, expected, found, offset, line, column)\n}\nfunction errorMessage (expected/*: ?string */, found/* string */) {\n  if (!expected) return 'Unexpected ' + found + ' found'\n  return 'Expected ' + expected + ' but found ' + found\n}\n/**\n * SyntaxError\n *  Holds information about bad syntax found in a message pattern\n **/\nfunction SyntaxError (message/*: string */, expected/*: ?string */, found/*: ?string */, offset/*: number */, line/*: number */, column/*: number */) {\n  Error.call(this, message)\n  this.name = 'SyntaxError'\n  this.message = message\n  this.expected = expected\n  this.found = found\n  this.offset = offset\n  this.line = line\n  this.column = column\n}\nSyntaxError.prototype = Object.create(Error.prototype)\nexports.SyntaxError = SyntaxError\n })