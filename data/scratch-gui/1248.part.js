/* 1248 */\n (function(module, exports) {\nmodule.exports = \"precision mediump float;\\n\\n#ifdef DRAW_MODE_line\\nuniform vec2 u_stageSize;\\nuniform float u_lineThickness;\\nuniform float u_lineLength;\\n// The X and Y components of u_penPoints hold the first pen point. The Z and W components hold the difference between\\n// the second pen point and the first. This is done because calculating the difference in the shader leads to floating-\\n// point error when both points have large-ish coordinates.\\nuniform vec4 u_penPoints;\\n\\n// Add this to divisors to prevent division by 0, which results in NaNs propagating through calculations.\\n// Smaller values can cause problems on some mobile devices.\\nconst float epsilon = 1e-3;\\n#endif\\n\\n#if !(defined(DRAW_MODE_line) || defined(DRAW_MODE_background))\\nuniform mat4 u_projectionMatrix;\\nuniform mat4 u_modelMatrix;\\nattribute vec2 a_texCoord;\\n#endif\\n\\nattribute vec2 a_position;\\n\\nvarying vec2 v_texCoord;\\n\\nvoid main() {\\n\\t#ifdef DRAW_MODE_line\\n\\t// Calculate a rotated (\\\"tight\\\") bounding box around the two pen points.\\n\\t// Yes, we're doing this 6 times (once per vertex), but on actual GPU hardware,\\n\\t// it's still faster than doing it in JS combined with the cost of uniformMatrix4fv.\\n\\n\\t// Expand line bounds by sqrt(2) / 2 each side-- this ensures that all antialiased pixels\\n\\t// fall within the quad, even at a 45-degree diagonal\\n\\tvec2 position = a_position;\\n\\tfloat expandedRadius = (u_lineThickness * 0.5) + 1.4142135623730951;\\n\\n\\t// The X coordinate increases along the length of the line. It's 0 at the center of the origin point\\n\\t// and is in pixel-space (so at n pixels along the line, its value is n).\\n\\tv_texCoord.x = mix(0.0, u_lineLength + (expandedRadius * 2.0), a_position.x) - expandedRadius;\\n\\t// The Y coordinate is perpendicular to the line. It's also in pixel-space.\\n\\tv_texCoord.y = ((a_position.y - 0.5) * expandedRadius) + 0.5;\\n\\n\\tposition.x *= u_lineLength + (2.0 * expandedRadius);\\n\\tposition.y *= 2.0 * expandedRadius;\\n\\n\\t// 1. Center around first pen point\\n\\tposition -= expandedRadius;\\n\\n\\t// 2. Rotate quad to line angle\\n\\tvec2 pointDiff = u_penPoints.zw;\\n\\t// Ensure line has a nonzero length so it's rendered properly\\n\\t// As long as either component is nonzero, the line length will be nonzero\\n\\t// If the line is zero-length, give it a bit of horizontal length\\n\\tpointDiff.x = (abs(pointDiff.x) < epsilon && abs(pointDiff.y) < epsilon) ? epsilon : pointDiff.x;\\n\\t// The `normalized` vector holds rotational values equivalent to sine/cosine\\n\\t// We're applying the standard rotation matrix formula to the position to rotate the quad to the line angle\\n\\t// pointDiff can hold large values so we must divide by u_lineLength instead of calling GLSL's normalize function:\\n\\t// https://asawicki.info/news_1596_watch_out_for_reduced_precision_normalizelength_in_opengl_es\\n\\tvec2 normalized = pointDiff / max(u_lineLength, epsilon);\\n\\tposition = mat2(normalized.x, normalized.y, -normalized.y, normalized.x) * position;\\n\\n\\t// 3. Translate quad\\n\\tposition += u_penPoints.xy;\\n\\n\\t// 4. Apply view transform\\n\\tposition *= 2.0 / u_stageSize;\\n\\tgl_Position = vec4(position, 0, 1);\\n\\t#elif defined(DRAW_MODE_background)\\n\\tgl_Position = vec4(a_position * 2.0, 0, 1);\\n\\t#else\\n\\tgl_Position = u_projectionMatrix * u_modelMatrix * vec4(a_position, 0, 1);\\n\\tv_texCoord = a_texCoord;\\n\\t#endif\\n}\\n\"\n })