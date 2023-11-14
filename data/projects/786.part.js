/* 786 */
 (function(module, exports, __webpack_require__) {
"use strict";
eval("\n// Note: adler32 takes 12% for level 0 and 2% for level 6.\n// It isn't worth it to make additional optimizations as in original.\n// Small size is preferable.\n// (C) 1995-2013 Jean-loup Gailly and Mark Adler\n// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin\n//\n// This software is provided 'as-is', without any express or implied\n// warranty. In no event will the authors be held liable for any damages\n// arising from the use of this software.\n//\n// Permission is granted to anyone to use this software for any purpose,\n// including commercial applications, and to alter it and redistribute it\n// freely, subject to the following restrictions:\n//\n// 1. The origin of this software must not be misrepresented; you must not\n//   claim that you wrote the original software. If you use this software\n//   in a product, an acknowledgment in the product documentation would be\n//   appreciated but is not required.\n// 2. Altered source versions must be plainly marked as such, and must not be\n//   misrepresented as being the original software.\n// 3. This notice may not be removed or altered from any source distribution.\nfunction adler32(adler, buf, len, pos) {\n  var s1 = (adler & 0xffff) |0,\n      s2 = ((adler >>> 16) & 0xffff) |0,\n      n = 0;\n  while (len !== 0) {\n    // Set limit ~ twice less than 5552, to keep\n    // s2 in 31-bits, because we force signed ints.\n    // in other case %= will fail.\n    n = len > 2000 ? 2000 : len;\n    len -= n;\n    do {\n      s1 = (s1 + buf[pos++]) |0;\n      s2 = (s2 + s1) |0;\n    } while (--n);\n    s1 %= 65521;\n    s2 %= 65521;\n  }\n  return (s1 | (s2 << 16)) |0;\n}\nmodule.exports = adler32;\n// ./~/jszip/~/pako/lib/zlib/adler32.js\n// module id = 786\n// module chunks = 0\n//# sourceURL=scratch:///./~/jszip/~/pako/lib/zlib/adler32.js?");
 })