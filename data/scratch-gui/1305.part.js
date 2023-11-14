/* 1305 */\n (function(module, exports, __webpack_require__) {\nexports = module.exports = __webpack_require__(9)(false);\n// module\nexports.push([module.i, \"/* make sure to keep these in sync with other constants,\\ne.g. STAGE_DIMENSION_DEFAULTS in lib/screen-utils.js */\\n\\n/* layout contants from `layout-constants.js` */\\n\\n/* #E5F0FF */\\n\\n/* #E9F1FC */\\n\\n/* #D9E3F2 */\\n\\n/* 90% transparent version of motion-primary */\\n\\n/* #FFFFFF */\\n\\n/* 25% transparent version of ui-white */\\n\\n/* 25% transparent version of ui-white */\\n\\n/* 25% transparent version of ui-white */\\n\\n/* 15% transparent version of black */\\n\\n/* #575E75 */\\n\\n/* #4C97FF */\\n\\n/* #3373CC */\\n\\n/* 35% transparent version of motion-primary */\\n\\n/* 15% transparent version of motion-primary */\\n\\n/* #FF661A */\\n\\n/* #E64D00 */\\n\\n/* #CF63CF */\\n\\n/* #BD42BD */\\n\\n/* #FFAB19 */\\n\\n/* #FF8C1A */\\n\\n/* #0FBD8C */\\n\\n/* #0FBD8C */\\n\\n/* #FF8C1A */\\n\\n/* #FFB366 */\\n\\n/* #FF8C1A */\\n\\n/* #0FBD8C */\\n\\n/* #0B8E69 */\\n\\n/* 35% transparent version of extensions-primary */\\n\\n/* opaque version of extensions-transparent, on white bg */\\n\\n/* lighter than motion-primary */\\n\\n/* @todo: refactor this class name, and component: `sprite-selector` to `sprite` */\\n\\n.sprite-selector-item_sprite-selector-item_kQm-i {\\n    display: -webkit-box;\\n    display: -webkit-flex;\\n    display: -ms-flexbox;\\n    display: flex;\\n    -webkit-box-orient: vertical;\\n    -webkit-box-direction: normal;\\n    -webkit-flex-direction: column;\\n        -ms-flex-direction: column;\\n            flex-direction: column;\\n    -webkit-box-pack: start;\\n    -webkit-justify-content: flex-start;\\n        -ms-flex-pack: start;\\n            justify-content: flex-start;\\n    position: relative;\\n\\n    font-family: \\\"Helvetica Neue\\\", Helvetica, Arial, sans-serif;\\n    font-size: 0.8rem;\\n    color: hsla(225, 15%, 40%, 1);\\n    border-width: 2px;\\n    border-style: solid;\\n    border-color: hsla(0, 0%, 0%, 0.15);\\n    border-radius: 0.5rem;\\n\\n    text-align: center;\\n    cursor: pointer;\\n\\n    -webkit-user-select: none;\\n\\n       -moz-user-select: none;\\n\\n        -ms-user-select: none;\\n\\n            user-select: none;\\n}\\n\\n.sprite-selector-item_sprite-selector-item_kQm-i.sprite-selector-item_is-selected_24tQj {\\n    -webkit-box-shadow: 0px 0px 0px 4px hsla(215, 100%, 65%, 0.35);\\n            box-shadow: 0px 0px 0px 4px hsla(215, 100%, 65%, 0.35);\\n    border: 2px solid hsla(215, 100%, 65%, 1);\\n    background: hsla(0, 100%, 100%, 1);\\n}\\n\\n.sprite-selector-item_sprite-selector-item_kQm-i:hover {\\n    border: 2px solid hsla(215, 100%, 65%, 1);\\n    background: hsla(0, 100%, 100%, 1);\\n}\\n\\n.sprite-selector-item_sprite-selector-item_kQm-i:hover .sprite-selector-item_sprite-image_2QWuK, .sprite-selector-item_is-selected_24tQj .sprite-selector-item_sprite-image_2QWuK {\\n    -webkit-filter: drop-shadow(0px 0px 2px  hsla(0, 0%, 0%, 0.15));\\n            filter: drop-shadow(0px 0px 2px  hsla(0, 0%, 0%, 0.15));\\n}\\n\\n/* Outer/Inner chicanery is to prevent layouts when sprite image changes */\\n\\n.sprite-selector-item_sprite-image-outer_Xs0wN {\\n    position: relative;\\n    width: 100%;\\n    height: 100%;\\n    -webkit-transform: translateZ(0);\\n            transform: translateZ(0);\\n}\\n\\n.sprite-selector-item_sprite-image-inner_3oSwi {\\n    position: absolute;\\n    width: 100%;\\n    height: 100%;\\n    display: -webkit-box;\\n    display: -webkit-flex;\\n    display: -ms-flexbox;\\n    display: flex;\\n    -webkit-box-pack: center;\\n    -webkit-justify-content: center;\\n        -ms-flex-pack: center;\\n            justify-content: center;\\n    -webkit-box-align: center;\\n    -webkit-align-items: center;\\n        -ms-flex-align: center;\\n            align-items: center;\\n}\\n\\n.sprite-selector-item_sprite-image_2QWuK {\\n    -webkit-user-select: none;\\n       -moz-user-select: none;\\n        -ms-user-select: none;\\n            user-select: none;\\n    pointer-events: none;\\n    max-width: 32px;\\n    max-height: 32px;\\n}\\n\\n.sprite-selector-item_sprite-info_-I0i_ {\\n    padding: 0.25rem;\\n    border-bottom-left-radius: 0.25rem;\\n    border-bottom-right-radius: 0.25rem;\\n\\n    font-size: 0.850rem;\\n    color: hsla(225, 15%, 40%, 1);\\n    -webkit-user-select: none;\\n       -moz-user-select: none;\\n        -ms-user-select: none;\\n            user-select: none;\\n}\\n\\n.sprite-selector-item_sprite-name_1PXjh, .sprite-selector-item_sprite-details_2UVpA {\\n    /*\\n        For truncating overflowing text gracefully\\n        Min-width is for a bug: https://css-tricks.com/flexbox-truncated-text\\n    */\\n    overflow: hidden;\\n    -o-text-overflow: ellipsis;\\n       text-overflow: ellipsis;\\n    white-space: nowrap;\\n    min-width: 0;\\n}\\n\\n.sprite-selector-item_sprite-details_2UVpA {\\n    margin-top: 0.125rem;\\n    font-size: 0.5rem;\\n}\\n\\n.sprite-selector-item_is-selected_24tQj .sprite-selector-item_sprite-info_-I0i_ {\\n    background: hsla(215, 100%, 65%, 1);\\n    color: hsla(0, 100%, 100%, 1);\\n}\\n\\n.sprite-selector-item_delete-button_1rkFW {\\n    position: absolute;\\n    top: -.625rem;\\n    z-index: auto;\\n}\\n\\n[dir=\\\"ltr\\\"] .sprite-selector-item_delete-button_1rkFW {\\n    right: -.625rem;\\n}\\n\\n[dir=\\\"rtl\\\"] .sprite-selector-item_delete-button_1rkFW {\\n    left: -.625rem;\\n}\\n\\n.sprite-selector-item_number_AnXUk {\\n    position: absolute;\\n    top: 0.15rem;\\n    font-size: 0.625rem;\\n    font-weight: bold;\\n    z-index: 2;\\n}\\n\\n[dir=\\\"ltr\\\"] .sprite-selector-item_number_AnXUk {\\n    left: 0.15rem;\\n}\\n\\n[dir=\\\"rtl\\\"] .sprite-selector-item_number_AnXUk {\\n    right: 0.15rem;\\n}\\n\", \"\"]);\n// exports\nexports.locals = {\n\t\"sprite-selector-item\": \"sprite-selector-item_sprite-selector-item_kQm-i\",\n\t\"spriteSelectorItem\": \"sprite-selector-item_sprite-selector-item_kQm-i\",\n\t\"is-selected\": \"sprite-selector-item_is-selected_24tQj\",\n\t\"isSelected\": \"sprite-selector-item_is-selected_24tQj\",\n\t\"sprite-image\": \"sprite-selector-item_sprite-image_2QWuK\",\n\t\"spriteImage\": \"sprite-selector-item_sprite-image_2QWuK\",\n\t\"sprite-image-outer\": \"sprite-selector-item_sprite-image-outer_Xs0wN\",\n\t\"spriteImageOuter\": \"sprite-selector-item_sprite-image-outer_Xs0wN\",\n\t\"sprite-image-inner\": \"sprite-selector-item_sprite-image-inner_3oSwi\",\n\t\"spriteImageInner\": \"sprite-selector-item_sprite-image-inner_3oSwi\",\n\t\"sprite-info\": \"sprite-selector-item_sprite-info_-I0i_\",\n\t\"spriteInfo\": \"sprite-selector-item_sprite-info_-I0i_\",\n\t\"sprite-name\": \"sprite-selector-item_sprite-name_1PXjh\",\n\t\"spriteName\": \"sprite-selector-item_sprite-name_1PXjh\",\n\t\"sprite-details\": \"sprite-selector-item_sprite-details_2UVpA\",\n\t\"spriteDetails\": \"sprite-selector-item_sprite-details_2UVpA\",\n\t\"delete-button\": \"sprite-selector-item_delete-button_1rkFW\",\n\t\"deleteButton\": \"sprite-selector-item_delete-button_1rkFW\",\n\t\"number\": \"sprite-selector-item_number_AnXUk\"\n};\n })