/* 1131 */\n (function(module, exports, __webpack_require__) {\n\"use strict\";\nvar utils = __webpack_require__(43);\nvar GenericWorker = __webpack_require__(77);\nvar utf8 = __webpack_require__(156);\nvar crc32 = __webpack_require__(304);\nvar signature = __webpack_require__(467);\n/**\n * Transform an integer into a string in hexadecimal.\n * @private\n * @param {number} dec the number to convert.\n * @param {number} bytes the number of bytes to generate.\n * @returns {string} the result.\n */\nvar decToHex = function(dec, bytes) {\n    var hex = \"\", i;\n    for (i = 0; i < bytes; i++) {\n        hex += String.fromCharCode(dec & 0xff);\n        dec = dec >>> 8;\n    }\n    return hex;\n};\n/**\n * Generate the UNIX part of the external file attributes.\n * @param {Object} unixPermissions the unix permissions or null.\n * @param {Boolean} isDir true if the entry is a directory, false otherwise.\n * @return {Number} a 32 bit integer.\n *\n * adapted from http://unix.stackexchange.com/questions/14705/the-zip-formats-external-file-attribute :\n *\n * TTTTsstrwxrwxrwx0000000000ADVSHR\n * ^^^^____________________________ file type, see zipinfo.c (UNX_*)\n *     ^^^_________________________ setuid, setgid, sticky\n *        ^^^^^^^^^________________ permissions\n *                 ^^^^^^^^^^______ not used ?\n *                           ^^^^^^ DOS attribute bits : Archive, Directory, Volume label, System file, Hidden, Read only\n */\nvar generateUnixExternalFileAttr = function (unixPermissions, isDir) {\n    var result = unixPermissions;\n    if (!unixPermissions) {\n        // I can't use octal values in strict mode, hence the hexa.\n        //  040775 => 0x41fd\n        // 0100664 => 0x81b4\n        result = isDir ? 0x41fd : 0x81b4;\n    }\n    return (result & 0xFFFF) << 16;\n};\n/**\n * Generate the DOS part of the external file attributes.\n * @param {Object} dosPermissions the dos permissions or null.\n * @param {Boolean} isDir true if the entry is a directory, false otherwise.\n * @return {Number} a 32 bit integer.\n *\n * Bit 0     Read-Only\n * Bit 1     Hidden\n * Bit 2     System\n * Bit 3     Volume Label\n * Bit 4     Directory\n * Bit 5     Archive\n */\nvar generateDosExternalFileAttr = function (dosPermissions, isDir) {\n    // the dir flag is already set for compatibility\n    return (dosPermissions || 0)  & 0x3F;\n};\n/**\n * Generate the various parts used in the construction of the final zip file.\n * @param {Object} streamInfo the hash with informations about the compressed file.\n * @param {Boolean} streamedContent is the content streamed ?\n * @param {Boolean} streamingEnded is the stream finished ?\n * @param {number} offset the current offset from the start of the zip file.\n * @param {String} platform let's pretend we are this platform (change platform dependents fields)\n * @param {Function} encodeFileName the function to encode the file name / comment.\n * @return {Object} the zip parts.\n */\nvar generateZipParts = function(streamInfo, streamedContent, streamingEnded, offset, platform, encodeFileName) {\n    var file = streamInfo['file'],\n    compression = streamInfo['compression'],\n    useCustomEncoding = encodeFileName !== utf8.utf8encode,\n    encodedFileName = utils.transformTo(\"string\", encodeFileName(file.name)),\n    utfEncodedFileName = utils.transformTo(\"string\", utf8.utf8encode(file.name)),\n    comment = file.comment,\n    encodedComment = utils.transformTo(\"string\", encodeFileName(comment)),\n    utfEncodedComment = utils.transformTo(\"string\", utf8.utf8encode(comment)),\n    useUTF8ForFileName = utfEncodedFileName.length !== file.name.length,\n    useUTF8ForComment = utfEncodedComment.length !== comment.length,\n    dosTime,\n    dosDate,\n    extraFields = \"\",\n    unicodePathExtraField = \"\",\n    unicodeCommentExtraField = \"\",\n    dir = file.dir,\n    date = file.date;\n    var dataInfo = {\n        crc32 : 0,\n        compressedSize : 0,\n        uncompressedSize : 0\n    };\n    // if the content is streamed, the sizes/crc32 are only available AFTER\n    // the end of the stream.\n    if (!streamedContent || streamingEnded) {\n        dataInfo.crc32 = streamInfo['crc32'];\n        dataInfo.compressedSize = streamInfo['compressedSize'];\n        dataInfo.uncompressedSize = streamInfo['uncompressedSize'];\n    }\n    var bitflag = 0;\n    if (streamedContent) {\n        // Bit 3: the sizes/crc32 are set to zero in the local header.\n        // The correct values are put in the data descriptor immediately\n        // following the compressed data.\n        bitflag |= 0x0008;\n    }\n    if (!useCustomEncoding && (useUTF8ForFileName || useUTF8ForComment)) {\n        // Bit 11: Language encoding flag (EFS).\n        bitflag |= 0x0800;\n    }\n    var extFileAttr = 0;\n    var versionMadeBy = 0;\n    if (dir) {\n        // dos or unix, we set the dos dir flag\n        extFileAttr |= 0x00010;\n    }\n    if(platform === \"UNIX\") {\n        versionMadeBy = 0x031E; // UNIX, version 3.0\n        extFileAttr |= generateUnixExternalFileAttr(file.unixPermissions, dir);\n    } else { // DOS or other, fallback to DOS\n        versionMadeBy = 0x0014; // DOS, version 2.0\n        extFileAttr |= generateDosExternalFileAttr(file.dosPermissions, dir);\n    }\n    // date\n    // @see http://www.delorie.com/djgpp/doc/rbinter/it/52/13.html\n    // @see http://www.delorie.com/djgpp/doc/rbinter/it/65/16.html\n    // @see http://www.delorie.com/djgpp/doc/rbinter/it/66/16.html\n    dosTime = date.getUTCHours();\n    dosTime = dosTime << 6;\n    dosTime = dosTime | date.getUTCMinutes();\n    dosTime = dosTime << 5;\n    dosTime = dosTime | date.getUTCSeconds() / 2;\n    dosDate = date.getUTCFullYear() - 1980;\n    dosDate = dosDate << 4;\n    dosDate = dosDate | (date.getUTCMonth() + 1);\n    dosDate = dosDate << 5;\n    dosDate = dosDate | date.getUTCDate();\n    if (useUTF8ForFileName) {\n        // set the unicode path extra field. unzip needs at least one extra\n        // field to correctly handle unicode path, so using the path is as good\n        // as any other information. This could improve the situation with\n        // other archive managers too.\n        // This field is usually used without the utf8 flag, with a non\n        // unicode path in the header (winrar, winzip). This helps (a bit)\n        // with the messy Windows' default compressed folders feature but\n        // breaks on p7zip which doesn't seek the unicode path extra field.\n        // So for now, UTF-8 everywhere !\n        unicodePathExtraField =\n            // Version\n            decToHex(1, 1) +\n            // NameCRC32\n            decToHex(crc32(encodedFileName), 4) +\n            // UnicodeName\n            utfEncodedFileName;\n        extraFields +=\n            // Info-ZIP Unicode Path Extra Field\n            \"\\x75\\x70\" +\n            // size\n            decToHex(unicodePathExtraField.length, 2) +\n            // content\n            unicodePathExtraField;\n    }\n    if(useUTF8ForComment) {\n        unicodeCommentExtraField =\n            // Version\n            decToHex(1, 1) +\n            // CommentCRC32\n            decToHex(crc32(encodedComment), 4) +\n            // UnicodeName\n            utfEncodedComment;\n        extraFields +=\n            // Info-ZIP Unicode Path Extra Field\n            \"\\x75\\x63\" +\n            // size\n            decToHex(unicodeCommentExtraField.length, 2) +\n            // content\n            unicodeCommentExtraField;\n    }\n    var header = \"\";\n    // version needed to extract\n    header += \"\\x0A\\x00\";\n    // general purpose bit flag\n    header += decToHex(bitflag, 2);\n    // compression method\n    header += compression.magic;\n    // last mod file time\n    header += decToHex(dosTime, 2);\n    // last mod file date\n    header += decToHex(dosDate, 2);\n    // crc-32\n    header += decToHex(dataInfo.crc32, 4);\n    // compressed size\n    header += decToHex(dataInfo.compressedSize, 4);\n    // uncompressed size\n    header += decToHex(dataInfo.uncompressedSize, 4);\n    // file name length\n    header += decToHex(encodedFileName.length, 2);\n    // extra field length\n    header += decToHex(extraFields.length, 2);\n    var fileRecord = signature.LOCAL_FILE_HEADER + header + encodedFileName + extraFields;\n    var dirRecord = signature.CENTRAL_FILE_HEADER +\n        // version made by (00: DOS)\n        decToHex(versionMadeBy, 2) +\n        // file header (common to file and central directory)\n        header +\n        // file comment length\n        decToHex(encodedComment.length, 2) +\n        // disk number start\n        \"\\x00\\x00\" +\n        // internal file attributes TODO\n        \"\\x00\\x00\" +\n        // external file attributes\n        decToHex(extFileAttr, 4) +\n        // relative offset of local header\n        decToHex(offset, 4) +\n        // file name\n        encodedFileName +\n        // extra field\n        extraFields +\n        // file comment\n        encodedComment;\n    return {\n        fileRecord: fileRecord,\n        dirRecord: dirRecord\n    };\n};\n/**\n * Generate the EOCD record.\n * @param {Number} entriesCount the number of entries in the zip file.\n * @param {Number} centralDirLength the length (in bytes) of the central dir.\n * @param {Number} localDirLength the length (in bytes) of the local dir.\n * @param {String} comment the zip file comment as a binary string.\n * @param {Function} encodeFileName the function to encode the comment.\n * @return {String} the EOCD record.\n */\nvar generateCentralDirectoryEnd = function (entriesCount, centralDirLength, localDirLength, comment, encodeFileName) {\n    var dirEnd = \"\";\n    var encodedComment = utils.transformTo(\"string\", encodeFileName(comment));\n    // end of central dir signature\n    dirEnd = signature.CENTRAL_DIRECTORY_END +\n        // number of this disk\n        \"\\x00\\x00\" +\n        // number of the disk with the start of the central directory\n        \"\\x00\\x00\" +\n        // total number of entries in the central directory on this disk\n        decToHex(entriesCount, 2) +\n        // total number of entries in the central directory\n        decToHex(entriesCount, 2) +\n        // size of the central directory   4 bytes\n        decToHex(centralDirLength, 4) +\n        // offset of start of central directory with respect to the starting disk number\n        decToHex(localDirLength, 4) +\n        // .ZIP file comment length\n        decToHex(encodedComment.length, 2) +\n        // .ZIP file comment\n        encodedComment;\n    return dirEnd;\n};\n/**\n * Generate data descriptors for a file entry.\n * @param {Object} streamInfo the hash generated by a worker, containing informations\n * on the file entry.\n * @return {String} the data descriptors.\n */\nvar generateDataDescriptors = function (streamInfo) {\n    var descriptor = \"\";\n    descriptor = signature.DATA_DESCRIPTOR +\n        // crc-32                          4 bytes\n        decToHex(streamInfo['crc32'], 4) +\n        // compressed size                 4 bytes\n        decToHex(streamInfo['compressedSize'], 4) +\n        // uncompressed size               4 bytes\n        decToHex(streamInfo['uncompressedSize'], 4);\n    return descriptor;\n};\n/**\n * A worker to concatenate other workers to create a zip file.\n * @param {Boolean} streamFiles `true` to stream the content of the files,\n * `false` to accumulate it.\n * @param {String} comment the comment to use.\n * @param {String} platform the platform to use, \"UNIX\" or \"DOS\".\n * @param {Function} encodeFileName the function to encode file names and comments.\n */\nfunction ZipFileWorker(streamFiles, comment, platform, encodeFileName) {\n    GenericWorker.call(this, \"ZipFileWorker\");\n    // The number of bytes written so far. This doesn't count accumulated chunks.\n    this.bytesWritten = 0;\n    // The comment of the zip file\n    this.zipComment = comment;\n    // The platform \"generating\" the zip file.\n    this.zipPlatform = platform;\n    // the function to encode file names and comments.\n    this.encodeFileName = encodeFileName;\n    // Should we stream the content of the files ?\n    this.streamFiles = streamFiles;\n    // If `streamFiles` is false, we will need to accumulate the content of the\n    // files to calculate sizes / crc32 (and write them *before* the content).\n    // This boolean indicates if we are accumulating chunks (it will change a lot\n    // during the lifetime of this worker).\n    this.accumulate = false;\n    // The buffer receiving chunks when accumulating content.\n    this.contentBuffer = [];\n    // The list of generated directory records.\n    this.dirRecords = [];\n    // The offset (in bytes) from the beginning of the zip file for the current source.\n    this.currentSourceOffset = 0;\n    // The total number of entries in this zip file.\n    this.entriesCount = 0;\n    // the name of the file currently being added, null when handling the end of the zip file.\n    // Used for the emited metadata.\n    this.currentFile = null;\n    this._sources = [];\n}\nutils.inherits(ZipFileWorker, GenericWorker);\n/**\n * @see GenericWorker.push\n */\nZipFileWorker.prototype.push = function (chunk) {\n    var currentFilePercent = chunk.meta.percent || 0;\n    var entriesCount = this.entriesCount;\n    var remainingFiles = this._sources.length;\n    if(this.accumulate) {\n        this.contentBuffer.push(chunk);\n    } else {\n        this.bytesWritten += chunk.data.length;\n        GenericWorker.prototype.push.call(this, {\n            data : chunk.data,\n            meta : {\n                currentFile : this.currentFile,\n                percent : entriesCount ? (currentFilePercent + 100 * (entriesCount - remainingFiles - 1)) / entriesCount : 100\n            }\n        });\n    }\n};\n/**\n * The worker started a new source (an other worker).\n * @param {Object} streamInfo the streamInfo object from the new source.\n */\nZipFileWorker.prototype.openedSource = function (streamInfo) {\n    this.currentSourceOffset = this.bytesWritten;\n    this.currentFile = streamInfo['file'].name;\n    var streamedContent = this.streamFiles && !streamInfo['file'].dir;\n    // don't stream folders (because they don't have any content)\n    if(streamedContent) {\n        var record = generateZipParts(streamInfo, streamedContent, false, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);\n        this.push({\n            data : record.fileRecord,\n            meta : {percent:0}\n        });\n    } else {\n        // we need to wait for the whole file before pushing anything\n        this.accumulate = true;\n    }\n};\n/**\n * The worker finished a source (an other worker).\n * @param {Object} streamInfo the streamInfo object from the finished source.\n */\nZipFileWorker.prototype.closedSource = function (streamInfo) {\n    this.accumulate = false;\n    var streamedContent = this.streamFiles && !streamInfo['file'].dir;\n    var record = generateZipParts(streamInfo, streamedContent, true, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);\n    this.dirRecords.push(record.dirRecord);\n    if(streamedContent) {\n        // after the streamed file, we put data descriptors\n        this.push({\n            data : generateDataDescriptors(streamInfo),\n            meta : {percent:100}\n        });\n    } else {\n        // the content wasn't streamed, we need to push everything now\n        // first the file record, then the content\n        this.push({\n            data : record.fileRecord,\n            meta : {percent:0}\n        });\n        while(this.contentBuffer.length) {\n            this.push(this.contentBuffer.shift());\n        }\n    }\n    this.currentFile = null;\n};\n/**\n * @see GenericWorker.flush\n */\nZipFileWorker.prototype.flush = function () {\n    var localDirLength = this.bytesWritten;\n    for(var i = 0; i < this.dirRecords.length; i++) {\n        this.push({\n            data : this.dirRecords[i],\n            meta : {percent:100}\n        });\n    }\n    var centralDirLength = this.bytesWritten - localDirLength;\n    var dirEnd = generateCentralDirectoryEnd(this.dirRecords.length, centralDirLength, localDirLength, this.zipComment, this.encodeFileName);\n    this.push({\n        data : dirEnd,\n        meta : {percent:100}\n    });\n};\n/**\n * Prepare the next source to be read.\n */\nZipFileWorker.prototype.prepareNextSource = function () {\n    this.previous = this._sources.shift();\n    this.openedSource(this.previous.streamInfo);\n    if (this.isPaused) {\n        this.previous.pause();\n    } else {\n        this.previous.resume();\n    }\n};\n/**\n * @see GenericWorker.registerPrevious\n */\nZipFileWorker.prototype.registerPrevious = function (previous) {\n    this._sources.push(previous);\n    var self = this;\n    previous.on('data', function (chunk) {\n        self.processChunk(chunk);\n    });\n    previous.on('end', function () {\n        self.closedSource(self.previous.streamInfo);\n        if(self._sources.length) {\n            self.prepareNextSource();\n        } else {\n            self.end();\n        }\n    });\n    previous.on('error', function (e) {\n        self.error(e);\n    });\n    return this;\n};\n/**\n * @see GenericWorker.resume\n */\nZipFileWorker.prototype.resume = function () {\n    if(!GenericWorker.prototype.resume.call(this)) {\n        return false;\n    }\n    if (!this.previous && this._sources.length) {\n        this.prepareNextSource();\n        return true;\n    }\n    if (!this.previous && !this._sources.length && !this.generatedError) {\n        this.end();\n        return true;\n    }\n};\n/**\n * @see GenericWorker.error\n */\nZipFileWorker.prototype.error = function (e) {\n    var sources = this._sources;\n    if(!GenericWorker.prototype.error.call(this, e)) {\n        return false;\n    }\n    for(var i = 0; i < sources.length; i++) {\n        try {\n            sources[i].error(e);\n        } catch(e) {\n            // the `error` exploded, nothing to do\n        }\n    }\n    return true;\n};\n/**\n * @see GenericWorker.lock\n */\nZipFileWorker.prototype.lock = function () {\n    GenericWorker.prototype.lock.call(this);\n    var sources = this._sources;\n    for(var i = 0; i < sources.length; i++) {\n        sources[i].lock();\n    }\n};\nmodule.exports = ZipFileWorker;\n })