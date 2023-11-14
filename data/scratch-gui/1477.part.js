/* 1477 */\n (function(module, exports, __webpack_require__) {\nvar escape = __webpack_require__(524);\nexports = module.exports = __webpack_require__(9)(false);\n// module\nexports.push([module.i, \"/* #E5F0FF */ /* #E9F1FC */ /* #D9E3F2 */ /* 90% transparent version of motion-primary */ /* #FFFFFF */ /* 25% transparent version of ui-white */ /* 25% transparent version of ui-white */ /* 25% transparent version of ui-white */ /* 15% transparent version of black */ /* #575E75 */ /* #4C97FF */ /* #3373CC */ /* 35% transparent version of motion-primary */ /* 15% transparent version of motion-primary */ /* #FF661A */ /* #E64D00 */ /* #CF63CF */ /* #BD42BD */ /* #FFAB19 */ /* #FF8C1A */ /* #0FBD8C */ /* #0FBD8C */ /* #FF8C1A */ /* #FFB366 */ /* #FF8C1A */ /* #0FBD8C */ /* #0B8E69 */ /* 35% transparent version of extensions-primary */ /* opaque version of extensions-transparent, on white bg */ /* lighter than motion-primary */ /* make sure to keep these in sync with other constants,\\ne.g. STAGE_DIMENSION_DEFAULTS in lib/screen-utils.js */ /* layout contants from `layout-constants.js` */ body {\\n    font-family: \\\"Helvetica Neue\\\", Helvetica, Arial, sans-serif;\\n} h2 {\\n    font-size: 1.5rem;\\n    font-weight: bold;\\n} p {\\n    font-size: 1rem;\\n    line-height: 1.5em;\\n} /*\\n    Contains constants for the z-index values of elements that are part of the global stack context.\\n    In other words, z-index values that are \\\"inside\\\" a component are not added here.\\n    This prevents conflicts between identical z-index values in different components.\\n*/ /* Toolbox z-index: 40; set in scratch-blocks */ /* tooltips should go over add buttons if they overlap */ /* monitors go over add buttons */ /* \\\"ask\\\" block text input goes above monitors */ /* menu-bar should go over monitors, alerts and tutorials */ /* Block drag z-index: 1000; default 50 is overriden in blocks.css */ /* so it is draggable into other panes */ /* in most interfaces, the context menu is always on top */ .telemetry-modal_modal-overlay_3R9Qg {\\n    position: fixed;\\n    top: 0;\\n    left: 0;\\n    right: 0;\\n    bottom: 0;\\n    z-index: 510;\\n    background-color: hsla(215, 100%, 65%, 0.9);\\n} .telemetry-modal_modal-content_nALrs {\\n    margin: 100px auto;\\n    outline: none;\\n    border: .25rem solid hsla(0, 100%, 100%, 0.25);\\n    padding: 0;\\n    border-radius: 0.5rem;\\n    -webkit-user-select: none;\\n       -moz-user-select: none;\\n        -ms-user-select: none;\\n            user-select: none;\\n    width: 640px;\\n\\n    color: hsla(225, 15%, 40%, 1);\\n    overflow: hidden;\\n} .telemetry-modal_illustration_2xM6I {\\n    width: 100%;\\n    height: 123px;\\n    background-color: hsla(215, 100%, 65%, 1);\\n    background-image: url(\" + escape(__webpack_require__(1478)) + \");\\n    background-size: cover;\\n} .telemetry-modal_body_1ZKWV {\\n    background: hsla(0, 100%, 100%, 1);\\n    padding: 1.5rem 2.25rem;\\n    text-align: left;\\n} .telemetry-modal_privacy-policy-link_3wFww {\\n    color: hsla(215, 100%, 65%, 1);\\n    text-decoration: none;\\n} /* Confirmation buttons at the bottom of the modal */ .telemetry-modal_button-row_2rE_o {\\n    margin: 1.5rem 0;\\n    font-weight: bolder;\\n    text-align: right;\\n    display: -webkit-box;\\n    display: -webkit-flex;\\n    display: -ms-flexbox;\\n    display: flex;\\n    -webkit-box-pack: center;\\n    -webkit-justify-content: center;\\n        -ms-flex-pack: center;\\n            justify-content: center;\\n} .telemetry-modal_button-row_2rE_o button {\\n    border: 1px solid hsla(215, 100%, 65%, 1);\\n    border-radius: 0.25rem;\\n    padding: 0.5rem 1.5rem;\\n    background: white;\\n    font-weight: bold;\\n    font-size: .875rem;\\n    cursor: pointer;\\n} .telemetry-modal_button-row_2rE_o button.telemetry-modal_opt-in_CBWBt {\\n    background: hsla(215, 100%, 65%, 1);\\n    color: white;\\n} .telemetry-modal_button-row_2rE_o button.telemetry-modal_opt-out_3ibJx {\\n    color: hsla(215, 100%, 65%, 1);\\n} [dir=\\\"ltr\\\"] .telemetry-modal_button-row_2rE_o button + button {\\n    margin-left: 0.5rem;\\n} [dir=\\\"rtl\\\"] .telemetry-modal_button-row_2rE_o button + button {\\n    margin-right: 0.5rem;\\n}\\n\", \"\"]);\n// exports\nexports.locals = {\n\t\"modal-overlay\": \"telemetry-modal_modal-overlay_3R9Qg\",\n\t\"modalOverlay\": \"telemetry-modal_modal-overlay_3R9Qg\",\n\t\"modal-content\": \"telemetry-modal_modal-content_nALrs\",\n\t\"modalContent\": \"telemetry-modal_modal-content_nALrs\",\n\t\"illustration\": \"telemetry-modal_illustration_2xM6I\",\n\t\"body\": \"telemetry-modal_body_1ZKWV\",\n\t\"privacy-policy-link\": \"telemetry-modal_privacy-policy-link_3wFww\",\n\t\"privacyPolicyLink\": \"telemetry-modal_privacy-policy-link_3wFww\",\n\t\"button-row\": \"telemetry-modal_button-row_2rE_o\",\n\t\"buttonRow\": \"telemetry-modal_button-row_2rE_o\",\n\t\"opt-in\": \"telemetry-modal_opt-in_CBWBt\",\n\t\"optIn\": \"telemetry-modal_opt-in_CBWBt\",\n\t\"opt-out\": \"telemetry-modal_opt-out_3ibJx\",\n\t\"optOut\": \"telemetry-modal_opt-out_3ibJx\"\n};\n })