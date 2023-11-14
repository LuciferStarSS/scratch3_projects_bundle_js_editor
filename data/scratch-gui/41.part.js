/* 41 */\n (function(module, __webpack_exports__, __webpack_require__) {\n\"use strict\";\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"g\", function() { return reducer; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"l\", function() { return initialState; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"m\", function() { return openAccountMenu; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"b\", function() { return closeAccountMenu; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"a\", function() { return accountMenuOpen; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"o\", function() { return openFileMenu; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"d\", function() { return closeFileMenu; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"i\", function() { return fileMenuOpen; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"n\", function() { return openEditMenu; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"c\", function() { return closeEditMenu; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"h\", function() { return editMenuOpen; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"p\", function() { return openLanguageMenu; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"e\", function() { return closeLanguageMenu; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"j\", function() { return languageMenuOpen; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"q\", function() { return openLoginMenu; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"f\", function() { return closeLoginMenu; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"k\", function() { return loginMenuOpen; });\nvar _initialState;\nfunction _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }\nvar OPEN_MENU = 'scratch-gui/menus/OPEN_MENU';\nvar CLOSE_MENU = 'scratch-gui/menus/CLOSE_MENU';\nvar MENU_ACCOUNT = 'accountMenu';\nvar MENU_FILE = 'fileMenu';\nvar MENU_EDIT = 'editMenu';\nvar MENU_LANGUAGE = 'languageMenu';\nvar MENU_LOGIN = 'loginMenu';\nvar initialState = (_initialState = {}, _defineProperty(_initialState, MENU_ACCOUNT, false), _defineProperty(_initialState, MENU_FILE, false), _defineProperty(_initialState, MENU_EDIT, false), _defineProperty(_initialState, MENU_LANGUAGE, false), _defineProperty(_initialState, MENU_LOGIN, false), _initialState);\nvar reducer = function reducer(state, action) {\n  if (typeof state === 'undefined') state = initialState;\n  switch (action.type) {\n    case OPEN_MENU:\n      return Object.assign({}, state, _defineProperty({}, action.menu, true));\n    case CLOSE_MENU:\n      return Object.assign({}, state, _defineProperty({}, action.menu, false));\n    default:\n      return state;\n  }\n};\nvar openMenu = function openMenu(menu) {\n  return {\n    type: OPEN_MENU,\n    menu: menu\n  };\n};\nvar closeMenu = function closeMenu(menu) {\n  return {\n    type: CLOSE_MENU,\n    menu: menu\n  };\n};\nvar openAccountMenu = function openAccountMenu() {\n  return openMenu(MENU_ACCOUNT);\n};\nvar closeAccountMenu = function closeAccountMenu() {\n  return closeMenu(MENU_ACCOUNT);\n};\nvar accountMenuOpen = function accountMenuOpen(state) {\n  return state.scratchGui.menus[MENU_ACCOUNT];\n};\nvar openFileMenu = function openFileMenu() {\n  return openMenu(MENU_FILE);\n};\nvar closeFileMenu = function closeFileMenu() {\n  return closeMenu(MENU_FILE);\n};\nvar fileMenuOpen = function fileMenuOpen(state) {\n  return state.scratchGui.menus[MENU_FILE];\n};\nvar openEditMenu = function openEditMenu() {\n  return openMenu(MENU_EDIT);\n};\nvar closeEditMenu = function closeEditMenu() {\n  return closeMenu(MENU_EDIT);\n};\nvar editMenuOpen = function editMenuOpen(state) {\n  return state.scratchGui.menus[MENU_EDIT];\n};\nvar openLanguageMenu = function openLanguageMenu() {\n  return openMenu(MENU_LANGUAGE);\n};\nvar closeLanguageMenu = function closeLanguageMenu() {\n  return closeMenu(MENU_LANGUAGE);\n};\nvar languageMenuOpen = function languageMenuOpen(state) {\n  return state.scratchGui.menus[MENU_LANGUAGE];\n};\nvar openLoginMenu = function openLoginMenu() {\n  return openMenu(MENU_LOGIN);\n};\nvar closeLoginMenu = function closeLoginMenu() {\n  return closeMenu(MENU_LOGIN);\n};\nvar loginMenuOpen = function loginMenuOpen(state) {\n  return state.scratchGui.menus[MENU_LOGIN];\n};\n })