/* 1129 */\n (function(module, exports, __webpack_require__) {\n\"use strict\";\nvar compressions = __webpack_require__(466);\nvar ZipFileWorker = __webpack_require__(1131);\n/**\n * Find the compression to use.\n * @param {String} fileCompression the compression defined at the file level, if any.\n * @param {String} zipCompression the compression defined at the load() level.\n * @return {Object} the compression object to use.\n */\nvar getCompression = function (fileCompression, zipCompression) {\n    var compressionName = fileCompression || zipCompression;\n    var compression = compressions[compressionName];\n    if (!compression) {\n        throw new Error(compressionName + \" is not a valid compression method !\");\n    }\n    return compression;\n};\n/**\n * Create a worker to generate a zip file.\n * @param {JSZip} zip the JSZip instance at the right root level.\n * @param {Object} options to generate the zip file.\n * @param {String} comment the comment to use.\n */\nexports.generateWorker = function (zip, options, comment) {\n    var zipFileWorker = new ZipFileWorker(options.streamFiles, comment, options.platform, options.encodeFileName);\n    var entriesCount = 0;\n    try {\n        zip.forEach(function (relativePath, file) {\n            entriesCount++;\n            var compression = getCompression(file.options.compression, options.compression);\n            var compressionOptions = file.options.compressionOptions || options.compressionOptions || {};\n            var dir = file.dir, date = file.date;\n            file._compressWorker(compression, compressionOptions)\n            .withStreamInfo(\"file\", {\n                name : relativePath,\n                dir : dir,\n                date : date,\n                comment : file.comment || \"\",\n                unixPermissions : file.unixPermissions,\n                dosPermissions : file.dosPermissions\n            })\n            .pipe(zipFileWorker);\n        });\n        zipFileWorker.entriesCount = entriesCount;\n    } catch (e) {\n        zipFileWorker.error(e);\n    }\n    return zipFileWorker;\n};\n })