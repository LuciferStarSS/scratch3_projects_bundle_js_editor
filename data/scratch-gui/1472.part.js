/* 1472 */\n (function(module, exports, __webpack_require__) {\nexports = module.exports = __webpack_require__(9)(false);\n// module\nexports.push([module.i, \"/* make sure to keep these in sync with other constants,\\ne.g. STAGE_DIMENSION_DEFAULTS in lib/screen-utils.js */\\n\\n/* layout contants from `layout-constants.js` */\\n\\n/* #E5F0FF */\\n\\n/* #E9F1FC */\\n\\n/* #D9E3F2 */\\n\\n/* 90% transparent version of motion-primary */\\n\\n/* #FFFFFF */\\n\\n/* 25% transparent version of ui-white */\\n\\n/* 25% transparent version of ui-white */\\n\\n/* 25% transparent version of ui-white */\\n\\n/* 15% transparent version of black */\\n\\n/* #575E75 */\\n\\n/* #4C97FF */\\n\\n/* #3373CC */\\n\\n/* 35% transparent version of motion-primary */\\n\\n/* 15% transparent version of motion-primary */\\n\\n/* #FF661A */\\n\\n/* #E64D00 */\\n\\n/* #CF63CF */\\n\\n/* #BD42BD */\\n\\n/* #FFAB19 */\\n\\n/* #FF8C1A */\\n\\n/* #0FBD8C */\\n\\n/* #0FBD8C */\\n\\n/* #FF8C1A */\\n\\n/* #FFB366 */\\n\\n/* #FF8C1A */\\n\\n/* #0FBD8C */\\n\\n/* #0B8E69 */\\n\\n/* 35% transparent version of extensions-primary */\\n\\n/* opaque version of extensions-transparent, on white bg */\\n\\n/* lighter than motion-primary */\\n\\n/*\\n    Contains constants for the z-index values of elements that are part of the global stack context.\\n    In other words, z-index values that are \\\"inside\\\" a component are not added here.\\n    This prevents conflicts between identical z-index values in different components.\\n*/\\n\\n/* Toolbox z-index: 40; set in scratch-blocks */\\n\\n/* tooltips should go over add buttons if they overlap */\\n\\n/* monitors go over add buttons */\\n\\n/* \\\"ask\\\" block text input goes above monitors */\\n\\n/* menu-bar should go over monitors, alerts and tutorials */\\n\\n/* Block drag z-index: 1000; default 50 is overriden in blocks.css */\\n\\n/* so it is draggable into other panes */\\n\\n/* in most interfaces, the context menu is always on top */\\n\\n.card_card-container-overlay_gnjBL {\\n    position: fixed;\\n    pointer-events: none;\\n    z-index: 480;\\n}\\n\\n.card_card-container_3_Sbc {\\n    position:absolute;\\n    pointer-events: auto;\\n    z-index: 480;\\n    margin: 0.5rem 2rem;\\n    min-width: 468px;\\n}\\n\\n.card_left-card_1KpEh, .card_right-card_3IrbD {\\n    height: 90%;\\n    position: absolute;\\n    top: 5%;\\n    background: hsla(0, 100%, 100%, 1);\\n    border: 1px solid hsla(215, 50%, 90%, 1);\\n    width: .75rem;\\n    z-index: 10;\\n    opacity: 0.9;\\n    overflow: hidden;\\n}\\n\\n.card_left-card_1KpEh {\\n    left: -.75rem;\\n    border-right: 0;\\n    border-top-left-radius: 0.75rem;\\n    border-bottom-left-radius: 0.75rem;\\n}\\n\\n.card_right-card_3IrbD {\\n    right: -.75rem;\\n    border-left: 0;\\n    border-top-right-radius: 0.75rem;\\n    border-bottom-right-radius: 0.75rem;\\n}\\n\\n.card_left-card_1KpEh::after, .card_right-card_3IrbD::after {\\n    content: \\\"\\\";\\n    position: absolute;\\n    top: 0;\\n    left: 0;\\n    height: 2.5rem;\\n    width: 100%;\\n    background: hsla(163, 85%, 40%, 1);\\n}\\n\\n.card_left-button_2IXDY, .card_right-button_3Py4m {\\n    position: absolute;\\n    top: 50%;\\n    margin-top: -15px;\\n    z-index: 20;\\n    -webkit-user-select: none;\\n       -moz-user-select: none;\\n        -ms-user-select: none;\\n            user-select: none;\\n    cursor: pointer;\\n    background: hsla(163, 85%, 40%, 1);\\n    -webkit-box-shadow: 0 0 0 4px hsla(163, 85%, 40%, 0.35);\\n            box-shadow: 0 0 0 4px hsla(163, 85%, 40%, 0.35);\\n    height: 44px;\\n    width: 44px;\\n    border-radius: 100%;\\n    display: -webkit-box;\\n    display: -webkit-flex;\\n    display: -ms-flexbox;\\n    display: flex;\\n    -webkit-box-pack: center;\\n    -webkit-justify-content: center;\\n        -ms-flex-pack: center;\\n            justify-content: center;\\n    -webkit-box-align: center;\\n    -webkit-align-items: center;\\n        -ms-flex-align: center;\\n            align-items: center;\\n    -webkit-transition: all 0.25s ease;\\n    -o-transition: all 0.25s ease;\\n    transition: all 0.25s ease;\\n}\\n\\n.card_left-button_2IXDY:hover, .card_right-button_3Py4m:hover {\\n    -webkit-box-shadow: 0 0 0 6px hsla(163, 85%, 40%, 0.35);\\n            box-shadow: 0 0 0 6px hsla(163, 85%, 40%, 0.35);\\n    -webkit-transform: scale(1.125);\\n        -ms-transform: scale(1.125);\\n            transform: scale(1.125);\\n}\\n\\n.card_left-button_2IXDY img, .card_right-button_3Py4m img{\\n    width: 1.75rem;\\n}\\n\\n.card_left-button_2IXDY {\\n    left: -27px;\\n}\\n\\n.card_right-button_3Py4m {\\n    right: -27px;\\n}\\n\\n.card_card_3GG7C {\\n    border: 1px solid hsla(215, 50%, 90%, 1);\\n    border-radius: 0.75rem;\\n    display: -webkit-box;\\n    display: -webkit-flex;\\n    display: -ms-flexbox;\\n    display: flex;\\n    -webkit-box-orient: vertical;\\n    -webkit-box-direction: normal;\\n    -webkit-flex-direction: column;\\n        -ms-flex-direction: column;\\n            flex-direction: column;\\n    cursor: move;\\n    z-index: 20;\\n    overflow: hidden;\\n    -webkit-box-shadow: 0px 5px 25px 5px hsla(0, 0%, 0%, 0.15);\\n            box-shadow: 0px 5px 25px 5px hsla(0, 0%, 0%, 0.15);\\n    -webkit-box-align: center;\\n    -webkit-align-items: center;\\n        -ms-flex-align: center;\\n            align-items: center;\\n    font-family: \\\"Helvetica Neue\\\", Helvetica, Arial, sans-serif;\\n}\\n\\n.card_header-buttons_3Yq16 {\\n    width: 100%;\\n    display: -webkit-box;\\n    display: -webkit-flex;\\n    display: -ms-flexbox;\\n    display: flex;\\n    -webkit-box-orient: horizontal;\\n    -webkit-box-direction: normal;\\n    -webkit-flex-direction: row;\\n        -ms-flex-direction: row;\\n            flex-direction: row;\\n    -webkit-box-pack: justify;\\n    -webkit-justify-content: space-between;\\n        -ms-flex-pack: justify;\\n            justify-content: space-between;\\n    -webkit-box-align: center;\\n    -webkit-align-items: center;\\n        -ms-flex-align: center;\\n            align-items: center;\\n    background: hsla(163, 85%, 40%, 1);\\n    border-bottom: 1px solid hsla(163, 85%, 30%, 1);\\n    font-size: 0.625rem;\\n    font-weight: bold;\\n}\\n\\n.card_header-buttons-hidden_3y5Bd {\\n    border-bottom: 0px;\\n}\\n\\n.card_header-buttons-right_2bzRm {\\n    display: -webkit-box;\\n    display: -webkit-flex;\\n    display: -ms-flexbox;\\n    display: flex;\\n    -webkit-box-orient: horizontal;\\n    -webkit-box-direction: normal;\\n    -webkit-flex-direction: row;\\n        -ms-flex-direction: row;\\n            flex-direction: row;\\n}\\n\\n.card_header-buttons_3Yq16 img {\\n    margin-bottom: 2px;\\n}\\n\\n.card_shrink-expand-button_vbegz {\\n    cursor: pointer;\\n    color: white;\\n    display: -webkit-box;\\n    display: -webkit-flex;\\n    display: -ms-flexbox;\\n    display: flex;\\n    -webkit-box-orient: vertical;\\n    -webkit-box-direction: normal;\\n    -webkit-flex-direction: column;\\n        -ms-flex-direction: column;\\n            flex-direction: column;\\n    -webkit-box-pack: center;\\n    -webkit-justify-content: center;\\n        -ms-flex-pack: center;\\n            justify-content: center;\\n    -webkit-box-align: center;\\n    -webkit-align-items: center;\\n        -ms-flex-align: center;\\n            align-items: center;\\n    padding: 0.75rem;\\n}\\n\\n.card_shrink-expand-button_vbegz:hover, .card_all-button_15rrQ:hover {\\n    background-color: hsla(0, 0%, 0%, 0.15);\\n}\\n\\n.card_remove-button_1F8SI, .card_all-button_15rrQ {\\n    cursor: pointer;\\n    color: white;\\n    display: -webkit-box;\\n    display: -webkit-flex;\\n    display: -ms-flexbox;\\n    display: flex;\\n    -webkit-box-orient: vertical;\\n    -webkit-box-direction: normal;\\n    -webkit-flex-direction: column;\\n        -ms-flex-direction: column;\\n            flex-direction: column;\\n    -webkit-box-pack: center;\\n    -webkit-justify-content: center;\\n        -ms-flex-pack: center;\\n            justify-content: center;\\n    -webkit-box-align: center;\\n    -webkit-align-items: center;\\n        -ms-flex-align: center;\\n            align-items: center;\\n    padding: 0.75rem;\\n}\\n\\n.card_remove-button_1F8SI:hover, .card_all-button_15rrQ:hover {\\n    background-color: hsla(0, 0%, 0%, 0.15);\\n}\\n\\n.card_step-title_13--3 {\\n    font-size: 0.9rem;\\n    margin: 0.9rem;\\n    text-align: center;\\n    font-weight: bold;\\n    color: hsla(225, 15%, 40%, 1);\\n}\\n\\n.card_step-body_2bFkf {\\n    width: 100%;\\n    background: hsla(0, 100%, 100%, 1);\\n    display: -webkit-box;\\n    display: -webkit-flex;\\n    display: -ms-flexbox;\\n    display: flex;\\n    -webkit-box-orient: vertical;\\n    -webkit-box-direction: normal;\\n    -webkit-flex-direction: column;\\n        -ms-flex-direction: column;\\n            flex-direction: column;\\n    -webkit-box-pack: center;\\n    -webkit-justify-content: center;\\n        -ms-flex-pack: center;\\n            justify-content: center;\\n    -webkit-box-align: center;\\n    -webkit-align-items: center;\\n        -ms-flex-align: center;\\n            align-items: center;\\n    position: relative;\\n    text-align: center;\\n\\n    /* Min height prevents layout changing when images change */\\n    min-height: 256px;\\n}\\n\\n.card_step-video_3qH9J {\\n    height: 256px;\\n}\\n\\n.card_step-image_2_jUv {\\n    max-width: 450px;\\n    max-height: 200px;\\n    -o-object-fit: contain;\\n       object-fit: contain;\\n    background: #F9F9F9;\\n    border: 1px solid #ddd;\\n    border-radius: 0.5rem;\\n    overflow: hidden;\\n    margin: 0 0.5rem 0.5rem;\\n}\\n\\n.card_decks_1oD6G {\\n    display: -webkit-box;\\n    display: -webkit-flex;\\n    display: -ms-flexbox;\\n    display: flex;\\n    -webkit-box-orient: horizontal;\\n    -webkit-box-direction: normal;\\n    -webkit-flex-direction: row;\\n        -ms-flex-direction: row;\\n            flex-direction: row;\\n    -webkit-justify-content: space-around;\\n        -ms-flex-pack: distribute;\\n            justify-content: space-around;\\n    padding: 0 1rem 0.5rem;\\n}\\n\\n.card_deck_2NtVa {\\n    display: -webkit-box;\\n    display: -webkit-flex;\\n    display: -ms-flexbox;\\n    display: flex;\\n    -webkit-box-orient: vertical;\\n    -webkit-box-direction: normal;\\n    -webkit-flex-direction: column;\\n        -ms-flex-direction: column;\\n            flex-direction: column;\\n    margin: 0 8px 8px;\\n    cursor: pointer;\\n    border: 1px solid hsla(0, 0%, 0%, 0.15);\\n    border-radius: 0.25rem;\\n    overflow: hidden;\\n}\\n\\n.card_deck-image_1V3q9 {\\n    width: 200px;\\n    height: 100px;\\n    -o-object-fit: cover;\\n       object-fit: cover;\\n}\\n\\n.card_deck-name_1SJhM {\\n    color: hsla(215, 100%, 65%, 1);\\n    font-weight: bold;\\n    font-size: 0.85rem;\\n    margin: .625rem 0px;\\n    text-align: center;\\n    font-weight: bold;\\n    text-align: center;\\n    max-width: 200px;\\n}\\n\\n.card_help-icon_1iyk7 {\\n    height: 1.25rem;\\n}\\n\\n.card_close-icon_1FYf5 {\\n    height: 1.25rem;\\n    margin: .125rem 0; /* To offset the .25rem difference in icon size */\\n}\\n\\n[dir=\\\"ltr\\\"] .card_help-icon_1iyk7 {\\n    margin-right: 0.25rem;\\n}\\n\\n[dir=\\\"rtl\\\"] .card_help-icon_1iyk7 {\\n    margin-left: 0.25rem;\\n}\\n\\n[dir=\\\"ltr\\\"] .card_close-icon_1FYf5 {\\n    margin-left: 0.25rem;\\n}\\n\\n[dir=\\\"rtl\\\"] .card_close-icon_1FYf5 {\\n    margin-right: 0.25rem;\\n}\\n\\n.card_see-all_1_E8D {\\n    display: -webkit-box;\\n    display: -webkit-flex;\\n    display: -ms-flexbox;\\n    display: flex;\\n    -webkit-box-orient: horizontal;\\n    -webkit-box-direction: normal;\\n    -webkit-flex-direction: row;\\n        -ms-flex-direction: row;\\n            flex-direction: row;\\n    -webkit-box-pack: center;\\n    -webkit-justify-content: center;\\n        -ms-flex-pack: center;\\n            justify-content: center;\\n    width: 100%;\\n    padding: 0.5rem;\\n}\\n\\n.card_see-all-button_3o4U8 {\\n    cursor: pointer;\\n    padding: 0.5rem 1rem;\\n    background-color: hsla(215, 100%, 65%, 1);\\n    color: white;\\n    font-weight: bold;\\n    border-radius: 0.25rem;\\n    display: -webkit-box;\\n    display: -webkit-flex;\\n    display: -ms-flexbox;\\n    display: flex;\\n    -webkit-box-align: center;\\n    -webkit-align-items: center;\\n        -ms-flex-align: center;\\n            align-items: center;\\n    color: hsla(0, 100%, 100%, 1);\\n    font-size: .75rem;\\n    font-weight: bold;\\n    line-height: 1rem;\\n    text-align: center;\\n}\\n\\n[dir=\\\"ltr\\\"] .card_see-all-button_3o4U8 img {\\n    margin-left: 0.5rem;\\n}\\n\\n[dir=\\\"rtl\\\"] .card_see-all-button_3o4U8 img {\\n    margin-right: 0.5rem;\\n}\\n\\n.card_steps-list_22Q1P {\\n    display: -webkit-box;\\n    display: -webkit-flex;\\n    display: -ms-flexbox;\\n    display: flex;\\n    -webkit-box-orient: horizontal;\\n    -webkit-box-direction: normal;\\n    -webkit-flex-direction: row;\\n        -ms-flex-direction: row;\\n            flex-direction: row;\\n    -webkit-box-pack: center;\\n    -webkit-justify-content: center;\\n        -ms-flex-pack: center;\\n            justify-content: center;\\n    -webkit-box-align: center;\\n    -webkit-align-items: center;\\n        -ms-flex-align: center;\\n            align-items: center;\\n}\\n\\n.card_active-step-pip_I0bxo, .card_inactiveStepPip_2lVp2 {\\n    width: 0.5rem;\\n    height: 0.5rem;\\n    margin: 0 0.25rem;\\n    border-radius: 100%;\\n    background: hsla(0, 100%, 100%, 0.25);\\n}\\n\\n.card_active-step-pip_I0bxo {\\n    background: hsla(0, 100%, 100%, 1);\\n    -webkit-box-shadow: 0px 0px 0px 2px hsla(0, 0%, 0%, 0.15);\\n            box-shadow: 0px 0px 0px 2px hsla(0, 0%, 0%, 0.15);\\n}\\n\\n.card_hidden_Jk77J {\\n    display: none;\\n}\\n\", \"\"]);\n// exports\nexports.locals = {\n\t\"card-container-overlay\": \"card_card-container-overlay_gnjBL\",\n\t\"cardContainerOverlay\": \"card_card-container-overlay_gnjBL\",\n\t\"card-container\": \"card_card-container_3_Sbc\",\n\t\"cardContainer\": \"card_card-container_3_Sbc\",\n\t\"left-card\": \"card_left-card_1KpEh\",\n\t\"leftCard\": \"card_left-card_1KpEh\",\n\t\"right-card\": \"card_right-card_3IrbD\",\n\t\"rightCard\": \"card_right-card_3IrbD\",\n\t\"left-button\": \"card_left-button_2IXDY\",\n\t\"leftButton\": \"card_left-button_2IXDY\",\n\t\"right-button\": \"card_right-button_3Py4m\",\n\t\"rightButton\": \"card_right-button_3Py4m\",\n\t\"card\": \"card_card_3GG7C\",\n\t\"header-buttons\": \"card_header-buttons_3Yq16\",\n\t\"headerButtons\": \"card_header-buttons_3Yq16\",\n\t\"header-buttons-hidden\": \"card_header-buttons-hidden_3y5Bd\",\n\t\"headerButtonsHidden\": \"card_header-buttons-hidden_3y5Bd\",\n\t\"header-buttons-right\": \"card_header-buttons-right_2bzRm\",\n\t\"headerButtonsRight\": \"card_header-buttons-right_2bzRm\",\n\t\"shrink-expand-button\": \"card_shrink-expand-button_vbegz\",\n\t\"shrinkExpandButton\": \"card_shrink-expand-button_vbegz\",\n\t\"all-button\": \"card_all-button_15rrQ\",\n\t\"allButton\": \"card_all-button_15rrQ\",\n\t\"remove-button\": \"card_remove-button_1F8SI\",\n\t\"removeButton\": \"card_remove-button_1F8SI\",\n\t\"step-title\": \"card_step-title_13--3\",\n\t\"stepTitle\": \"card_step-title_13--3\",\n\t\"step-body\": \"card_step-body_2bFkf\",\n\t\"stepBody\": \"card_step-body_2bFkf\",\n\t\"step-video\": \"card_step-video_3qH9J\",\n\t\"stepVideo\": \"card_step-video_3qH9J\",\n\t\"step-image\": \"card_step-image_2_jUv\",\n\t\"stepImage\": \"card_step-image_2_jUv\",\n\t\"decks\": \"card_decks_1oD6G\",\n\t\"deck\": \"card_deck_2NtVa\",\n\t\"deck-image\": \"card_deck-image_1V3q9\",\n\t\"deckImage\": \"card_deck-image_1V3q9\",\n\t\"deck-name\": \"card_deck-name_1SJhM\",\n\t\"deckName\": \"card_deck-name_1SJhM\",\n\t\"help-icon\": \"card_help-icon_1iyk7\",\n\t\"helpIcon\": \"card_help-icon_1iyk7\",\n\t\"close-icon\": \"card_close-icon_1FYf5\",\n\t\"closeIcon\": \"card_close-icon_1FYf5\",\n\t\"see-all\": \"card_see-all_1_E8D\",\n\t\"seeAll\": \"card_see-all_1_E8D\",\n\t\"see-all-button\": \"card_see-all-button_3o4U8\",\n\t\"seeAllButton\": \"card_see-all-button_3o4U8\",\n\t\"steps-list\": \"card_steps-list_22Q1P\",\n\t\"stepsList\": \"card_steps-list_22Q1P\",\n\t\"active-step-pip\": \"card_active-step-pip_I0bxo\",\n\t\"activeStepPip\": \"card_active-step-pip_I0bxo\",\n\t\"inactiveStepPip\": \"card_inactiveStepPip_2lVp2\",\n\t\"hidden\": \"card_hidden_Jk77J\"\n};\n })