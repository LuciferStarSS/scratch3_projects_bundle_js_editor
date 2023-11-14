/* 1457 */\n (function(module, exports, __webpack_require__) {\nexports = module.exports = __webpack_require__(9)(false);\n// module\nexports.push([module.i, \"/*\\n * NOTE: the copious use of `important` is needed to overwrite\\n * the default tooltip styling, and is required by the 3rd party\\n * library being used, `react-tooltip`\\n */\\n\\n/* #E5F0FF */\\n\\n/* #E9F1FC */\\n\\n/* #D9E3F2 */\\n\\n/* 90% transparent version of motion-primary */\\n\\n/* #FFFFFF */\\n\\n/* 25% transparent version of ui-white */\\n\\n/* 25% transparent version of ui-white */\\n\\n/* 25% transparent version of ui-white */\\n\\n/* 15% transparent version of black */\\n\\n/* #575E75 */\\n\\n/* #4C97FF */\\n\\n/* #3373CC */\\n\\n/* 35% transparent version of motion-primary */\\n\\n/* 15% transparent version of motion-primary */\\n\\n/* #FF661A */\\n\\n/* #E64D00 */\\n\\n/* #CF63CF */\\n\\n/* #BD42BD */\\n\\n/* #FFAB19 */\\n\\n/* #FF8C1A */\\n\\n/* #0FBD8C */\\n\\n/* #0FBD8C */\\n\\n/* #FF8C1A */\\n\\n/* #FFB366 */\\n\\n/* #FF8C1A */\\n\\n/* #0FBD8C */\\n\\n/* #0B8E69 */\\n\\n/* 35% transparent version of extensions-primary */\\n\\n/* opaque version of extensions-transparent, on white bg */\\n\\n/* lighter than motion-primary */\\n\\n/* make sure to keep these in sync with other constants,\\ne.g. STAGE_DIMENSION_DEFAULTS in lib/screen-utils.js */\\n\\n/* layout contants from `layout-constants.js` */\\n\\n/*\\n    Contains constants for the z-index values of elements that are part of the global stack context.\\n    In other words, z-index values that are \\\"inside\\\" a component are not added here.\\n    This prevents conflicts between identical z-index values in different components.\\n*/\\n\\n/* Toolbox z-index: 40; set in scratch-blocks */\\n\\n/* tooltips should go over add buttons if they overlap */\\n\\n/* monitors go over add buttons */\\n\\n/* \\\"ask\\\" block text input goes above monitors */\\n\\n/* menu-bar should go over monitors, alerts and tutorials */\\n\\n/* Block drag z-index: 1000; default 50 is overriden in blocks.css */\\n\\n/* so it is draggable into other panes */\\n\\n/* in most interfaces, the context menu is always on top */\\n\\n.coming-soon_coming-soon_3x7RD {\\n    background-color: hsla(30, 100%, 55%, 1) !important;\\n    border: 1px solid hsla(0, 0%, 0%, 0.15) !important;\\n    border-radius: calc(0.5rem / 2) !important;\\n    -webkit-box-shadow: 0 0 .5rem hsla(0, 0%, 0%, 0.15) !important;\\n            box-shadow: 0 0 .5rem hsla(0, 0%, 0%, 0.15) !important;\\n    padding: .75rem 1rem !important;\\n    font-family: \\\"Helvetica Neue\\\", Helvetica, Arial, sans-serif !important;\\n    font-size: 1rem !important;\\n    line-height: 1.25rem !important;\\n    z-index: 47 !important;\\n}\\n\\n.coming-soon_coming-soon_3x7RD:after {\\n    content: \\\"\\\";\\n    border-top: 1px solid hsla(0, 0%, 0%, 0.15) !important;\\n    border-left: 0 !important;\\n    border-bottom: 0 !important;\\n    border-right: 1px solid hsla(0, 0%, 0%, 0.15) !important;\\n    border-radius: calc(0.5rem / 2);\\n    background-color: hsla(30, 100%, 55%, 1) !important;\\n    height: 1rem !important;\\n    width: 1rem !important;\\n}\\n\\n.coming-soon_show_1Kszm,\\n.coming-soon_show_1Kszm:before,\\n.coming-soon_show_1Kszm:after {\\n    opacity: 1 !important;\\n}\\n\\n.coming-soon_left_O4X9A:after {\\n    margin-top: -.5rem !important;\\n    right: -.5rem !important;\\n    -webkit-transform: rotate(45deg) !important;\\n        -ms-transform: rotate(45deg) !important;\\n            transform: rotate(45deg) !important;\\n}\\n\\n.coming-soon_right_1PkI6:after {\\n    margin-top: -.5rem !important;\\n    left: -.5rem !important;\\n    -webkit-transform: rotate(-135deg) !important;\\n        -ms-transform: rotate(-135deg) !important;\\n            transform: rotate(-135deg) !important;\\n}\\n\\n.coming-soon_top_13j8p:after {\\n    margin-right: -.5rem !important;\\n    bottom: -.5rem !important;\\n    -webkit-transform: rotate(135deg) !important;\\n        -ms-transform: rotate(135deg) !important;\\n            transform: rotate(135deg) !important;\\n}\\n\\n.coming-soon_bottom_2raz4:after {\\n    margin-left: -.5rem !important;\\n    top: -.5rem !important;\\n    -webkit-transform: rotate(-45deg) !important;\\n        -ms-transform: rotate(-45deg) !important;\\n            transform: rotate(-45deg) !important;\\n}\\n\\n.coming-soon_coming-soon-image_255bz {\\n    width: 1.25rem;\\n    height: 1.25rem;\\n    vertical-align: middle;\\n}\\n\\n[dir=\\\"ltr\\\"] .coming-soon_coming-soon-image_255bz {\\n    margin-left: .125rem;\\n}\\n\\n[dir=\\\"rtl\\\"] .coming-soon_coming-soon-image_255bz {\\n    margin-right: .125rem;\\n}\\n\", \"\"]);\n// exports\nexports.locals = {\n\t\"coming-soon\": \"coming-soon_coming-soon_3x7RD\",\n\t\"comingSoon\": \"coming-soon_coming-soon_3x7RD\",\n\t\"show\": \"coming-soon_show_1Kszm\",\n\t\"left\": \"coming-soon_left_O4X9A\",\n\t\"right\": \"coming-soon_right_1PkI6\",\n\t\"top\": \"coming-soon_top_13j8p\",\n\t\"bottom\": \"coming-soon_bottom_2raz4\",\n\t\"coming-soon-image\": \"coming-soon_coming-soon-image_255bz\",\n\t\"comingSoonImage\": \"coming-soon_coming-soon-image_255bz\"\n};\n })