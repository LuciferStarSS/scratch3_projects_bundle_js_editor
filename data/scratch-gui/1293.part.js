/* 1293 */\n (function(module, exports, __webpack_require__) {\nexports = module.exports = __webpack_require__(9)(false);\n// module\nexports.push([module.i, \"/* make sure to keep these in sync with other constants,\\ne.g. STAGE_DIMENSION_DEFAULTS in lib/screen-utils.js */\\n\\n/* layout contants from `layout-constants.js` */\\n\\n/* #E5F0FF */\\n\\n/* #E9F1FC */\\n\\n/* #D9E3F2 */\\n\\n/* 90% transparent version of motion-primary */\\n\\n/* #FFFFFF */\\n\\n/* 25% transparent version of ui-white */\\n\\n/* 25% transparent version of ui-white */\\n\\n/* 25% transparent version of ui-white */\\n\\n/* 15% transparent version of black */\\n\\n/* #575E75 */\\n\\n/* #4C97FF */\\n\\n/* #3373CC */\\n\\n/* 35% transparent version of motion-primary */\\n\\n/* 15% transparent version of motion-primary */\\n\\n/* #FF661A */\\n\\n/* #E64D00 */\\n\\n/* #CF63CF */\\n\\n/* #BD42BD */\\n\\n/* #FFAB19 */\\n\\n/* #FF8C1A */\\n\\n/* #0FBD8C */\\n\\n/* #0FBD8C */\\n\\n/* #FF8C1A */\\n\\n/* #FFB366 */\\n\\n/* #FF8C1A */\\n\\n/* #0FBD8C */\\n\\n/* #0B8E69 */\\n\\n/* 35% transparent version of extensions-primary */\\n\\n/* opaque version of extensions-transparent, on white bg */\\n\\n/* lighter than motion-primary */\\n\\n.filter_filter_1JFal {\\n    display: -webkit-box;\\n    display: -webkit-flex;\\n    display: -ms-flexbox;\\n    display: flex;\\n    -webkit-box-orient: horizontal;\\n    -webkit-box-direction: normal;\\n    -webkit-flex-direction: row;\\n        -ms-flex-direction: row;\\n            flex-direction: row;\\n    -webkit-box-align: center;\\n    -webkit-align-items: center;\\n        -ms-flex-align: center;\\n            align-items: center;\\n    -webkit-box-flex: 1;\\n    -webkit-flex-grow: 1;\\n        -ms-flex-positive: 1;\\n            flex-grow: 1;\\n\\n    background: hsla(0, 100%, 100%, 1);\\n    border-radius: 10rem;\\n    -webkit-user-select: none;\\n       -moz-user-select: none;\\n        -ms-user-select: none;\\n            user-select: none;\\n    height: 2.5rem;\\n\\n    position: relative;\\n}\\n\\n.filter_filter-icon_3Pfaw {\\n    position: absolute;\\n    top: 0;\\n\\n    height: 1rem;\\n    width: 1rem;\\n}\\n\\n[dir=\\\"ltr\\\"] .filter_filter-icon_3Pfaw {\\n    left: 0;\\n    margin: 0.75rem 0.75rem 0.75rem 1rem;\\n}\\n\\n[dir=\\\"rtl\\\"] .filter_filter-icon_3Pfaw {\\n    right: 0;\\n    margin: 0.75rem 1rem 0.75rem 0.75rem;\\n    -webkit-transform: scaleX(-1);\\n        -ms-transform: scaleX(-1);\\n            transform: scaleX(-1);\\n}\\n\\n.filter_filter_1JFal:focus-within {\\n    -webkit-box-shadow: 0 0 0 .25rem hsla(215, 100%, 65%, 0.35);\\n            box-shadow: 0 0 0 .25rem hsla(215, 100%, 65%, 0.35);\\n}\\n\\n/*\\n    Hidden state\\n*/\\n\\n.filter_x-icon-wrapper_1rP2w {\\n    opacity: 0;\\n    position: absolute;\\n    top: 0;\\n\\n    display: -webkit-box;\\n\\n    display: -webkit-flex;\\n\\n    display: -ms-flexbox;\\n\\n    display: flex;\\n    -webkit-box-pack: center;\\n    -webkit-justify-content: center;\\n        -ms-flex-pack: center;\\n            justify-content: center;\\n    -webkit-box-align: center;\\n    -webkit-align-items: center;\\n        -ms-flex-align: center;\\n            align-items: center;\\n\\n    overflow: hidden;  /* Mask the icon animation */\\n    height: 1.25rem;\\n    width: 1.25rem;\\n    margin: 0.625rem;\\n\\n    border-radius: 50%;\\n    pointer-events: none;\\n    cursor: default;\\n    -webkit-transition: opacity 0.05s linear;\\n    -o-transition: opacity 0.05s linear;\\n    transition: opacity 0.05s linear;\\n}\\n\\n[dir=\\\"ltr\\\"] .filter_x-icon-wrapper_1rP2w {\\n    right: 0;\\n}\\n\\n[dir=\\\"rtl\\\"] .filter_x-icon-wrapper_1rP2w {\\n    left: 0;\\n}\\n\\n/*\\n    Shown state\\n*/\\n\\n.filter_filter_1JFal.filter_is-active_3PvfA .filter_x-icon-wrapper_1rP2w {\\n    pointer-events: auto;\\n    cursor: pointer;\\n    opacity: 1;\\n    -webkit-transition: opacity 0.05s linear;\\n    -o-transition: opacity 0.05s linear;\\n    transition: opacity 0.05s linear;\\n}\\n\\n.filter_filter_1JFal.filter_is-active_3PvfA .filter_x-icon-wrapper_1rP2w:hover {\\n    -webkit-transform: scale(1.2, 1.2);\\n        -ms-transform: scale(1.2, 1.2);\\n            transform: scale(1.2, 1.2);\\n}\\n\\n/*\\n    Hidden state\\n*/\\n\\n.filter_x-icon_zjpOg {\\n    position: relative;\\n    margin: 0.25rem;\\n    -webkit-user-select: none;\\n       -moz-user-select: none;\\n        -ms-user-select: none;\\n            user-select: none;\\n    -webkit-transform: translateX(0.5rem);\\n        -ms-transform: translateX(0.5rem);\\n            transform: translateX(0.5rem);\\n    -webkit-transition: -webkit-transform 0.085s cubic-bezier(0.78, 1, 1, 1);\\n    transition: -webkit-transform 0.085s cubic-bezier(0.78, 1, 1, 1);\\n    -o-transition: transform 0.085s cubic-bezier(0.78, 1, 1, 1);\\n    transition: transform 0.085s cubic-bezier(0.78, 1, 1, 1);\\n    transition: transform 0.085s cubic-bezier(0.78, 1, 1, 1), -webkit-transform 0.085s cubic-bezier(0.78, 1, 1, 1);\\n}\\n\\n/*\\n    Shown state\\n*/\\n\\n.filter_filter_1JFal.filter_is-active_3PvfA .filter_x-icon-wrapper_1rP2w .filter_x-icon_zjpOg {\\n    -webkit-transform: translateX(0);\\n        -ms-transform: translateX(0);\\n            transform: translateX(0);\\n}\\n\\n.filter_filter-input_1iiEt {\\n    -webkit-box-flex: 1;\\n    -webkit-flex-grow: 1;\\n        -ms-flex-positive: 1;\\n            flex-grow: 1;\\n    height: 2.5rem;\\n    background-color: transparent;\\n    -webkit-appearance: none;\\n    outline: none;\\n    border: 0;\\n    color: hsla(225, 15%, 40%, 1);\\n    font-size: 0.75rem;\\n    letter-spacing: 0.15px;\\n    cursor: text;\\n}\\n\\n[dir=\\\"ltr\\\"] .filter_filter-input_1iiEt {\\n    padding: .625rem 2rem .625rem 3rem;\\n}\\n\\n[dir=\\\"rtl\\\"] .filter_filter-input_1iiEt {\\n    padding: .625rem 3rem .625rem 2rem;\\n}\\n\\n.filter_filter-input_1iiEt::-webkit-input-placeholder {\\n    opacity: .5;\\n    color: hsla(225, 15%, 40%, 1);\\n    font-size: 0.875rem;\\n    letter-spacing: 0.15px;\\n}\\n\\n.filter_filter-input_1iiEt::-moz-placeholder {\\n    opacity: .5;\\n    color: hsla(225, 15%, 40%, 1);\\n    font-size: 0.875rem;\\n    letter-spacing: 0.15px;\\n}\\n\\n.filter_filter-input_1iiEt:-ms-input-placeholder {\\n    opacity: .5;\\n    color: hsla(225, 15%, 40%, 1);\\n    font-size: 0.875rem;\\n    letter-spacing: 0.15px;\\n}\\n\\n.filter_filter-input_1iiEt::-ms-input-placeholder {\\n    opacity: .5;\\n    color: hsla(225, 15%, 40%, 1);\\n    font-size: 0.875rem;\\n    letter-spacing: 0.15px;\\n}\\n\\n.filter_filter-input_1iiEt::placeholder {\\n    opacity: .5;\\n    color: hsla(225, 15%, 40%, 1);\\n    font-size: 0.875rem;\\n    letter-spacing: 0.15px;\\n}\\n\\n[dir=\\\"ltr\\\"] .filter_filter-input_1iiEt::-webkit-input-placeholder {\\n    padding: 0 0 0 0.25rem;\\n}\\n\\n[dir=\\\"ltr\\\"] .filter_filter-input_1iiEt::-moz-placeholder {\\n    padding: 0 0 0 0.25rem;\\n}\\n\\n[dir=\\\"ltr\\\"] .filter_filter-input_1iiEt:-ms-input-placeholder {\\n    padding: 0 0 0 0.25rem;\\n}\\n\\n[dir=\\\"ltr\\\"] .filter_filter-input_1iiEt::-ms-input-placeholder {\\n    padding: 0 0 0 0.25rem;\\n}\\n\\n[dir=\\\"ltr\\\"] .filter_filter-input_1iiEt::placeholder {\\n    padding: 0 0 0 0.25rem;\\n}\\n\\n[dir=\\\"rtl\\\"] .filter_filter-input_1iiEt::-webkit-input-placeholder {\\n    padding: 0 0.25rem 0 0;\\n}\\n\\n[dir=\\\"rtl\\\"] .filter_filter-input_1iiEt::-moz-placeholder {\\n    padding: 0 0.25rem 0 0;\\n}\\n\\n[dir=\\\"rtl\\\"] .filter_filter-input_1iiEt:-ms-input-placeholder {\\n    padding: 0 0.25rem 0 0;\\n}\\n\\n[dir=\\\"rtl\\\"] .filter_filter-input_1iiEt::-ms-input-placeholder {\\n    padding: 0 0.25rem 0 0;\\n}\\n\\n[dir=\\\"rtl\\\"] .filter_filter-input_1iiEt::placeholder {\\n    padding: 0 0.25rem 0 0;\\n}\\n\", \"\"]);\n// exports\nexports.locals = {\n\t\"filter\": \"filter_filter_1JFal\",\n\t\"filter-icon\": \"filter_filter-icon_3Pfaw\",\n\t\"filterIcon\": \"filter_filter-icon_3Pfaw\",\n\t\"x-icon-wrapper\": \"filter_x-icon-wrapper_1rP2w\",\n\t\"xIconWrapper\": \"filter_x-icon-wrapper_1rP2w\",\n\t\"is-active\": \"filter_is-active_3PvfA\",\n\t\"isActive\": \"filter_is-active_3PvfA\",\n\t\"x-icon\": \"filter_x-icon_zjpOg\",\n\t\"xIcon\": \"filter_x-icon_zjpOg\",\n\t\"filter-input\": \"filter_filter-input_1iiEt\",\n\t\"filterInput\": \"filter_filter-input_1iiEt\"\n};\n })