/* 1365 */\n (function(module, exports, __webpack_require__) {\nexports = module.exports = __webpack_require__(9)(false);\n// module\nexports.push([module.i, \"/* make sure to keep these in sync with other constants,\\ne.g. STAGE_DIMENSION_DEFAULTS in lib/screen-utils.js */\\n\\n/* layout contants from `layout-constants.js` */\\n\\n/* #E5F0FF */\\n\\n/* #E9F1FC */\\n\\n/* #D9E3F2 */\\n\\n/* 90% transparent version of motion-primary */\\n\\n/* #FFFFFF */\\n\\n/* 25% transparent version of ui-white */\\n\\n/* 25% transparent version of ui-white */\\n\\n/* 25% transparent version of ui-white */\\n\\n/* 15% transparent version of black */\\n\\n/* #575E75 */\\n\\n/* #4C97FF */\\n\\n/* #3373CC */\\n\\n/* 35% transparent version of motion-primary */\\n\\n/* 15% transparent version of motion-primary */\\n\\n/* #FF661A */\\n\\n/* #E64D00 */\\n\\n/* #CF63CF */\\n\\n/* #BD42BD */\\n\\n/* #FFAB19 */\\n\\n/* #FF8C1A */\\n\\n/* #0FBD8C */\\n\\n/* #0FBD8C */\\n\\n/* #FF8C1A */\\n\\n/* #FFB366 */\\n\\n/* #FF8C1A */\\n\\n/* #0FBD8C */\\n\\n/* #0B8E69 */\\n\\n/* 35% transparent version of extensions-primary */\\n\\n/* opaque version of extensions-transparent, on white bg */\\n\\n/* lighter than motion-primary */\\n\\n.stage-selector_stage-selector_3oWOr {\\n    background-clip: padding-box;\\n    display: -webkit-box;\\n    display: -webkit-flex;\\n    display: -ms-flexbox;\\n    display: flex;\\n    -webkit-box-orient: vertical;\\n    -webkit-box-direction: normal;\\n    -webkit-flex-direction: column;\\n        -ms-flex-direction: column;\\n            flex-direction: column;\\n    -webkit-box-align: center;\\n    -webkit-align-items: center;\\n        -ms-flex-align: center;\\n            align-items: center;\\n    position: relative; /* For the add backdrop button */\\n    -webkit-box-flex: 1;\\n    -webkit-flex-grow: 1;\\n        -ms-flex-positive: 1;\\n            flex-grow: 1;\\n    font-family: \\\"Helvetica Neue\\\", Helvetica, Arial, sans-serif;\\n    background-color: hsla(0, 100%, 100%, 1);\\n    color: hsla(225, 15%, 40%, 1);\\n    border-top-left-radius: 0.5rem;\\n    border-top-right-radius: 0.5rem;\\n    border-color: hsla(0, 0%, 0%, 0.15);\\n    border-width: 1px;\\n    border-style: solid;\\n    border-bottom: 0;\\n    cursor: pointer;\\n    -webkit-transition: all 0.25s ease;\\n    -o-transition: all 0.25s ease;\\n    transition: all 0.25s ease;\\n}\\n\\n.stage-selector_stage-selector_3oWOr.stage-selector_is-selected_2x2r_ {\\n    border-top-left-radius: .625rem;\\n    border-top-right-radius: .625rem;\\n    border-color: hsla(215, 100%, 65%, 1);\\n    -webkit-box-shadow: 0px 0px 0px 4px hsla(215, 100%, 65%, 0.35);\\n            box-shadow: 0px 0px 0px 4px hsla(215, 100%, 65%, 0.35);\\n}\\n\\n.stage-selector_stage-selector_3oWOr:hover {\\n    border-color: hsla(215, 100%, 65%, 1);\\n}\\n\\n.stage-selector_header_2GVr1 {\\n    display: -webkit-box;\\n    display: -webkit-flex;\\n    display: -ms-flexbox;\\n    display: flex;\\n    -webkit-box-orient: vertical;\\n    -webkit-box-direction: normal;\\n    -webkit-flex-direction: column;\\n        -ms-flex-direction: column;\\n            flex-direction: column;\\n    -webkit-box-align: center;\\n    -webkit-align-items: center;\\n        -ms-flex-align: center;\\n            align-items: center;\\n    -webkit-box-pack: center;\\n    -webkit-justify-content: center;\\n        -ms-flex-pack: center;\\n            justify-content: center;\\n    height: calc(2.75rem - 2px);\\n    background-color: white;\\n    color: hsla(225, 15%, 40%, 1);\\n    border-top-left-radius: 0.5rem;\\n    border-top-right-radius: 0.5rem;\\n    border-bottom: 1px solid hsla(0, 0%, 0%, 0.15);\\n    width: 100%;\\n    -webkit-transition: background-color 0.25s ease;\\n    -o-transition: background-color 0.25s ease;\\n    transition: background-color 0.25s ease;\\n}\\n\\n.stage-selector_header-title_33xCt {\\n    font-size: 0.850rem;\\n    font-weight: bold;\\n    color: hsla(225, 15%, 40%, 1);\\n\\n    /* @todo: make this a mixin for all UI text labels */\\n    -webkit-user-select: none;\\n       -moz-user-select: none;\\n        -ms-user-select: none;\\n            user-select: none;\\n    -webkit-transition: color 0.25s ease;\\n    -o-transition: color 0.25s ease;\\n    transition: color 0.25s ease;\\n}\\n\\n.stage-selector_stage-selector_3oWOr.stage-selector_is-selected_2x2r_ .stage-selector_header_2GVr1 {\\n    background-color: hsla(215, 100%, 65%, 1);\\n}\\n\\n.stage-selector_stage-selector_3oWOr.stage-selector_is-selected_2x2r_ .stage-selector_header-title_33xCt {\\n    color: hsla(0, 100%, 100%, 1);\\n}\\n\\n.stage-selector_count_2QK7D {\\n    padding: 0.3rem 0.75rem;\\n    font-size: 0.850rem;\\n    color: hsla(225, 15%, 40%, 1);\\n    -webkit-user-select: none;\\n       -moz-user-select: none;\\n        -ms-user-select: none;\\n            user-select: none;\\n}\\n\\n.stage-selector_label_1MCfr {\\n    margin: 0.75rem 0 0.25rem;\\n    font-size: 0.850rem;\\n    color: hsla(225, 15%, 40%, 1);\\n    -webkit-user-select: none;\\n       -moz-user-select: none;\\n        -ms-user-select: none;\\n            user-select: none;\\n    text-align: center;\\n}\\n\\n.stage-selector_costume-canvas_2L_6h {\\n    display: block;\\n    margin-top: .25rem;\\n    width: 100%;\\n    -webkit-user-select: none;\\n       -moz-user-select: none;\\n        -ms-user-select: none;\\n            user-select: none;\\n    border: 1px solid hsla(0, 0%, 0%, 0.15);\\n    border-radius: .25rem;\\n    -webkit-box-shadow: inset 0 0 4px hsla(0, 0%, 0%, 0.15);\\n            box-shadow: inset 0 0 4px hsla(0, 0%, 0%, 0.15);\\n    max-width: 64px;\\n    max-height: 48px;\\n}\\n\\n.stage-selector_add-button_1sKuU {\\n    position: absolute;\\n    bottom: 0.75rem;\\n}\\n\\n.stage-selector_raised_9i1gL, .stage-selector_raised_9i1gL .stage-selector_header_2GVr1 {\\n    background-color: hsla(215, 100%, 77%, 1);\\n    -webkit-transition: all 0.25s ease;\\n    -o-transition: all 0.25s ease;\\n    transition: all 0.25s ease;\\n}\\n\\n.stage-selector_raised_9i1gL:hover {\\n    -webkit-transform: scale(1.05);\\n        -ms-transform: scale(1.05);\\n            transform: scale(1.05);\\n}\\n\\n.stage-selector_receivedBlocks_2zr7v {\\n    -webkit-animation: stage-selector_glowing_2YPqi 250ms;\\n            animation: stage-selector_glowing_2YPqi 250ms;\\n}\\n\\n@-webkit-keyframes stage-selector_glowing_2YPqi {\\n    10% { -webkit-box-shadow: 0 0 10px #7fff1e; box-shadow: 0 0 10px #7fff1e; }\\n    90% { -webkit-box-shadow: 0 0 10px #7fff1e; box-shadow: 0 0 10px #7fff1e; }\\n    100% { -webkit-box-shadow: none; box-shadow: none; }\\n}\\n\\n@keyframes stage-selector_glowing_2YPqi {\\n    10% { -webkit-box-shadow: 0 0 10px #7fff1e; box-shadow: 0 0 10px #7fff1e; }\\n    90% { -webkit-box-shadow: 0 0 10px #7fff1e; box-shadow: 0 0 10px #7fff1e; }\\n    100% { -webkit-box-shadow: none; box-shadow: none; }\\n}\\n\", \"\"]);\n// exports\nexports.locals = {\n\t\"stage-selector\": \"stage-selector_stage-selector_3oWOr\",\n\t\"stageSelector\": \"stage-selector_stage-selector_3oWOr\",\n\t\"is-selected\": \"stage-selector_is-selected_2x2r_\",\n\t\"isSelected\": \"stage-selector_is-selected_2x2r_\",\n\t\"header\": \"stage-selector_header_2GVr1\",\n\t\"header-title\": \"stage-selector_header-title_33xCt\",\n\t\"headerTitle\": \"stage-selector_header-title_33xCt\",\n\t\"count\": \"stage-selector_count_2QK7D\",\n\t\"label\": \"stage-selector_label_1MCfr\",\n\t\"costume-canvas\": \"stage-selector_costume-canvas_2L_6h\",\n\t\"costumeCanvas\": \"stage-selector_costume-canvas_2L_6h\",\n\t\"add-button\": \"stage-selector_add-button_1sKuU\",\n\t\"addButton\": \"stage-selector_add-button_1sKuU\",\n\t\"raised\": \"stage-selector_raised_9i1gL\",\n\t\"receivedBlocks\": \"stage-selector_receivedBlocks_2zr7v\",\n\t\"glowing\": \"stage-selector_glowing_2YPqi\"\n};\n })