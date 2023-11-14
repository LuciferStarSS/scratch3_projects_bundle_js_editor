/* 1367 */
 (function(module, exports) {
eval("module.exports = {\"$id\":\"https://scratch.mit.edu/sb3_schema.json\",\"$schema\":\"http://json-schema.org/schema#\",\"description\":\"Scratch 3.0 Project Schema\",\"type\":\"object\",\"properties\":{\"meta\":{\"type\":\"object\",\"properties\":{\"semver\":{\"type\":\"string\",\"pattern\":\"^(3\\\\.[0-9]+\\\\.[0-9]+)$\"},\"vm\":{\"type\":\"string\",\"pattern\":\"^([0-9]+\\\\.[0-9]+\\\\.[0-9]+)($|-)\"},\"agent\":{\"type\":\"string\"}},\"required\":[\"semver\"]},\"targets\":{\"type\":\"array\",\"items\":[{\"allOf\":[{\"$ref\":\"sb3_definitions.json#/definitions/stage\"},{\"$ref\":\"sb3_definitions.json#/definitions/target\"}]}],\"additionalItems\":{\"allOf\":[{\"$ref\":\"sb3_definitions.json#/definitions/sprite\"},{\"$ref\":\"sb3_definitions.json#/definitions/target\"}]}}},\"required\":[\"meta\",\"targets\"]}\n// ./~/scratch-parser/lib/sb3_schema.json\n// module id = 1367\n// module chunks = 0\n//# sourceURL=scratch:///./~/scratch-parser/lib/sb3_schema.json?");
 })