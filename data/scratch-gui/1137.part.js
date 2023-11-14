/* 1137 */\n (function(module, exports, __webpack_require__) {\n\"use strict\";\nvar readerFor = __webpack_require__(468);\nvar utils = __webpack_require__(43);\nvar CompressedObject = __webpack_require__(303);\nvar crc32fn = __webpack_require__(304);\nvar utf8 = __webpack_require__(156);\nvar compressions = __webpack_require__(466);\nvar support = __webpack_require__(116);\nvar MADE_BY_DOS = 0x00;\nvar MADE_BY_UNIX = 0x03;\n/**\n * Find a compression registered in JSZip.\n * @param {string} compressionMethod the method magic to find.\n * @return {Object|null} the JSZip compression object, null if none found.\n */\nvar findCompression = function(compressionMethod) {\n    for (var method in compressions) {\n        if (!compressions.hasOwnProperty(method)) {\n            continue;\n        }\n        if (compressions[method].magic === compressionMethod) {\n            return compressions[method];\n        }\n    }\n    return null;\n};\n// class ZipEntry {{{\n/**\n * An entry in the zip file.\n * @constructor\n * @param {Object} options Options of the current file.\n * @param {Object} loadOptions Options for loading the stream.\n */\nfunction ZipEntry(options, loadOptions) {\n    this.options = options;\n    this.loadOptions = loadOptions;\n}\nZipEntry.prototype = {\n    /**\n     * say if the file is encrypted.\n     * @return {boolean} true if the file is encrypted, false otherwise.\n     */\n    isEncrypted: function() {\n        // bit 1 is set\n        return (this.bitFlag & 0x0001) === 0x0001;\n    },\n    /**\n     * say if the file has utf-8 filename/comment.\n     * @return {boolean} true if the filename/comment is in utf-8, false otherwise.\n     */\n    useUTF8: function() {\n        // bit 11 is set\n        return (this.bitFlag & 0x0800) === 0x0800;\n    },\n    /**\n     * Read the local part of a zip file and add the info in this object.\n     * @param {DataReader} reader the reader to use.\n     */\n    readLocalPart: function(reader) {\n        var compression, localExtraFieldsLength;\n        // we already know everything from the central dir !\n        // If the central dir data are false, we are doomed.\n        // On the bright side, the local part is scary  : zip64, data descriptors, both, etc.\n        // The less data we get here, the more reliable this should be.\n        // Let's skip the whole header and dash to the data !\n        reader.skip(22);\n        // in some zip created on windows, the filename stored in the central dir contains \\ instead of /.\n        // Strangely, the filename here is OK.\n        // I would love to treat these zip files as corrupted (see http://www.info-zip.org/FAQ.html#backslashes\n        // or APPNOTE#4.4.17.1, \"All slashes MUST be forward slashes '/'\") but there are a lot of bad zip generators...\n        // Search \"unzip mismatching \"local\" filename continuing with \"central\" filename version\" on\n        // the internet.\n        //\n        // I think I see the logic here : the central directory is used to display\n        // content and the local directory is used to extract the files. Mixing / and \\\n        // may be used to display \\ to windows users and use / when extracting the files.\n        // Unfortunately, this lead also to some issues : http://seclists.org/fulldisclosure/2009/Sep/394\n        this.fileNameLength = reader.readInt(2);\n        localExtraFieldsLength = reader.readInt(2); // can't be sure this will be the same as the central dir\n        // the fileName is stored as binary data, the handleUTF8 method will take care of the encoding.\n        this.fileName = reader.readData(this.fileNameLength);\n        reader.skip(localExtraFieldsLength);\n        if (this.compressedSize === -1 || this.uncompressedSize === -1) {\n            throw new Error(\"Bug or corrupted zip : didn't get enough informations from the central directory \" + \"(compressedSize === -1 || uncompressedSize === -1)\");\n        }\n        compression = findCompression(this.compressionMethod);\n        if (compression === null) { // no compression found\n            throw new Error(\"Corrupted zip : compression \" + utils.pretty(this.compressionMethod) + \" unknown (inner file : \" + utils.transformTo(\"string\", this.fileName) + \")\");\n        }\n        this.decompressed = new CompressedObject(this.compressedSize, this.uncompressedSize, this.crc32, compression, reader.readData(this.compressedSize));\n    },\n    /**\n     * Read the central part of a zip file and add the info in this object.\n     * @param {DataReader} reader the reader to use.\n     */\n    readCentralPart: function(reader) {\n        this.versionMadeBy = reader.readInt(2);\n        reader.skip(2);\n        // this.versionNeeded = reader.readInt(2);\n        this.bitFlag = reader.readInt(2);\n        this.compressionMethod = reader.readString(2);\n        this.date = reader.readDate();\n        this.crc32 = reader.readInt(4);\n        this.compressedSize = reader.readInt(4);\n        this.uncompressedSize = reader.readInt(4);\n        var fileNameLength = reader.readInt(2);\n        this.extraFieldsLength = reader.readInt(2);\n        this.fileCommentLength = reader.readInt(2);\n        this.diskNumberStart = reader.readInt(2);\n        this.internalFileAttributes = reader.readInt(2);\n        this.externalFileAttributes = reader.readInt(4);\n        this.localHeaderOffset = reader.readInt(4);\n        if (this.isEncrypted()) {\n            throw new Error(\"Encrypted zip are not supported\");\n        }\n        // will be read in the local part, see the comments there\n        reader.skip(fileNameLength);\n        this.readExtraFields(reader);\n        this.parseZIP64ExtraField(reader);\n        this.fileComment = reader.readData(this.fileCommentLength);\n    },\n    /**\n     * Parse the external file attributes and get the unix/dos permissions.\n     */\n    processAttributes: function () {\n        this.unixPermissions = null;\n        this.dosPermissions = null;\n        var madeBy = this.versionMadeBy >> 8;\n        // Check if we have the DOS directory flag set.\n        // We look for it in the DOS and UNIX permissions\n        // but some unknown platform could set it as a compatibility flag.\n        this.dir = this.externalFileAttributes & 0x0010 ? true : false;\n        if(madeBy === MADE_BY_DOS) {\n            // first 6 bits (0 to 5)\n            this.dosPermissions = this.externalFileAttributes & 0x3F;\n        }\n        if(madeBy === MADE_BY_UNIX) {\n            this.unixPermissions = (this.externalFileAttributes >> 16) & 0xFFFF;\n            // the octal permissions are in (this.unixPermissions & 0x01FF).toString(8);\n        }\n        // fail safe : if the name ends with a / it probably means a folder\n        if (!this.dir && this.fileNameStr.slice(-1) === '/') {\n            this.dir = true;\n        }\n    },\n    /**\n     * Parse the ZIP64 extra field and merge the info in the current ZipEntry.\n     * @param {DataReader} reader the reader to use.\n     */\n    parseZIP64ExtraField: function(reader) {\n        if (!this.extraFields[0x0001]) {\n            return;\n        }\n        // should be something, preparing the extra reader\n        var extraReader = readerFor(this.extraFields[0x0001].value);\n        // I really hope that these 64bits integer can fit in 32 bits integer, because js\n        // won't let us have more.\n        if (this.uncompressedSize === utils.MAX_VALUE_32BITS) {\n            this.uncompressedSize = extraReader.readInt(8);\n        }\n        if (this.compressedSize === utils.MAX_VALUE_32BITS) {\n            this.compressedSize = extraReader.readInt(8);\n        }\n        if (this.localHeaderOffset === utils.MAX_VALUE_32BITS) {\n            this.localHeaderOffset = extraReader.readInt(8);\n        }\n        if (this.diskNumberStart === utils.MAX_VALUE_32BITS) {\n            this.diskNumberStart = extraReader.readInt(4);\n        }\n    },\n    /**\n     * Read the central part of a zip file and add the info in this object.\n     * @param {DataReader} reader the reader to use.\n     */\n    readExtraFields: function(reader) {\n        var end = reader.index + this.extraFieldsLength,\n            extraFieldId,\n            extraFieldLength,\n            extraFieldValue;\n        if (!this.extraFields) {\n            this.extraFields = {};\n        }\n        while (reader.index < end) {\n            extraFieldId = reader.readInt(2);\n            extraFieldLength = reader.readInt(2);\n            extraFieldValue = reader.readData(extraFieldLength);\n            this.extraFields[extraFieldId] = {\n                id: extraFieldId,\n                length: extraFieldLength,\n                value: extraFieldValue\n            };\n        }\n    },\n    /**\n     * Apply an UTF8 transformation if needed.\n     */\n    handleUTF8: function() {\n        var decodeParamType = support.uint8array ? \"uint8array\" : \"array\";\n        if (this.useUTF8()) {\n            this.fileNameStr = utf8.utf8decode(this.fileName);\n            this.fileCommentStr = utf8.utf8decode(this.fileComment);\n        } else {\n            var upath = this.findExtraFieldUnicodePath();\n            if (upath !== null) {\n                this.fileNameStr = upath;\n            } else {\n                // ASCII text or unsupported code page\n                var fileNameByteArray =  utils.transformTo(decodeParamType, this.fileName);\n                this.fileNameStr = this.loadOptions.decodeFileName(fileNameByteArray);\n            }\n            var ucomment = this.findExtraFieldUnicodeComment();\n            if (ucomment !== null) {\n                this.fileCommentStr = ucomment;\n            } else {\n                // ASCII text or unsupported code page\n                var commentByteArray =  utils.transformTo(decodeParamType, this.fileComment);\n                this.fileCommentStr = this.loadOptions.decodeFileName(commentByteArray);\n            }\n        }\n    },\n    /**\n     * Find the unicode path declared in the extra field, if any.\n     * @return {String} the unicode path, null otherwise.\n     */\n    findExtraFieldUnicodePath: function() {\n        var upathField = this.extraFields[0x7075];\n        if (upathField) {\n            var extraReader = readerFor(upathField.value);\n            // wrong version\n            if (extraReader.readInt(1) !== 1) {\n                return null;\n            }\n            // the crc of the filename changed, this field is out of date.\n            if (crc32fn(this.fileName) !== extraReader.readInt(4)) {\n                return null;\n            }\n            return utf8.utf8decode(extraReader.readData(upathField.length - 5));\n        }\n        return null;\n    },\n    /**\n     * Find the unicode comment declared in the extra field, if any.\n     * @return {String} the unicode comment, null otherwise.\n     */\n    findExtraFieldUnicodeComment: function() {\n        var ucommentField = this.extraFields[0x6375];\n        if (ucommentField) {\n            var extraReader = readerFor(ucommentField.value);\n            // wrong version\n            if (extraReader.readInt(1) !== 1) {\n                return null;\n            }\n            // the crc of the comment changed, this field is out of date.\n            if (crc32fn(this.fileComment) !== extraReader.readInt(4)) {\n                return null;\n            }\n            return utf8.utf8decode(extraReader.readData(ucommentField.length - 5));\n        }\n        return null;\n    }\n};\nmodule.exports = ZipEntry;\n })