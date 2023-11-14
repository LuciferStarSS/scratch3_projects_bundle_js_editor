/* 789 */
 (function(module, exports, __webpack_require__) {
"use strict";
eval("\n// (C) 1995-2013 Jean-loup Gailly and Mark Adler\n// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin\n//\n// This software is provided 'as-is', without any express or implied\n// warranty. In no event will the authors be held liable for any damages\n// arising from the use of this software.\n//\n// Permission is granted to anyone to use this software for any purpose,\n// including commercial applications, and to alter it and redistribute it\n// freely, subject to the following restrictions:\n//\n// 1. The origin of this software must not be misrepresented; you must not\n//   claim that you wrote the original software. If you use this software\n//   in a product, an acknowledgment in the product documentation would be\n//   appreciated but is not required.\n// 2. Altered source versions must be plainly marked as such, and must not be\n//   misrepresented as being the original software.\n// 3. This notice may not be removed or altered from any source distribution.\nfunction ZStream() {\n  /* next input byte */\n  this.input = null; // JS specific, because we have no pointers\n  this.next_in = 0;\n  /* number of bytes available at input */\n  this.avail_in = 0;\n  /* total number of input bytes read so far */\n  this.total_in = 0;\n  /* next output byte should be put there */\n  this.output = null; // JS specific, because we have no pointers\n  this.next_out = 0;\n  /* remaining free space at output */\n  this.avail_out = 0;\n  /* total number of bytes output so far */\n  this.total_out = 0;\n  /* last error message, NULL if no error */\n  this.msg = ''/*Z_NULL*/;\n  /* not visible by applications */\n  this.state = null;\n  /* best guess about the data type: binary or text */\n  this.data_type = 2/*Z_UNKNOWN*/;\n  /* adler32 value of the uncompressed data */\n  this.adler = 0;\n}\nmodule.exports = ZStream;\n// ./~/jszip/~/pako/lib/zlib/zstream.js\n// module id = 789\n// module chunks = 0\n//# sourceURL=scratch:///./~/jszip/~/pako/lib/zlib/zstream.js?");
 })