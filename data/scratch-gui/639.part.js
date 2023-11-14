/* 639 */\n (function(module, exports, __webpack_require__) {\n\"use strict\";\n// (c) Dean McNamee <dean@gmail.com>, 2013.\n//\n// https://github.com/deanm/omggif\n//\n// Permission is hereby granted, free of charge, to any person obtaining a copy\n// of this software and associated documentation files (the \"Software\"), to\n// deal in the Software without restriction, including without limitation the\n// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or\n// sell copies of the Software, and to permit persons to whom the Software is\n// furnished to do so, subject to the following conditions:\n//\n// The above copyright notice and this permission notice shall be included in\n// all copies or substantial portions of the Software.\n//\n// THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING\n// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS\n// IN THE SOFTWARE.\n//\n// omggif is a JavaScript implementation of a GIF 89a encoder and decoder,\n// including animation and compression.  It does not rely on any specific\n// underlying system, so should run in the browser, Node, or Plask.\nfunction GifWriter(buf, width, height, gopts) {\n  var p = 0;\n  var gopts = gopts === undefined ? { } : gopts;\n  var loop_count = gopts.loop === undefined ? null : gopts.loop;\n  var global_palette = gopts.palette === undefined ? null : gopts.palette;\n  if (width <= 0 || height <= 0 || width > 65535 || height > 65535)\n    throw new Error(\"Width/Height invalid.\");\n  function check_palette_and_num_colors(palette) {\n    var num_colors = palette.length;\n    if (num_colors < 2 || num_colors > 256 ||  num_colors & (num_colors-1)) {\n      throw new Error(\n          \"Invalid code/color length, must be power of 2 and 2 .. 256.\");\n    }\n    return num_colors;\n  }\n  // - Header.\n  buf[p++] = 0x47; buf[p++] = 0x49; buf[p++] = 0x46;  // GIF\n  buf[p++] = 0x38; buf[p++] = 0x39; buf[p++] = 0x61;  // 89a\n  // Handling of Global Color Table (palette) and background index.\n  var gp_num_colors_pow2 = 0;\n  var background = 0;\n  if (global_palette !== null) {\n    var gp_num_colors = check_palette_and_num_colors(global_palette);\n    while (gp_num_colors >>= 1) ++gp_num_colors_pow2;\n    gp_num_colors = 1 << gp_num_colors_pow2;\n    --gp_num_colors_pow2;\n    if (gopts.background !== undefined) {\n      background = gopts.background;\n      if (background >= gp_num_colors)\n        throw new Error(\"Background index out of range.\");\n      // The GIF spec states that a background index of 0 should be ignored, so\n      // this is probably a mistake and you really want to set it to another\n      // slot in the palette.  But actually in the end most browsers, etc end\n      // up ignoring this almost completely (including for dispose background).\n      if (background === 0)\n        throw new Error(\"Background index explicitly passed as 0.\");\n    }\n  }\n  // - Logical Screen Descriptor.\n  // NOTE(deanm): w/h apparently ignored by implementations, but set anyway.\n  buf[p++] = width & 0xff; buf[p++] = width >> 8 & 0xff;\n  buf[p++] = height & 0xff; buf[p++] = height >> 8 & 0xff;\n  // NOTE: Indicates 0-bpp original color resolution (unused?).\n  buf[p++] = (global_palette !== null ? 0x80 : 0) |  // Global Color Table Flag.\n             gp_num_colors_pow2;  // NOTE: No sort flag (unused?).\n  buf[p++] = background;  // Background Color Index.\n  buf[p++] = 0;  // Pixel aspect ratio (unused?).\n  // - Global Color Table\n  if (global_palette !== null) {\n    for (var i = 0, il = global_palette.length; i < il; ++i) {\n      var rgb = global_palette[i];\n      buf[p++] = rgb >> 16 & 0xff;\n      buf[p++] = rgb >> 8 & 0xff;\n      buf[p++] = rgb & 0xff;\n    }\n  }\n  if (loop_count !== null) {  // Netscape block for looping.\n    if (loop_count < 0 || loop_count > 65535)\n      throw new Error(\"Loop count invalid.\")\n    // Extension code, label, and length.\n    buf[p++] = 0x21; buf[p++] = 0xff; buf[p++] = 0x0b;\n    // NETSCAPE2.0\n    buf[p++] = 0x4e; buf[p++] = 0x45; buf[p++] = 0x54; buf[p++] = 0x53;\n    buf[p++] = 0x43; buf[p++] = 0x41; buf[p++] = 0x50; buf[p++] = 0x45;\n    buf[p++] = 0x32; buf[p++] = 0x2e; buf[p++] = 0x30;\n    // Sub-block\n    buf[p++] = 0x03; buf[p++] = 0x01;\n    buf[p++] = loop_count & 0xff; buf[p++] = loop_count >> 8 & 0xff;\n    buf[p++] = 0x00;  // Terminator.\n  }\n  var ended = false;\n  this.addFrame = function(x, y, w, h, indexed_pixels, opts) {\n    if (ended === true) { --p; ended = false; }  // Un-end.\n    opts = opts === undefined ? { } : opts;\n    // TODO(deanm): Bounds check x, y.  Do they need to be within the virtual\n    // canvas width/height, I imagine?\n    if (x < 0 || y < 0 || x > 65535 || y > 65535)\n      throw new Error(\"x/y invalid.\")\n    if (w <= 0 || h <= 0 || w > 65535 || h > 65535)\n      throw new Error(\"Width/Height invalid.\")\n    if (indexed_pixels.length < w * h)\n      throw new Error(\"Not enough pixels for the frame size.\");\n    var using_local_palette = true;\n    var palette = opts.palette;\n    if (palette === undefined || palette === null) {\n      using_local_palette = false;\n      palette = global_palette;\n    }\n    if (palette === undefined || palette === null)\n      throw new Error(\"Must supply either a local or global palette.\");\n    var num_colors = check_palette_and_num_colors(palette);\n    // Compute the min_code_size (power of 2), destroying num_colors.\n    var min_code_size = 0;\n    while (num_colors >>= 1) ++min_code_size;\n    num_colors = 1 << min_code_size;  // Now we can easily get it back.\n    var delay = opts.delay === undefined ? 0 : opts.delay;\n    // From the spec:\n    //     0 -   No disposal specified. The decoder is\n    //           not required to take any action.\n    //     1 -   Do not dispose. The graphic is to be left\n    //           in place.\n    //     2 -   Restore to background color. The area used by the\n    //           graphic must be restored to the background color.\n    //     3 -   Restore to previous. The decoder is required to\n    //           restore the area overwritten by the graphic with\n    //           what was there prior to rendering the graphic.\n    //  4-7 -    To be defined.\n    // NOTE(deanm): Dispose background doesn't really work, apparently most\n    // browsers ignore the background palette index and clear to transparency.\n    var disposal = opts.disposal === undefined ? 0 : opts.disposal;\n    if (disposal < 0 || disposal > 3)  // 4-7 is reserved.\n      throw new Error(\"Disposal out of range.\");\n    var use_transparency = false;\n    var transparent_index = 0;\n    if (opts.transparent !== undefined && opts.transparent !== null) {\n      use_transparency = true;\n      transparent_index = opts.transparent;\n      if (transparent_index < 0 || transparent_index >= num_colors)\n        throw new Error(\"Transparent color index.\");\n    }\n    if (disposal !== 0 || use_transparency || delay !== 0) {\n      // - Graphics Control Extension\n      buf[p++] = 0x21; buf[p++] = 0xf9;  // Extension / Label.\n      buf[p++] = 4;  // Byte size.\n      buf[p++] = disposal << 2 | (use_transparency === true ? 1 : 0);\n      buf[p++] = delay & 0xff; buf[p++] = delay >> 8 & 0xff;\n      buf[p++] = transparent_index;  // Transparent color index.\n      buf[p++] = 0;  // Block Terminator.\n    }\n    // - Image Descriptor\n    buf[p++] = 0x2c;  // Image Seperator.\n    buf[p++] = x & 0xff; buf[p++] = x >> 8 & 0xff;  // Left.\n    buf[p++] = y & 0xff; buf[p++] = y >> 8 & 0xff;  // Top.\n    buf[p++] = w & 0xff; buf[p++] = w >> 8 & 0xff;\n    buf[p++] = h & 0xff; buf[p++] = h >> 8 & 0xff;\n    // NOTE: No sort flag (unused?).\n    // TODO(deanm): Support interlace.\n    buf[p++] = using_local_palette === true ? (0x80 | (min_code_size-1)) : 0;\n    // - Local Color Table\n    if (using_local_palette === true) {\n      for (var i = 0, il = palette.length; i < il; ++i) {\n        var rgb = palette[i];\n        buf[p++] = rgb >> 16 & 0xff;\n        buf[p++] = rgb >> 8 & 0xff;\n        buf[p++] = rgb & 0xff;\n      }\n    }\n    p = GifWriterOutputLZWCodeStream(\n            buf, p, min_code_size < 2 ? 2 : min_code_size, indexed_pixels);\n    return p;\n  };\n  this.end = function() {\n    if (ended === false) {\n      buf[p++] = 0x3b;  // Trailer.\n      ended = true;\n    }\n    return p;\n  };\n  this.getOutputBuffer = function() { return buf; };\n  this.setOutputBuffer = function(v) { buf = v; };\n  this.getOutputBufferPosition = function() { return p; };\n  this.setOutputBufferPosition = function(v) { p = v; };\n}\n// Main compression routine, palette indexes -> LZW code stream.\n// |index_stream| must have at least one entry.\nfunction GifWriterOutputLZWCodeStream(buf, p, min_code_size, index_stream) {\n  buf[p++] = min_code_size;\n  var cur_subblock = p++;  // Pointing at the length field.\n  var clear_code = 1 << min_code_size;\n  var code_mask = clear_code - 1;\n  var eoi_code = clear_code + 1;\n  var next_code = eoi_code + 1;\n  var cur_code_size = min_code_size + 1;  // Number of bits per code.\n  var cur_shift = 0;\n  // We have at most 12-bit codes, so we should have to hold a max of 19\n  // bits here (and then we would write out).\n  var cur = 0;\n  function emit_bytes_to_buffer(bit_block_size) {\n    while (cur_shift >= bit_block_size) {\n      buf[p++] = cur & 0xff;\n      cur >>= 8; cur_shift -= 8;\n      if (p === cur_subblock + 256) {  // Finished a subblock.\n        buf[cur_subblock] = 255;\n        cur_subblock = p++;\n      }\n    }\n  }\n  function emit_code(c) {\n    cur |= c << cur_shift;\n    cur_shift += cur_code_size;\n    emit_bytes_to_buffer(8);\n  }\n  // I am not an expert on the topic, and I don't want to write a thesis.\n  // However, it is good to outline here the basic algorithm and the few data\n  // structures and optimizations here that make this implementation fast.\n  // The basic idea behind LZW is to build a table of previously seen runs\n  // addressed by a short id (herein called output code).  All data is\n  // referenced by a code, which represents one or more values from the\n  // original input stream.  All input bytes can be referenced as the same\n  // value as an output code.  So if you didn't want any compression, you\n  // could more or less just output the original bytes as codes (there are\n  // some details to this, but it is the idea).  In order to achieve\n  // compression, values greater then the input range (codes can be up to\n  // 12-bit while input only 8-bit) represent a sequence of previously seen\n  // inputs.  The decompressor is able to build the same mapping while\n  // decoding, so there is always a shared common knowledge between the\n  // encoding and decoder, which is also important for \"timing\" aspects like\n  // how to handle variable bit width code encoding.\n  //\n  // One obvious but very important consequence of the table system is there\n  // is always a unique id (at most 12-bits) to map the runs.  'A' might be\n  // 4, then 'AA' might be 10, 'AAA' 11, 'AAAA' 12, etc.  This relationship\n  // can be used for an effecient lookup strategy for the code mapping.  We\n  // need to know if a run has been seen before, and be able to map that run\n  // to the output code.  Since we start with known unique ids (input bytes),\n  // and then from those build more unique ids (table entries), we can\n  // continue this chain (almost like a linked list) to always have small\n  // integer values that represent the current byte chains in the encoder.\n  // This means instead of tracking the input bytes (AAAABCD) to know our\n  // current state, we can track the table entry for AAAABC (it is guaranteed\n  // to exist by the nature of the algorithm) and the next character D.\n  // Therefor the tuple of (table_entry, byte) is guaranteed to also be\n  // unique.  This allows us to create a simple lookup key for mapping input\n  // sequences to codes (table indices) without having to store or search\n  // any of the code sequences.  So if 'AAAA' has a table entry of 12, the\n  // tuple of ('AAAA', K) for any input byte K will be unique, and can be our\n  // key.  This leads to a integer value at most 20-bits, which can always\n  // fit in an SMI value and be used as a fast sparse array / object key.\n  // Output code for the current contents of the index buffer.\n  var ib_code = index_stream[0] & code_mask;  // Load first input index.\n  var code_table = { };  // Key'd on our 20-bit \"tuple\".\n  emit_code(clear_code);  // Spec says first code should be a clear code.\n  // First index already loaded, process the rest of the stream.\n  for (var i = 1, il = index_stream.length; i < il; ++i) {\n    var k = index_stream[i] & code_mask;\n    var cur_key = ib_code << 8 | k;  // (prev, k) unique tuple.\n    var cur_code = code_table[cur_key];  // buffer + k.\n    // Check if we have to create a new code table entry.\n    if (cur_code === undefined) {  // We don't have buffer + k.\n      // Emit index buffer (without k).\n      // This is an inline version of emit_code, because this is the core\n      // writing routine of the compressor (and V8 cannot inline emit_code\n      // because it is a closure here in a different context).  Additionally\n      // we can call emit_byte_to_buffer less often, because we can have\n      // 30-bits (from our 31-bit signed SMI), and we know our codes will only\n      // be 12-bits, so can safely have 18-bits there without overflow.\n      // emit_code(ib_code);\n      cur |= ib_code << cur_shift;\n      cur_shift += cur_code_size;\n      while (cur_shift >= 8) {\n        buf[p++] = cur & 0xff;\n        cur >>= 8; cur_shift -= 8;\n        if (p === cur_subblock + 256) {  // Finished a subblock.\n          buf[cur_subblock] = 255;\n          cur_subblock = p++;\n        }\n      }\n      if (next_code === 4096) {  // Table full, need a clear.\n        emit_code(clear_code);\n        next_code = eoi_code + 1;\n        cur_code_size = min_code_size + 1;\n        code_table = { };\n      } else {  // Table not full, insert a new entry.\n        // Increase our variable bit code sizes if necessary.  This is a bit\n        // tricky as it is based on \"timing\" between the encoding and\n        // decoder.  From the encoders perspective this should happen after\n        // we've already emitted the index buffer and are about to create the\n        // first table entry that would overflow our current code bit size.\n        if (next_code >= (1 << cur_code_size)) ++cur_code_size;\n        code_table[cur_key] = next_code++;  // Insert into code table.\n      }\n      ib_code = k;  // Index buffer to single input k.\n    } else {\n      ib_code = cur_code;  // Index buffer to sequence in code table.\n    }\n  }\n  emit_code(ib_code);  // There will still be something in the index buffer.\n  emit_code(eoi_code);  // End Of Information.\n  // Flush / finalize the sub-blocks stream to the buffer.\n  emit_bytes_to_buffer(1);\n  // Finish the sub-blocks, writing out any unfinished lengths and\n  // terminating with a sub-block of length 0.  If we have already started\n  // but not yet used a sub-block it can just become the terminator.\n  if (cur_subblock + 1 === p) {  // Started but unused.\n    buf[cur_subblock] = 0;\n  } else {  // Started and used, write length and additional terminator block.\n    buf[cur_subblock] = p - cur_subblock - 1;\n    buf[p++] = 0;\n  }\n  return p;\n}\nfunction GifReader(buf) {\n  var p = 0;\n  // - Header (GIF87a or GIF89a).\n  if (buf[p++] !== 0x47 ||            buf[p++] !== 0x49 || buf[p++] !== 0x46 ||\n      buf[p++] !== 0x38 || (buf[p++]+1 & 0xfd) !== 0x38 || buf[p++] !== 0x61) {\n    throw new Error(\"Invalid GIF 87a/89a header.\");\n  }\n  // - Logical Screen Descriptor.\n  var width = buf[p++] | buf[p++] << 8;\n  var height = buf[p++] | buf[p++] << 8;\n  var pf0 = buf[p++];  // <Packed Fields>.\n  var global_palette_flag = pf0 >> 7;\n  var num_global_colors_pow2 = pf0 & 0x7;\n  var num_global_colors = 1 << (num_global_colors_pow2 + 1);\n  var background = buf[p++];\n  buf[p++];  // Pixel aspect ratio (unused?).\n  var global_palette_offset = null;\n  var global_palette_size   = null;\n  if (global_palette_flag) {\n    global_palette_offset = p;\n    global_palette_size = num_global_colors;\n    p += num_global_colors * 3;  // Seek past palette.\n  }\n  var no_eof = true;\n  var frames = [ ];\n  var delay = 0;\n  var transparent_index = null;\n  var disposal = 0;  // 0 - No disposal specified.\n  var loop_count = null;\n  this.width = width;\n  this.height = height;\n  while (no_eof && p < buf.length) {\n    switch (buf[p++]) {\n      case 0x21:  // Graphics Control Extension Block\n        switch (buf[p++]) {\n          case 0xff:  // Application specific block\n            // Try if it's a Netscape block (with animation loop counter).\n            if (buf[p   ] !== 0x0b ||  // 21 FF already read, check block size.\n                // NETSCAPE2.0\n                buf[p+1 ] == 0x4e && buf[p+2 ] == 0x45 && buf[p+3 ] == 0x54 &&\n                buf[p+4 ] == 0x53 && buf[p+5 ] == 0x43 && buf[p+6 ] == 0x41 &&\n                buf[p+7 ] == 0x50 && buf[p+8 ] == 0x45 && buf[p+9 ] == 0x32 &&\n                buf[p+10] == 0x2e && buf[p+11] == 0x30 &&\n                // Sub-block\n                buf[p+12] == 0x03 && buf[p+13] == 0x01 && buf[p+16] == 0) {\n              p += 14;\n              loop_count = buf[p++] | buf[p++] << 8;\n              p++;  // Skip terminator.\n            } else {  // We don't know what it is, just try to get past it.\n              p += 12;\n              while (true) {  // Seek through subblocks.\n                var block_size = buf[p++];\n                // Bad block size (ex: undefined from an out of bounds read).\n                if (!(block_size >= 0)) throw Error(\"Invalid block size\");\n                if (block_size === 0) break;  // 0 size is terminator\n                p += block_size;\n              }\n            }\n            break;\n          case 0xf9:  // Graphics Control Extension\n            if (buf[p++] !== 0x4 || buf[p+4] !== 0)\n              throw new Error(\"Invalid graphics extension block.\");\n            var pf1 = buf[p++];\n            delay = buf[p++] | buf[p++] << 8;\n            transparent_index = buf[p++];\n            if ((pf1 & 1) === 0) transparent_index = null;\n            disposal = pf1 >> 2 & 0x7;\n            p++;  // Skip terminator.\n            break;\n          case 0xfe:  // Comment Extension.\n            while (true) {  // Seek through subblocks.\n              var block_size = buf[p++];\n              // Bad block size (ex: undefined from an out of bounds read).\n              if (!(block_size >= 0)) throw Error(\"Invalid block size\");\n              if (block_size === 0) break;  // 0 size is terminator\n              // console.log(buf.slice(p, p+block_size).toString('ascii'));\n              p += block_size;\n            }\n            break;\n          default:\n            throw new Error(\n                \"Unknown graphic control label: 0x\" + buf[p-1].toString(16));\n        }\n        break;\n      case 0x2c:  // Image Descriptor.\n        var x = buf[p++] | buf[p++] << 8;\n        var y = buf[p++] | buf[p++] << 8;\n        var w = buf[p++] | buf[p++] << 8;\n        var h = buf[p++] | buf[p++] << 8;\n        var pf2 = buf[p++];\n        var local_palette_flag = pf2 >> 7;\n        var interlace_flag = pf2 >> 6 & 1;\n        var num_local_colors_pow2 = pf2 & 0x7;\n        var num_local_colors = 1 << (num_local_colors_pow2 + 1);\n        var palette_offset = global_palette_offset;\n        var palette_size = global_palette_size;\n        var has_local_palette = false;\n        if (local_palette_flag) {\n          var has_local_palette = true;\n          palette_offset = p;  // Override with local palette.\n          palette_size = num_local_colors;\n          p += num_local_colors * 3;  // Seek past palette.\n        }\n        var data_offset = p;\n        p++;  // codesize\n        while (true) {\n          var block_size = buf[p++];\n          // Bad block size (ex: undefined from an out of bounds read).\n          if (!(block_size >= 0)) throw Error(\"Invalid block size\");\n          if (block_size === 0) break;  // 0 size is terminator\n          p += block_size;\n        }\n        frames.push({x: x, y: y, width: w, height: h,\n                     has_local_palette: has_local_palette,\n                     palette_offset: palette_offset,\n                     palette_size: palette_size,\n                     data_offset: data_offset,\n                     data_length: p - data_offset,\n                     transparent_index: transparent_index,\n                     interlaced: !!interlace_flag,\n                     delay: delay,\n                     disposal: disposal});\n        break;\n      case 0x3b:  // Trailer Marker (end of file).\n        no_eof = false;\n        break;\n      default:\n        throw new Error(\"Unknown gif block: 0x\" + buf[p-1].toString(16));\n        break;\n    }\n  }\n  this.numFrames = function() {\n    return frames.length;\n  };\n  this.loopCount = function() {\n    return loop_count;\n  };\n  this.frameInfo = function(frame_num) {\n    if (frame_num < 0 || frame_num >= frames.length)\n      throw new Error(\"Frame index out of range.\");\n    return frames[frame_num];\n  }\n  this.decodeAndBlitFrameBGRA = function(frame_num, pixels) {\n    var frame = this.frameInfo(frame_num);\n    var num_pixels = frame.width * frame.height;\n    var index_stream = new Uint8Array(num_pixels);  // At most 8-bit indices.\n    GifReaderLZWOutputIndexStream(\n        buf, frame.data_offset, index_stream, num_pixels);\n    var palette_offset = frame.palette_offset;\n    // NOTE(deanm): It seems to be much faster to compare index to 256 than\n    // to === null.  Not sure why, but CompareStub_EQ_STRICT shows up high in\n    // the profile, not sure if it's related to using a Uint8Array.\n    var trans = frame.transparent_index;\n    if (trans === null) trans = 256;\n    // We are possibly just blitting to a portion of the entire frame.\n    // That is a subrect within the framerect, so the additional pixels\n    // must be skipped over after we finished a scanline.\n    var framewidth  = frame.width;\n    var framestride = width - framewidth;\n    var xleft       = framewidth;  // Number of subrect pixels left in scanline.\n    // Output indicies of the top left and bottom right corners of the subrect.\n    var opbeg = ((frame.y * width) + frame.x) * 4;\n    var opend = ((frame.y + frame.height) * width + frame.x) * 4;\n    var op    = opbeg;\n    var scanstride = framestride * 4;\n    // Use scanstride to skip past the rows when interlacing.  This is skipping\n    // 7 rows for the first two passes, then 3 then 1.\n    if (frame.interlaced === true) {\n      scanstride += width * 4 * 7;  // Pass 1.\n    }\n    var interlaceskip = 8;  // Tracking the row interval in the current pass.\n    for (var i = 0, il = index_stream.length; i < il; ++i) {\n      var index = index_stream[i];\n      if (xleft === 0) {  // Beginning of new scan line\n        op += scanstride;\n        xleft = framewidth;\n        if (op >= opend) { // Catch the wrap to switch passes when interlacing.\n          scanstride = framestride * 4 + width * 4 * (interlaceskip-1);\n          // interlaceskip / 2 * 4 is interlaceskip << 1.\n          op = opbeg + (framewidth + framestride) * (interlaceskip << 1);\n          interlaceskip >>= 1;\n        }\n      }\n      if (index === trans) {\n        op += 4;\n      } else {\n        var r = buf[palette_offset + index * 3];\n        var g = buf[palette_offset + index * 3 + 1];\n        var b = buf[palette_offset + index * 3 + 2];\n        pixels[op++] = b;\n        pixels[op++] = g;\n        pixels[op++] = r;\n        pixels[op++] = 255;\n      }\n      --xleft;\n    }\n  };\n  // I will go to copy and paste hell one day...\n  this.decodeAndBlitFrameRGBA = function(frame_num, pixels) {\n    var frame = this.frameInfo(frame_num);\n    var num_pixels = frame.width * frame.height;\n    var index_stream = new Uint8Array(num_pixels);  // At most 8-bit indices.\n    GifReaderLZWOutputIndexStream(\n        buf, frame.data_offset, index_stream, num_pixels);\n    var palette_offset = frame.palette_offset;\n    // NOTE(deanm): It seems to be much faster to compare index to 256 than\n    // to === null.  Not sure why, but CompareStub_EQ_STRICT shows up high in\n    // the profile, not sure if it's related to using a Uint8Array.\n    var trans = frame.transparent_index;\n    if (trans === null) trans = 256;\n    // We are possibly just blitting to a portion of the entire frame.\n    // That is a subrect within the framerect, so the additional pixels\n    // must be skipped over after we finished a scanline.\n    var framewidth  = frame.width;\n    var framestride = width - framewidth;\n    var xleft       = framewidth;  // Number of subrect pixels left in scanline.\n    // Output indicies of the top left and bottom right corners of the subrect.\n    var opbeg = ((frame.y * width) + frame.x) * 4;\n    var opend = ((frame.y + frame.height) * width + frame.x) * 4;\n    var op    = opbeg;\n    var scanstride = framestride * 4;\n    // Use scanstride to skip past the rows when interlacing.  This is skipping\n    // 7 rows for the first two passes, then 3 then 1.\n    if (frame.interlaced === true) {\n      scanstride += width * 4 * 7;  // Pass 1.\n    }\n    var interlaceskip = 8;  // Tracking the row interval in the current pass.\n    for (var i = 0, il = index_stream.length; i < il; ++i) {\n      var index = index_stream[i];\n      if (xleft === 0) {  // Beginning of new scan line\n        op += scanstride;\n        xleft = framewidth;\n        if (op >= opend) { // Catch the wrap to switch passes when interlacing.\n          scanstride = framestride * 4 + width * 4 * (interlaceskip-1);\n          // interlaceskip / 2 * 4 is interlaceskip << 1.\n          op = opbeg + (framewidth + framestride) * (interlaceskip << 1);\n          interlaceskip >>= 1;\n        }\n      }\n      if (index === trans) {\n        op += 4;\n      } else {\n        var r = buf[palette_offset + index * 3];\n        var g = buf[palette_offset + index * 3 + 1];\n        var b = buf[palette_offset + index * 3 + 2];\n        pixels[op++] = r;\n        pixels[op++] = g;\n        pixels[op++] = b;\n        pixels[op++] = 255;\n      }\n      --xleft;\n    }\n  };\n}\nfunction GifReaderLZWOutputIndexStream(code_stream, p, output, output_length) {\n  var min_code_size = code_stream[p++];\n  var clear_code = 1 << min_code_size;\n  var eoi_code = clear_code + 1;\n  var next_code = eoi_code + 1;\n  var cur_code_size = min_code_size + 1;  // Number of bits per code.\n  // NOTE: This shares the same name as the encoder, but has a different\n  // meaning here.  Here this masks each code coming from the code stream.\n  var code_mask = (1 << cur_code_size) - 1;\n  var cur_shift = 0;\n  var cur = 0;\n  var op = 0;  // Output pointer.\n  var subblock_size = code_stream[p++];\n  // TODO(deanm): Would using a TypedArray be any faster?  At least it would\n  // solve the fast mode / backing store uncertainty.\n  // var code_table = Array(4096);\n  var code_table = new Int32Array(4096);  // Can be signed, we only use 20 bits.\n  var prev_code = null;  // Track code-1.\n  while (true) {\n    // Read up to two bytes, making sure we always 12-bits for max sized code.\n    while (cur_shift < 16) {\n      if (subblock_size === 0) break;  // No more data to be read.\n      cur |= code_stream[p++] << cur_shift;\n      cur_shift += 8;\n      if (subblock_size === 1) {  // Never let it get to 0 to hold logic above.\n        subblock_size = code_stream[p++];  // Next subblock.\n      } else {\n        --subblock_size;\n      }\n    }\n    // TODO(deanm): We should never really get here, we should have received\n    // and EOI.\n    if (cur_shift < cur_code_size)\n      break;\n    var code = cur & code_mask;\n    cur >>= cur_code_size;\n    cur_shift -= cur_code_size;\n    // TODO(deanm): Maybe should check that the first code was a clear code,\n    // at least this is what you're supposed to do.  But actually our encoder\n    // now doesn't emit a clear code first anyway.\n    if (code === clear_code) {\n      // We don't actually have to clear the table.  This could be a good idea\n      // for greater error checking, but we don't really do any anyway.  We\n      // will just track it with next_code and overwrite old entries.\n      next_code = eoi_code + 1;\n      cur_code_size = min_code_size + 1;\n      code_mask = (1 << cur_code_size) - 1;\n      // Don't update prev_code ?\n      prev_code = null;\n      continue;\n    } else if (code === eoi_code) {\n      break;\n    }\n    // We have a similar situation as the decoder, where we want to store\n    // variable length entries (code table entries), but we want to do in a\n    // faster manner than an array of arrays.  The code below stores sort of a\n    // linked list within the code table, and then \"chases\" through it to\n    // construct the dictionary entries.  When a new entry is created, just the\n    // last byte is stored, and the rest (prefix) of the entry is only\n    // referenced by its table entry.  Then the code chases through the\n    // prefixes until it reaches a single byte code.  We have to chase twice,\n    // first to compute the length, and then to actually copy the data to the\n    // output (backwards, since we know the length).  The alternative would be\n    // storing something in an intermediate stack, but that doesn't make any\n    // more sense.  I implemented an approach where it also stored the length\n    // in the code table, although it's a bit tricky because you run out of\n    // bits (12 + 12 + 8), but I didn't measure much improvements (the table\n    // entries are generally not the long).  Even when I created benchmarks for\n    // very long table entries the complexity did not seem worth it.\n    // The code table stores the prefix entry in 12 bits and then the suffix\n    // byte in 8 bits, so each entry is 20 bits.\n    var chase_code = code < next_code ? code : prev_code;\n    // Chase what we will output, either {CODE} or {CODE-1}.\n    var chase_length = 0;\n    var chase = chase_code;\n    while (chase > clear_code) {\n      chase = code_table[chase] >> 8;\n      ++chase_length;\n    }\n    var k = chase;\n    var op_end = op + chase_length + (chase_code !== code ? 1 : 0);\n    if (op_end > output_length) {\n    //console.log(\"Warning, gif stream longer than expected.\");\n      return;\n    }\n    // Already have the first byte from the chase, might as well write it fast.\n    output[op++] = k;\n    op += chase_length;\n    var b = op;  // Track pointer, writing backwards.\n    if (chase_code !== code)  // The case of emitting {CODE-1} + k.\n      output[op++] = k;\n    chase = chase_code;\n    while (chase_length--) {\n      chase = code_table[chase];\n      output[--b] = chase & 0xff;  // Write backwards.\n      chase >>= 8;  // Pull down to the prefix code.\n    }\n    if (prev_code !== null && next_code < 4096) {\n      code_table[next_code++] = prev_code << 8 | k;\n      // TODO(deanm): Figure out this clearing vs code growth logic better.  I\n      // have an feeling that it should just happen somewhere else, for now it\n      // is awkward between when we grow past the max and then hit a clear code.\n      // For now just check if we hit the max 12-bits (then a clear code should\n      // follow, also of course encoded in 12-bits).\n      if (next_code >= code_mask+1 && cur_code_size < 12) {\n        ++cur_code_size;\n        code_mask = code_mask << 1 | 1;\n      }\n    }\n    prev_code = code;\n  }\n  if (op !== output_length) {\n  //console.log(\"Warning, gif stream shorter than expected.\");\n  }\n  return output;\n}\n// CommonJS.\ntry { exports.GifWriter = GifWriter; exports.GifReader = GifReader } catch(e) {}\n })