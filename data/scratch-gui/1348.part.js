/* 1348 */\n (function(module, exports, __webpack_require__) {\nexports = module.exports = __webpack_require__(9)(false);\n// module\nexports.push([module.i, \"/* DO NOT EDIT\\n@todo This file is copied from GUI and should be pulled out into a shared library.\\nSee https://github.com/LLK/scratch-paint/issues/13 */\\n\\n/* ACTUALLY, THIS IS EDITED ;)\\nTHIS WAS CHANGED ON 10/25/2017 BY @mewtaylor TO ADD A VARIABLE FOR THE SMALLEST\\nGRID UNITS.\\n\\nALSO EDITED ON 11/13/2017 TO ADD IN CONTANTS FOR LAYOUT FROM `layout-contents.js`*/\\n\\n/* layout contants from `layout-constants.js`, minus 1px */\\n\\n/* Popover styles */\\n\\n.Popover-body {\\n    background: white;\\n    border: 1px solid #ddd;\\n    padding: 4px;\\n    border-radius: 4px;\\n    padding: 4px;\\n    -webkit-box-shadow: 0px 0px 8px 1px rgba(0, 0, 0, .3);\\n            box-shadow: 0px 0px 8px 1px rgba(0, 0, 0, .3);\\n}\\n\\n.Popover-tipShape {\\n    fill: white;\\n    stroke: #ddd;\\n}\\n\\n.color-picker_clickable_29wR3 {\\n    cursor: pointer;\\n}\\n\\n.color-picker_swatch-row_1Q_s_ {\\n    display: -webkit-box;\\n    display: -webkit-flex;\\n    display: -ms-flexbox;\\n    display: flex;\\n    -webkit-box-orient: horizontal;\\n    -webkit-box-direction: normal;\\n    -webkit-flex-direction: row;\\n        -ms-flex-direction: row;\\n            flex-direction: row;\\n    -webkit-box-pack: justify;\\n    -webkit-justify-content: space-between;\\n        -ms-flex-pack: justify;\\n            justify-content: space-between;\\n}\\n\\n.color-picker_row-header_173LQ {\\n    font-family: \\\"Helvetica Neue\\\", Helvetica, sans-serif;\\n    font-size: 0.65rem;\\n    color: #575E75;\\n    margin: 8px;\\n}\\n\\n[dir=\\\"ltr\\\"] .color-picker_label-readout_9vjb2 {\\n    margin-left: 10px;\\n}\\n\\n[dir=\\\"rtl\\\"] .color-picker_label-readout_9vjb2 {\\n    margin-right: 10px;\\n}\\n\\n.color-picker_label-name_17igY {\\n    font-weight: bold;\\n}\\n\\n.color-picker_divider_3a3qR {\\n    border-top: 1px solid #ddd;\\n    margin: 8px;\\n}\\n\\n.color-picker_swap-button_FvctB {\\n    margin-left: 8px;\\n    margin-right: 8px;\\n}\\n\\n.color-picker_swatches_3mHi4 {\\n    margin: 8px;\\n}\\n\\n.color-picker_swatch_1IYWN {\\n    width: 1.5rem;\\n    height: 1.5rem;\\n    border: 1px solid #ddd;\\n    border-radius: 4px;\\n    -webkit-box-sizing: content-box;\\n            box-sizing: content-box;\\n    display: -webkit-box;\\n    display: -webkit-flex;\\n    display: -ms-flexbox;\\n    display: flex;\\n    -webkit-box-align: center;\\n    -webkit-align-items: center;\\n        -ms-flex-align: center;\\n            align-items: center;\\n}\\n\\n.color-picker_large-swatch-icon_E7mUt {\\n    width: 1.75rem;\\n    margin: auto;\\n}\\n\\n.color-picker_large-swatch_2mo4M {\\n    width: 2rem;\\n    height: 2rem;\\n}\\n\\n.color-picker_active-swatch_3Mv7i {\\n    border: 1px solid #4C97FF;\\n    -webkit-box-shadow: 0px 0px 0px 3px hsla(215, 100%, 65%, 0.2);\\n            box-shadow: 0px 0px 0px 3px hsla(215, 100%, 65%, 0.2);\\n}\\n\\n.color-picker_swatch-icon_Z7osI {\\n    width: 1.5rem;\\n    height: 1.5rem;\\n}\\n\\n.color-picker_inactive-gradient_3We_i {\\n    -webkit-filter: saturate(0%);\\n            filter: saturate(0%);\\n}\\n\\n.color-picker_gradient-picker-row_mnu4O {\\n    -webkit-box-align: center;\\n    -webkit-align-items: center;\\n        -ms-flex-align: center;\\n            align-items: center;\\n    display: -webkit-box;\\n    display: -webkit-flex;\\n    display: -ms-flexbox;\\n    display: flex;\\n    -webkit-box-orient: horizontal;\\n    -webkit-box-direction: normal;\\n    -webkit-flex-direction: row;\\n        -ms-flex-direction: row;\\n            flex-direction: row;\\n    -webkit-box-pack: center;\\n    -webkit-justify-content: center;\\n        -ms-flex-pack: center;\\n            justify-content: center;\\n    margin: 8px;\\n    -webkit-user-select: none;\\n       -moz-user-select: none;\\n        -ms-user-select: none;\\n            user-select: none;\\n}\\n\\n[dir=\\\"ltr\\\"] .color-picker_gradient-picker-row_mnu4O > img + img {\\n    margin-left: calc(2 * .25rem);\\n}\\n\\n[dir=\\\"rtl\\\"] .color-picker_gradient-picker-row_mnu4O > img + img {\\n    margin-right: calc(2 * .25rem);\\n}\\n\\n[dir=\\\"rtl\\\"] .color-picker_gradient-swatches-row_2vD4b {\\n    -webkit-box-orient: horizontal;\\n    -webkit-box-direction: reverse;\\n    -webkit-flex-direction: row-reverse;\\n        -ms-flex-direction: row-reverse;\\n            flex-direction: row-reverse;\\n}\\n\", \"\"]);\n// exports\nexports.locals = {\n\t\"clickable\": \"color-picker_clickable_29wR3\",\n\t\"swatch-row\": \"color-picker_swatch-row_1Q_s_\",\n\t\"swatchRow\": \"color-picker_swatch-row_1Q_s_\",\n\t\"row-header\": \"color-picker_row-header_173LQ\",\n\t\"rowHeader\": \"color-picker_row-header_173LQ\",\n\t\"label-readout\": \"color-picker_label-readout_9vjb2\",\n\t\"labelReadout\": \"color-picker_label-readout_9vjb2\",\n\t\"label-name\": \"color-picker_label-name_17igY\",\n\t\"labelName\": \"color-picker_label-name_17igY\",\n\t\"divider\": \"color-picker_divider_3a3qR\",\n\t\"swap-button\": \"color-picker_swap-button_FvctB\",\n\t\"swapButton\": \"color-picker_swap-button_FvctB\",\n\t\"swatches\": \"color-picker_swatches_3mHi4\",\n\t\"swatch\": \"color-picker_swatch_1IYWN\",\n\t\"large-swatch-icon\": \"color-picker_large-swatch-icon_E7mUt\",\n\t\"largeSwatchIcon\": \"color-picker_large-swatch-icon_E7mUt\",\n\t\"large-swatch\": \"color-picker_large-swatch_2mo4M\",\n\t\"largeSwatch\": \"color-picker_large-swatch_2mo4M\",\n\t\"active-swatch\": \"color-picker_active-swatch_3Mv7i\",\n\t\"activeSwatch\": \"color-picker_active-swatch_3Mv7i\",\n\t\"swatch-icon\": \"color-picker_swatch-icon_Z7osI\",\n\t\"swatchIcon\": \"color-picker_swatch-icon_Z7osI\",\n\t\"inactive-gradient\": \"color-picker_inactive-gradient_3We_i\",\n\t\"inactiveGradient\": \"color-picker_inactive-gradient_3We_i\",\n\t\"gradient-picker-row\": \"color-picker_gradient-picker-row_mnu4O\",\n\t\"gradientPickerRow\": \"color-picker_gradient-picker-row_mnu4O\",\n\t\"gradient-swatches-row\": \"color-picker_gradient-swatches-row_2vD4b\",\n\t\"gradientSwatchesRow\": \"color-picker_gradient-swatches-row_2vD4b\"\n};\n })