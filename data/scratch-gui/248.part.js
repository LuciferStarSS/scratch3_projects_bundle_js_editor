/* 248 */\n (function(module, __webpack_exports__, __webpack_require__) {\n\"use strict\";\n var scratch_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(12);\n var scratch_blocks__WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(scratch_blocks__WEBPACK_IMPORTED_MODULE_0__);\nfunction _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === \"undefined\" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === \"number\") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError(\"Invalid attempt to iterate non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.\"); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }\nfunction _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }\nfunction _nonIterableRest() { throw new TypeError(\"Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.\"); }\nfunction _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === \"string\") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === \"Object\" && o.constructor) n = o.constructor.name; if (n === \"Map\" || n === \"Set\") return Array.from(o); if (n === \"Arguments\" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }\nfunction _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }\nfunction _iterableToArrayLimit(arr, i) { if (typeof Symbol === \"undefined\" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i[\"return\"] != null) _i[\"return\"](); } finally { if (_d) throw _e; } } return _arr; }\nfunction _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }\nvar categorySeparator = '<sep gap=\"36\"/>';\nvar blockSeparator = '<sep gap=\"36\"/>'; // At default scale, about 28px\n/* eslint-disable no-unused-vars */\nvar motion = function motion(isInitialSetup, isStage, targetId) {\n  var stageSelected = scratch_blocks__WEBPACK_IMPORTED_MODULE_0___default.a.ScratchMsgs.translate('MOTION_STAGE_SELECTED', 'Stage selected: no motion blocks');\n  return \"\\n    <category name=\\\"%{BKY_CATEGORY_MOTION}\\\" id=\\\"motion\\\" colour=\\\"#4C97FF\\\" secondaryColour=\\\"#3373CC\\\">\\n        \".concat(isStage ? \"\\n        <label text=\\\"\".concat(stageSelected, \"\\\"></label>\\n        \") : \"\\n        <block type=\\\"motion_movesteps\\\">\\n            <value name=\\\"STEPS\\\">\\n                <shadow type=\\\"math_number\\\">\\n                    <field name=\\\"NUM\\\">10</field>\\n                </shadow>\\n            </value>\\n        </block>\\n        <block type=\\\"motion_turnright\\\">\\n            <value name=\\\"DEGREES\\\">\\n                <shadow type=\\\"math_number\\\">\\n                    <field name=\\\"NUM\\\">15</field>\\n                </shadow>\\n            </value>\\n        </block>\\n        <block type=\\\"motion_turnleft\\\">\\n            <value name=\\\"DEGREES\\\">\\n                <shadow type=\\\"math_number\\\">\\n                    <field name=\\\"NUM\\\">15</field>\\n                </shadow>\\n            </value>\\n        </block>\\n        \".concat(blockSeparator, \"\\n        <block type=\\\"motion_goto\\\">\\n            <value name=\\\"TO\\\">\\n                <shadow type=\\\"motion_goto_menu\\\">\\n                </shadow>\\n            </value>\\n        </block>\\n        <block type=\\\"motion_gotoxy\\\">\\n            <value name=\\\"X\\\">\\n                <shadow id=\\\"movex\\\" type=\\\"math_number\\\">\\n                    <field name=\\\"NUM\\\">0</field>\\n                </shadow>\\n            </value>\\n            <value name=\\\"Y\\\">\\n                <shadow id=\\\"movey\\\" type=\\\"math_number\\\">\\n                    <field name=\\\"NUM\\\">0</field>\\n                </shadow>\\n            </value>\\n        </block>\\n        <block type=\\\"motion_glideto\\\" id=\\\"motion_glideto\\\">\\n            <value name=\\\"SECS\\\">\\n                <shadow type=\\\"math_number\\\">\\n                    <field name=\\\"NUM\\\">1</field>\\n                </shadow>\\n            </value>\\n            <value name=\\\"TO\\\">\\n                <shadow type=\\\"motion_glideto_menu\\\">\\n                </shadow>\\n            </value>\\n        </block>\\n        <block type=\\\"motion_glidesecstoxy\\\">\\n            <value name=\\\"SECS\\\">\\n                <shadow type=\\\"math_number\\\">\\n                    <field name=\\\"NUM\\\">1</field>\\n                </shadow>\\n            </value>\\n            <value name=\\\"X\\\">\\n                <shadow id=\\\"glidex\\\" type=\\\"math_number\\\">\\n                    <field name=\\\"NUM\\\">0</field>\\n                </shadow>\\n            </value>\\n            <value name=\\\"Y\\\">\\n                <shadow id=\\\"glidey\\\" type=\\\"math_number\\\">\\n                    <field name=\\\"NUM\\\">0</field>\\n                </shadow>\\n            </value>\\n        </block>\\n        \").concat(blockSeparator, \"\\n        <block type=\\\"motion_pointindirection\\\">\\n            <value name=\\\"DIRECTION\\\">\\n                <shadow type=\\\"math_angle\\\">\\n                    <field name=\\\"NUM\\\">90</field>\\n                </shadow>\\n            </value>\\n        </block>\\n        <block type=\\\"motion_pointtowards\\\">\\n            <value name=\\\"TOWARDS\\\">\\n                <shadow type=\\\"motion_pointtowards_menu\\\">\\n                </shadow>\\n            </value>\\n        </block>\\n        \").concat(blockSeparator, \"\\n        <block type=\\\"motion_changexby\\\">\\n            <value name=\\\"DX\\\">\\n                <shadow type=\\\"math_number\\\">\\n                    <field name=\\\"NUM\\\">10</field>\\n                </shadow>\\n            </value>\\n        </block>\\n        <block type=\\\"motion_setx\\\">\\n            <value name=\\\"X\\\">\\n                <shadow id=\\\"setx\\\" type=\\\"math_number\\\">\\n                    <field name=\\\"NUM\\\">0</field>\\n                </shadow>\\n            </value>\\n        </block>\\n        <block type=\\\"motion_changeyby\\\">\\n            <value name=\\\"DY\\\">\\n                <shadow type=\\\"math_number\\\">\\n                    <field name=\\\"NUM\\\">10</field>\\n                </shadow>\\n            </value>\\n        </block>\\n        <block type=\\\"motion_sety\\\">\\n            <value name=\\\"Y\\\">\\n                <shadow id=\\\"sety\\\" type=\\\"math_number\\\">\\n                    <field name=\\\"NUM\\\">0</field>\\n                </shadow>\\n            </value>\\n        </block>\\n        \").concat(blockSeparator, \"\\n        <block type=\\\"motion_ifonedgebounce\\\"/>\\n        \").concat(blockSeparator, \"\\n        <block type=\\\"motion_setrotationstyle\\\"/>\\n        \").concat(blockSeparator, \"\\n        <block id=\\\"\").concat(targetId, \"_xposition\\\" type=\\\"motion_xposition\\\"/>\\n        <block id=\\\"\").concat(targetId, \"_yposition\\\" type=\\\"motion_yposition\\\"/>\\n        <block id=\\\"\").concat(targetId, \"_direction\\\" type=\\\"motion_direction\\\"/>\"), \"\\n        \").concat(categorySeparator, \"\\n    </category>\\n    \");\n};\nvar xmlEscape = function xmlEscape(unsafe) {\n  return unsafe.replace(/[<>&'\"]/g, function (c) {\n    switch (c) {\n      case '<':\n        return '&lt;';\n      case '>':\n        return '&gt;';\n      case '&':\n        return '&amp;';\n      case '\\'':\n        return '&apos;';\n      case '\"':\n        return '&quot;';\n    }\n  });\n};\nvar looks = function looks(isInitialSetup, isStage, targetId, costumeName, backdropName) {\n  var hello = scratch_blocks__WEBPACK_IMPORTED_MODULE_0___default.a.ScratchMsgs.translate('LOOKS_HELLO', 'Hello!');\n  var hmm = scratch_blocks__WEBPACK_IMPORTED_MODULE_0___default.a.ScratchMsgs.translate('LOOKS_HMM', 'Hmm...');\n  return \"\\n    <category name=\\\"%{BKY_CATEGORY_LOOKS}\\\" id=\\\"looks\\\" colour=\\\"#9966FF\\\" secondaryColour=\\\"#774DCB\\\">\\n        \".concat(isStage ? '' : \"\\n        <block type=\\\"looks_sayforsecs\\\">\\n            <value name=\\\"MESSAGE\\\">\\n                <shadow type=\\\"text\\\">\\n                    <field name=\\\"TEXT\\\">\".concat(hello, \"</field>\\n                </shadow>\\n            </value>\\n            <value name=\\\"SECS\\\">\\n                <shadow type=\\\"math_number\\\">\\n                    <field name=\\\"NUM\\\">2</field>\\n                </shadow>\\n            </value>\\n        </block>\\n        <block type=\\\"looks_say\\\">\\n            <value name=\\\"MESSAGE\\\">\\n                <shadow type=\\\"text\\\">\\n                    <field name=\\\"TEXT\\\">\").concat(hello, \"</field>\\n                </shadow>\\n            </value>\\n        </block>\\n        <block type=\\\"looks_thinkforsecs\\\">\\n            <value name=\\\"MESSAGE\\\">\\n                <shadow type=\\\"text\\\">\\n                    <field name=\\\"TEXT\\\">\").concat(hmm, \"</field>\\n                </shadow>\\n            </value>\\n            <value name=\\\"SECS\\\">\\n                <shadow type=\\\"math_number\\\">\\n                    <field name=\\\"NUM\\\">2</field>\\n                </shadow>\\n            </value>\\n        </block>\\n        <block type=\\\"looks_think\\\">\\n            <value name=\\\"MESSAGE\\\">\\n                <shadow type=\\\"text\\\">\\n                    <field name=\\\"TEXT\\\">\").concat(hmm, \"</field>\\n                </shadow>\\n            </value>\\n        </block>\\n        \").concat(blockSeparator, \"\\n        \"), \"\\n        \").concat(isStage ? \"\\n            <block type=\\\"looks_switchbackdropto\\\">\\n                <value name=\\\"BACKDROP\\\">\\n                    <shadow type=\\\"looks_backdrops\\\">\\n                        <field name=\\\"BACKDROP\\\">\".concat(backdropName, \"</field>\\n                    </shadow>\\n                </value>\\n            </block>\\n            <block type=\\\"looks_switchbackdroptoandwait\\\">\\n                <value name=\\\"BACKDROP\\\">\\n                    <shadow type=\\\"looks_backdrops\\\">\\n                        <field name=\\\"BACKDROP\\\">\").concat(backdropName, \"</field>\\n                    </shadow>\\n                </value>\\n            </block>\\n            <block type=\\\"looks_nextbackdrop\\\"/>\\n        \") : \"\\n            <block id=\\\"\".concat(targetId, \"_switchcostumeto\\\" type=\\\"looks_switchcostumeto\\\">\\n                <value name=\\\"COSTUME\\\">\\n                    <shadow type=\\\"looks_costume\\\">\\n                        <field name=\\\"COSTUME\\\">\").concat(costumeName, \"</field>\\n                    </shadow>\\n                </value>\\n            </block>\\n            <block type=\\\"looks_nextcostume\\\"/>\\n            <block type=\\\"looks_switchbackdropto\\\">\\n                <value name=\\\"BACKDROP\\\">\\n                    <shadow type=\\\"looks_backdrops\\\">\\n                        <field name=\\\"BACKDROP\\\">\").concat(backdropName, \"</field>\\n                    </shadow>\\n                </value>\\n            </block>\\n            <block type=\\\"looks_nextbackdrop\\\"/>\\n            \").concat(blockSeparator, \"\\n            <block type=\\\"looks_changesizeby\\\">\\n                <value name=\\\"CHANGE\\\">\\n                    <shadow type=\\\"math_number\\\">\\n                        <field name=\\\"NUM\\\">10</field>\\n                    </shadow>\\n                </value>\\n            </block>\\n            <block type=\\\"looks_setsizeto\\\">\\n                <value name=\\\"SIZE\\\">\\n                    <shadow type=\\\"math_number\\\">\\n                        <field name=\\\"NUM\\\">100</field>\\n                    </shadow>\\n                </value>\\n            </block>\\n        \"), \"\\n        \").concat(blockSeparator, \"\\n        <block type=\\\"looks_changeeffectby\\\">\\n            <value name=\\\"CHANGE\\\">\\n                <shadow type=\\\"math_number\\\">\\n                    <field name=\\\"NUM\\\">25</field>\\n                </shadow>\\n            </value>\\n        </block>\\n        <block type=\\\"looks_seteffectto\\\">\\n            <value name=\\\"VALUE\\\">\\n                <shadow type=\\\"math_number\\\">\\n                    <field name=\\\"NUM\\\">0</field>\\n                </shadow>\\n            </value>\\n        </block>\\n        <block type=\\\"looks_cleargraphiceffects\\\"/>\\n        \").concat(blockSeparator, \"\\n        \").concat(isStage ? '' : \"\\n            <block type=\\\"looks_show\\\"/>\\n            <block type=\\\"looks_hide\\\"/>\\n        \".concat(blockSeparator, \"\\n            <block type=\\\"looks_gotofrontback\\\"/>\\n            <block type=\\\"looks_goforwardbackwardlayers\\\">\\n                <value name=\\\"NUM\\\">\\n                    <shadow type=\\\"math_integer\\\">\\n                        <field name=\\\"NUM\\\">1</field>\\n                    </shadow>\\n                </value>\\n            </block>\\n        \"), \"\\n        \").concat(isStage ? \"\\n            <block id=\\\"backdropnumbername\\\" type=\\\"looks_backdropnumbername\\\"/>\\n        \" : \"\\n            <block id=\\\"\".concat(targetId, \"_costumenumbername\\\" type=\\\"looks_costumenumbername\\\"/>\\n            <block id=\\\"backdropnumbername\\\" type=\\\"looks_backdropnumbername\\\"/>\\n            <block id=\\\"\").concat(targetId, \"_size\\\" type=\\\"looks_size\\\"/>\\n        \"), \"\\n        \").concat(categorySeparator, \"\\n    </category>\\n    \");\n};\nvar sound = function sound(isInitialSetup, isStage, targetId, soundName) {\n  return \"\\n    <category name=\\\"%{BKY_CATEGORY_SOUND}\\\" id=\\\"sound\\\" colour=\\\"#D65CD6\\\" secondaryColour=\\\"#BD42BD\\\">\\n        <block id=\\\"\".concat(targetId, \"_sound_playuntildone\\\" type=\\\"sound_playuntildone\\\">\\n            <value name=\\\"SOUND_MENU\\\">\\n                <shadow type=\\\"sound_sounds_menu\\\">\\n                    <field name=\\\"SOUND_MENU\\\">\").concat(soundName, \"</field>\\n                </shadow>\\n            </value>\\n        </block>\\n        <block id=\\\"\").concat(targetId, \"_sound_play\\\" type=\\\"sound_play\\\">\\n            <value name=\\\"SOUND_MENU\\\">\\n                <shadow type=\\\"sound_sounds_menu\\\">\\n                    <field name=\\\"SOUND_MENU\\\">\").concat(soundName, \"</field>\\n                </shadow>\\n            </value>\\n        </block>\\n        <block type=\\\"sound_stopallsounds\\\"/>\\n        \").concat(blockSeparator, \"\\n        <block type=\\\"sound_changeeffectby\\\">\\n            <value name=\\\"VALUE\\\">\\n                <shadow type=\\\"math_number\\\">\\n                    <field name=\\\"NUM\\\">10</field>\\n                </shadow>\\n            </value>\\n        </block>\\n        <block type=\\\"sound_seteffectto\\\">\\n            <value name=\\\"VALUE\\\">\\n                <shadow type=\\\"math_number\\\">\\n                    <field name=\\\"NUM\\\">100</field>\\n                </shadow>\\n            </value>\\n        </block>\\n        <block type=\\\"sound_cleareffects\\\"/>\\n        \").concat(blockSeparator, \"\\n        <block type=\\\"sound_changevolumeby\\\">\\n            <value name=\\\"VOLUME\\\">\\n                <shadow type=\\\"math_number\\\">\\n                    <field name=\\\"NUM\\\">-10</field>\\n                </shadow>\\n            </value>\\n        </block>\\n        <block type=\\\"sound_setvolumeto\\\">\\n            <value name=\\\"VOLUME\\\">\\n                <shadow type=\\\"math_number\\\">\\n                    <field name=\\\"NUM\\\">100</field>\\n                </shadow>\\n            </value>\\n        </block>\\n        <block id=\\\"\").concat(targetId, \"_volume\\\" type=\\\"sound_volume\\\"/>\\n        \").concat(categorySeparator, \"\\n    </category>\\n    \");\n};\nvar events = function events(isInitialSetup, isStage) {\n  return \"\\n    <category name=\\\"%{BKY_CATEGORY_EVENTS}\\\" id=\\\"events\\\" colour=\\\"#FFD500\\\" secondaryColour=\\\"#CC9900\\\">\\n        <block type=\\\"event_whenflagclicked\\\"/>\\n        <block type=\\\"event_whenkeypressed\\\">\\n        </block>\\n        \".concat(isStage ? \"\\n            <block type=\\\"event_whenstageclicked\\\"/>\\n        \" : \"\\n            <block type=\\\"event_whenthisspriteclicked\\\"/>\\n        \", \"\\n        <block type=\\\"event_whenbackdropswitchesto\\\">\\n        </block>\\n        \").concat(blockSeparator, \"\\n        <block type=\\\"event_whengreaterthan\\\">\\n            <value name=\\\"VALUE\\\">\\n                <shadow type=\\\"math_number\\\">\\n                    <field name=\\\"NUM\\\">10</field>\\n                </shadow>\\n            </value>\\n        </block>\\n        \").concat(blockSeparator, \"\\n        <block type=\\\"event_whenbroadcastreceived\\\">\\n        </block>\\n        <block type=\\\"event_broadcast\\\">\\n            <value name=\\\"BROADCAST_INPUT\\\">\\n                <shadow type=\\\"event_broadcast_menu\\\"></shadow>\\n            </value>\\n        </block>\\n        <block type=\\\"event_broadcastandwait\\\">\\n            <value name=\\\"BROADCAST_INPUT\\\">\\n              <shadow type=\\\"event_broadcast_menu\\\"></shadow>\\n            </value>\\n        </block>\\n        \").concat(categorySeparator, \"\\n    </category>\\n    \");\n};\nvar control = function control(isInitialSetup, isStage) {\n  return \"\\n    <category name=\\\"%{BKY_CATEGORY_CONTROL}\\\" id=\\\"control\\\" colour=\\\"#FFAB19\\\" secondaryColour=\\\"#CF8B17\\\">\\n        <block type=\\\"control_wait\\\">\\n            <value name=\\\"DURATION\\\">\\n                <shadow type=\\\"math_positive_number\\\">\\n                    <field name=\\\"NUM\\\">1</field>\\n                </shadow>\\n            </value>\\n        </block>\\n        \".concat(blockSeparator, \"\\n        <block type=\\\"control_repeat\\\">\\n            <value name=\\\"TIMES\\\">\\n                <shadow type=\\\"math_whole_number\\\">\\n                    <field name=\\\"NUM\\\">10</field>\\n                </shadow>\\n            </value>\\n        </block>\\n        <block id=\\\"forever\\\" type=\\\"control_forever\\\"/>\\n        \").concat(blockSeparator, \"\\n        <block type=\\\"control_if\\\"/>\\n        <block type=\\\"control_if_else\\\"/>\\n        <block id=\\\"wait_until\\\" type=\\\"control_wait_until\\\"/>\\n        <block id=\\\"repeat_until\\\" type=\\\"control_repeat_until\\\"/>\\n        \").concat(blockSeparator, \"\\n        <block type=\\\"control_stop\\\"/>\\n        \").concat(blockSeparator, \"\\n        \").concat(isStage ? \"\\n            <block type=\\\"control_create_clone_of\\\">\\n                <value name=\\\"CLONE_OPTION\\\">\\n                    <shadow type=\\\"control_create_clone_of_menu\\\"/>\\n                </value>\\n            </block>\\n        \" : \"\\n            <block type=\\\"control_start_as_clone\\\"/>\\n            <block type=\\\"control_create_clone_of\\\">\\n                <value name=\\\"CLONE_OPTION\\\">\\n                    <shadow type=\\\"control_create_clone_of_menu\\\"/>\\n                </value>\\n            </block>\\n            <block type=\\\"control_delete_this_clone\\\"/>\\n        \", \"\\n        \").concat(categorySeparator, \"\\n    </category>\\n    \");\n};\nvar sensing = function sensing(isInitialSetup, isStage) {\n  var name = scratch_blocks__WEBPACK_IMPORTED_MODULE_0___default.a.ScratchMsgs.translate('SENSING_ASK_TEXT', 'What\\'s your name?');\n  return \"\\n    <category name=\\\"%{BKY_CATEGORY_SENSING}\\\" id=\\\"sensing\\\" colour=\\\"#4CBFE6\\\" secondaryColour=\\\"#2E8EB8\\\">\\n        \".concat(isStage ? '' : \"\\n            <block type=\\\"sensing_touchingobject\\\">\\n                <value name=\\\"TOUCHINGOBJECTMENU\\\">\\n                    <shadow type=\\\"sensing_touchingobjectmenu\\\"/>\\n                </value>\\n            </block>\\n            <block type=\\\"sensing_touchingcolor\\\">\\n                <value name=\\\"COLOR\\\">\\n                    <shadow type=\\\"colour_picker\\\"/>\\n                </value>\\n            </block>\\n            <block type=\\\"sensing_coloristouchingcolor\\\">\\n                <value name=\\\"COLOR\\\">\\n                    <shadow type=\\\"colour_picker\\\"/>\\n                </value>\\n                <value name=\\\"COLOR2\\\">\\n                    <shadow type=\\\"colour_picker\\\"/>\\n                </value>\\n            </block>\\n            <block type=\\\"sensing_distanceto\\\">\\n                <value name=\\\"DISTANCETOMENU\\\">\\n                    <shadow type=\\\"sensing_distancetomenu\\\"/>\\n                </value>\\n            </block>\\n            \".concat(blockSeparator, \"\\n        \"), \"\\n        \").concat(isInitialSetup ? '' : \"\\n            <block id=\\\"askandwait\\\" type=\\\"sensing_askandwait\\\">\\n                <value name=\\\"QUESTION\\\">\\n                    <shadow type=\\\"text\\\">\\n                        <field name=\\\"TEXT\\\">\".concat(name, \"</field>\\n                    </shadow>\\n                </value>\\n            </block>\\n        \"), \"\\n        <block id=\\\"answer\\\" type=\\\"sensing_answer\\\"/>\\n        \").concat(blockSeparator, \"\\n        <block type=\\\"sensing_keypressed\\\">\\n            <value name=\\\"KEY_OPTION\\\">\\n                <shadow type=\\\"sensing_keyoptions\\\"/>\\n            </value>\\n        </block>\\n        <block type=\\\"sensing_mousedown\\\"/>\\n        <block type=\\\"sensing_mousex\\\"/>\\n        <block type=\\\"sensing_mousey\\\"/>\\n        \").concat(isStage ? '' : \"\\n            \".concat(blockSeparator, \"\\n            '<block type=\\\"sensing_setdragmode\\\" id=\\\"sensing_setdragmode\\\"></block>'+\\n            \").concat(blockSeparator, \"\\n        \"), \"\\n        \").concat(blockSeparator, \"\\n        <block id=\\\"loudness\\\" type=\\\"sensing_loudness\\\"/>\\n        \").concat(blockSeparator, \"\\n        <block id=\\\"timer\\\" type=\\\"sensing_timer\\\"/>\\n        <block type=\\\"sensing_resettimer\\\"/>\\n        \").concat(blockSeparator, \"\\n        <block id=\\\"of\\\" type=\\\"sensing_of\\\">\\n            <value name=\\\"OBJECT\\\">\\n                <shadow id=\\\"sensing_of_object_menu\\\" type=\\\"sensing_of_object_menu\\\"/>\\n            </value>\\n        </block>\\n        \").concat(blockSeparator, \"\\n        <block id=\\\"current\\\" type=\\\"sensing_current\\\"/>\\n        <block type=\\\"sensing_dayssince2000\\\"/>\\n        \").concat(blockSeparator, \"\\n        <block type=\\\"sensing_username\\\"/>\\n        \").concat(categorySeparator, \"\\n    </category>\\n    \");\n};\nvar operators = function operators(isInitialSetup) {\n  var apple = scratch_blocks__WEBPACK_IMPORTED_MODULE_0___default.a.ScratchMsgs.translate('OPERATORS_JOIN_APPLE', 'apple');\n  var banana = scratch_blocks__WEBPACK_IMPORTED_MODULE_0___default.a.ScratchMsgs.translate('OPERATORS_JOIN_BANANA', 'banana');\n  var letter = scratch_blocks__WEBPACK_IMPORTED_MODULE_0___default.a.ScratchMsgs.translate('OPERATORS_LETTEROF_APPLE', 'a');\n  return \"\\n    <category name=\\\"%{BKY_CATEGORY_OPERATORS}\\\" id=\\\"operators\\\" colour=\\\"#40BF4A\\\" secondaryColour=\\\"#389438\\\">\\n        <block type=\\\"operator_add\\\">\\n            <value name=\\\"NUM1\\\">\\n                <shadow type=\\\"math_number\\\">\\n                    <field name=\\\"NUM\\\"/>\\n                </shadow>\\n            </value>\\n            <value name=\\\"NUM2\\\">\\n                <shadow type=\\\"math_number\\\">\\n                    <field name=\\\"NUM\\\"/>\\n                </shadow>\\n            </value>\\n        </block>\\n        <block type=\\\"operator_subtract\\\">\\n            <value name=\\\"NUM1\\\">\\n                <shadow type=\\\"math_number\\\">\\n                    <field name=\\\"NUM\\\"/>\\n                </shadow>\\n            </value>\\n            <value name=\\\"NUM2\\\">\\n                <shadow type=\\\"math_number\\\">\\n                    <field name=\\\"NUM\\\"/>\\n                </shadow>\\n            </value>\\n        </block>\\n        <block type=\\\"operator_multiply\\\">\\n            <value name=\\\"NUM1\\\">\\n                <shadow type=\\\"math_number\\\">\\n                    <field name=\\\"NUM\\\"/>\\n                </shadow>\\n            </value>\\n            <value name=\\\"NUM2\\\">\\n                <shadow type=\\\"math_number\\\">\\n                    <field name=\\\"NUM\\\"/>\\n                </shadow>\\n            </value>\\n        </block>\\n        <block type=\\\"operator_divide\\\">\\n            <value name=\\\"NUM1\\\">\\n                <shadow type=\\\"math_number\\\">\\n                    <field name=\\\"NUM\\\"/>\\n                </shadow>\\n            </value>\\n            <value name=\\\"NUM2\\\">\\n                <shadow type=\\\"math_number\\\">\\n                    <field name=\\\"NUM\\\"/>\\n                </shadow>\\n            </value>\\n        </block>\\n        \".concat(blockSeparator, \"\\n        <block type=\\\"operator_random\\\">\\n            <value name=\\\"FROM\\\">\\n                <shadow type=\\\"math_number\\\">\\n                    <field name=\\\"NUM\\\">1</field>\\n                </shadow>\\n            </value>\\n            <value name=\\\"TO\\\">\\n                <shadow type=\\\"math_number\\\">\\n                    <field name=\\\"NUM\\\">10</field>\\n                </shadow>\\n            </value>\\n        </block>\\n        \").concat(blockSeparator, \"\\n        <block type=\\\"operator_gt\\\">\\n            <value name=\\\"OPERAND1\\\">\\n                <shadow type=\\\"text\\\">\\n                    <field name=\\\"TEXT\\\"/>\\n                </shadow>\\n            </value>\\n            <value name=\\\"OPERAND2\\\">\\n                <shadow type=\\\"text\\\">\\n                    <field name=\\\"TEXT\\\">50</field>\\n                </shadow>\\n            </value>\\n        </block>\\n        <block type=\\\"operator_lt\\\">\\n            <value name=\\\"OPERAND1\\\">\\n                <shadow type=\\\"text\\\">\\n                    <field name=\\\"TEXT\\\"/>\\n                </shadow>\\n            </value>\\n            <value name=\\\"OPERAND2\\\">\\n                <shadow type=\\\"text\\\">\\n                    <field name=\\\"TEXT\\\">50</field>\\n                </shadow>\\n            </value>\\n        </block>\\n        <block type=\\\"operator_equals\\\">\\n            <value name=\\\"OPERAND1\\\">\\n                <shadow type=\\\"text\\\">\\n                    <field name=\\\"TEXT\\\"/>\\n                </shadow>\\n            </value>\\n            <value name=\\\"OPERAND2\\\">\\n                <shadow type=\\\"text\\\">\\n                    <field name=\\\"TEXT\\\">50</field>\\n                </shadow>\\n            </value>\\n        </block>\\n        \").concat(blockSeparator, \"\\n        <block type=\\\"operator_and\\\"/>\\n        <block type=\\\"operator_or\\\"/>\\n        <block type=\\\"operator_not\\\"/>\\n        \").concat(blockSeparator, \"\\n        \").concat(isInitialSetup ? '' : \"\\n            <block type=\\\"operator_join\\\">\\n                <value name=\\\"STRING1\\\">\\n                    <shadow type=\\\"text\\\">\\n                        <field name=\\\"TEXT\\\">\".concat(apple, \" </field>\\n                    </shadow>\\n                </value>\\n                <value name=\\\"STRING2\\\">\\n                    <shadow type=\\\"text\\\">\\n                        <field name=\\\"TEXT\\\">\").concat(banana, \"</field>\\n                    </shadow>\\n                </value>\\n            </block>\\n            <block type=\\\"operator_letter_of\\\">\\n                <value name=\\\"LETTER\\\">\\n                    <shadow type=\\\"math_whole_number\\\">\\n                        <field name=\\\"NUM\\\">1</field>\\n                    </shadow>\\n                </value>\\n                <value name=\\\"STRING\\\">\\n                    <shadow type=\\\"text\\\">\\n                        <field name=\\\"TEXT\\\">\").concat(apple, \"</field>\\n                    </shadow>\\n                </value>\\n            </block>\\n            <block type=\\\"operator_length\\\">\\n                <value name=\\\"STRING\\\">\\n                    <shadow type=\\\"text\\\">\\n                        <field name=\\\"TEXT\\\">\").concat(apple, \"</field>\\n                    </shadow>\\n                </value>\\n            </block>\\n            <block type=\\\"operator_contains\\\" id=\\\"operator_contains\\\">\\n              <value name=\\\"STRING1\\\">\\n                <shadow type=\\\"text\\\">\\n                  <field name=\\\"TEXT\\\">\").concat(apple, \"</field>\\n                </shadow>\\n              </value>\\n              <value name=\\\"STRING2\\\">\\n                <shadow type=\\\"text\\\">\\n                  <field name=\\\"TEXT\\\">\").concat(letter, \"</field>\\n                </shadow>\\n              </value>\\n            </block>\\n        \"), \"\\n        \").concat(blockSeparator, \"\\n        <block type=\\\"operator_mod\\\">\\n            <value name=\\\"NUM1\\\">\\n                <shadow type=\\\"math_number\\\">\\n                    <field name=\\\"NUM\\\"/>\\n                </shadow>\\n            </value>\\n            <value name=\\\"NUM2\\\">\\n                <shadow type=\\\"math_number\\\">\\n                    <field name=\\\"NUM\\\"/>\\n                </shadow>\\n            </value>\\n        </block>\\n        <block type=\\\"operator_round\\\">\\n            <value name=\\\"NUM\\\">\\n                <shadow type=\\\"math_number\\\">\\n                    <field name=\\\"NUM\\\"/>\\n                </shadow>\\n            </value>\\n        </block>\\n        \").concat(blockSeparator, \"\\n        <block type=\\\"operator_mathop\\\">\\n            <value name=\\\"NUM\\\">\\n                <shadow type=\\\"math_number\\\">\\n                    <field name=\\\"NUM\\\"/>\\n                </shadow>\\n            </value>\\n        </block>\\n        \").concat(categorySeparator, \"\\n    </category>\\n    \");\n};\nvar variables = function variables() {\n  return \"\\n    <category\\n        name=\\\"%{BKY_CATEGORY_VARIABLES}\\\"\\n        id=\\\"variables\\\"\\n        colour=\\\"#FF8C1A\\\"\\n        secondaryColour=\\\"#DB6E00\\\"\\n        custom=\\\"VARIABLE\\\">\\n    </category>\\n    \";\n};\nvar myBlocks = function myBlocks() {\n  return \"\\n    <category\\n        name=\\\"%{BKY_CATEGORY_MYBLOCKS}\\\"\\n        id=\\\"myBlocks\\\"\\n        colour=\\\"#FF6680\\\"\\n        secondaryColour=\\\"#FF4D6A\\\"\\n        custom=\\\"PROCEDURE\\\">\\n    </category>\\n    \";\n};\n/* eslint-enable no-unused-vars */\nvar xmlOpen = '<xml style=\"display: none\">';\nvar xmlClose = '</xml>';\n/**\n * @param {!boolean} isInitialSetup - Whether the toolbox is for initial setup. If the mode is \"initial setup\",\n * blocks with localized default parameters (e.g. ask and wait) should not be loaded. (LLK/scratch-gui#5445)\n * @param {?boolean} isStage - Whether the toolbox is for a stage-type target. This is always set to true\n * when isInitialSetup is true.\n * @param {?string} targetId - The current editing target\n * @param {?Array.<object>} categoriesXML - optional array of `{id,xml}` for categories. This can include both core\n * and other extensions: core extensions will be placed in the normal Scratch order; others will go at the bottom.\n * @property {string} id - the extension / category ID.\n * @property {string} xml - the `<category>...</category>` XML for this extension / category.\n * @param {?string} costumeName - The name of the default selected costume dropdown.\n * @param {?string} backdropName - The name of the default selected backdrop dropdown.\n * @param {?string} soundName -  The name of the default selected sound dropdown.\n * @returns {string} - a ScratchBlocks-style XML document for the contents of the toolbox.\n */\nvar makeToolboxXML = function makeToolboxXML(isInitialSetup) {\n  var isStage = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;\n  var targetId = arguments.length > 2 ? arguments[2] : undefined;\n  var categoriesXML = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];\n  var costumeName = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : '';\n  var backdropName = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : '';\n  var soundName = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : '';\n  isStage = isInitialSetup || isStage;\n  var gap = [categorySeparator];\n  costumeName = xmlEscape(costumeName);\n  backdropName = xmlEscape(backdropName);\n  soundName = xmlEscape(soundName);\n  categoriesXML = categoriesXML.slice();\n  var moveCategory = function moveCategory(categoryId) {\n    var index = categoriesXML.findIndex(function (categoryInfo) {\n      return categoryInfo.id === categoryId;\n    });\n    if (index >= 0) {\n      // remove the category from categoriesXML and return its XML\n      var _categoriesXML$splice = categoriesXML.splice(index, 1),\n          _categoriesXML$splice2 = _slicedToArray(_categoriesXML$splice, 1),\n          categoryInfo = _categoriesXML$splice2[0];\n      return categoryInfo.xml;\n    } // return `undefined`\n  };\n  var motionXML = moveCategory('motion') || motion(isInitialSetup, isStage, targetId);\n  var looksXML = moveCategory('looks') || looks(isInitialSetup, isStage, targetId, costumeName, backdropName);\n  var soundXML = moveCategory('sound') || sound(isInitialSetup, isStage, targetId, soundName);\n  var eventsXML = moveCategory('event') || events(isInitialSetup, isStage, targetId);\n  var controlXML = moveCategory('control') || control(isInitialSetup, isStage, targetId);\n  var sensingXML = moveCategory('sensing') || sensing(isInitialSetup, isStage, targetId);\n  var operatorsXML = moveCategory('operators') || operators(isInitialSetup, isStage, targetId);\n  var variablesXML = moveCategory('data') || variables(isInitialSetup, isStage, targetId);\n  var myBlocksXML = moveCategory('procedures') || myBlocks(isInitialSetup, isStage, targetId);\n  var everything = [xmlOpen, motionXML, gap, looksXML, gap, soundXML, gap, eventsXML, gap, controlXML, gap, sensingXML, gap, operatorsXML, gap, variablesXML, gap, myBlocksXML];\n  var _iterator = _createForOfIteratorHelper(categoriesXML),\n      _step;\n  try {\n    for (_iterator.s(); !(_step = _iterator.n()).done;) {\n      var extensionCategory = _step.value;\n      everything.push(gap, extensionCategory.xml);\n    }\n  } catch (err) {\n    _iterator.e(err);\n  } finally {\n    _iterator.f();\n  }\n  everything.push(xmlClose);\n  return everything.join('\\n');\n};\n/* harmony default export */ __webpack_exports__[\"a\"] = (makeToolboxXML);\n })