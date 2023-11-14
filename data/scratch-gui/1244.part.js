/* 1244 */\n (function(module, exports) {\nfunction _cross(o, a, b) {\n    return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);\n}\nfunction _upperTangent(pointset) {\n    var lower = [];\n    for (var l = 0; l < pointset.length; l++) {\n        while (lower.length >= 2 && (_cross(lower[lower.length - 2], lower[lower.length - 1], pointset[l]) <= 0)) {\n            lower.pop();\n        }\n        lower.push(pointset[l]);\n    }\n    lower.pop();\n    return lower;\n}\nfunction _lowerTangent(pointset) {\n    var reversed = pointset.reverse(),\n        upper = [];\n    for (var u = 0; u < reversed.length; u++) {\n        while (upper.length >= 2 && (_cross(upper[upper.length - 2], upper[upper.length - 1], reversed[u]) <= 0)) {\n            upper.pop();\n        }\n        upper.push(reversed[u]);\n    }\n    upper.pop();\n    return upper;\n}\n// pointset has to be sorted by X\nfunction convex(pointset) {\n    var convex,\n        upper = _upperTangent(pointset),\n        lower = _lowerTangent(pointset);\n    convex = lower.concat(upper);\n    convex.push(pointset[0]);  \n    return convex;  \n}\nmodule.exports = convex;\n })