/* 1190 */
 (function(module, exports, __webpack_require__) {
"use strict";
eval("\n// (C) 1995-2013 Jean-loup Gailly and Mark Adler\n// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin\n//\n// This software is provided 'as-is', without any express or implied\n// warranty. In no event will the authors be held liable for any damages\n// arising from the use of this software.\n//\n// Permission is granted to anyone to use this software for any purpose,\n// including commercial applications, and to alter it and redistribute it\n// freely, subject to the following restrictions:\n//\n// 1. The origin of this software must not be misrepresented; you must not\n//   claim that you wrote the original software. If you use this software\n//   in a product, an acknowledgment in the product documentation would be\n//   appreciated but is not required.\n// 2. Altered source versions must be plainly marked as such, and must not be\n//   misrepresented as being the original software.\n// 3. This notice may not be removed or altered from any source distribution.\nfunction GZheader() {\n  /* true if compressed data believed to be text */\n  this.text       = 0;\n  /* modification time */\n  this.time       = 0;\n  /* extra flags (not used when writing a gzip file) */\n  this.xflags     = 0;\n  /* operating system */\n  this.os         = 0;\n  /* pointer to extra field or Z_NULL if none */\n  this.extra      = null;\n  /* extra field length (valid if extra != Z_NULL) */\n  this.extra_len  = 0; // Actually, we don't need it in JS,\n                       // but leave for few code modifications\n  //\n  // Setup limits is not necessary because in js we should not preallocate memory\n  // for inflate use constant limit in 65536 bytes\n  //\n  /* space at extra (only when reading header) */\n  // this.extra_max  = 0;\n  /* pointer to zero-terminated file name or Z_NULL */\n  this.name       = '';\n  /* space at name (only when reading header) */\n  // this.name_max   = 0;\n  /* pointer to zero-terminated comment or Z_NULL */\n  this.comment    = '';\n  /* space at comment (only when reading header) */\n  // this.comm_max   = 0;\n  /* true if there was or will be a header crc */\n  this.hcrc       = 0;\n  /* true when done reading gzip header (not used when writing a gzip file) */\n  this.done       = false;\n}\nmodule.exports = GZheader;\n// ./~/jszip/~/pako/lib/zlib/gzheader.js\n// module id = 1190\n// module chunks = 0\n//# sourceURL=scratch:///./~/jszip/~/pako/lib/zlib/gzheader.js?");
 })