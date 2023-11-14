/* 938 */
 (function(module, exports, __webpack_require__) {
"use strict";
eval("\nmodule.exports = {};\nmodule.exports.projectUrl = function (projectId) {\n    if (projectId) {\n        return 'https://scratch.mit.edu/projects/' + projectId;\n    }\n    return '';\n};\nmodule.exports.embedHtml = function (projectId) {\n    if (projectId) {\n        return '<iframe src=\"https://scratch.mit.edu/projects/' + projectId + '/embed\" ' + 'allowtransparency=\"true\" width=\"485\" height=\"402\" ' + 'frameborder=\"0\" scrolling=\"no\" allowfullscreen></iframe>';\n    }\n    return '';\n};\n// ./src/lib/social.js\n// module id = 938\n// module chunks = 0\n//# sourceURL=scratch:///./src/lib/social.js?");
 })