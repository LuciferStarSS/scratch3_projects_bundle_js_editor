/* 199 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar classNames = __webpack_require__(5);\nvar PropTypes = __webpack_require__(1);\nvar React = __webpack_require__(0);\n\n__webpack_require__(246);\n\nvar Thumbnail = function Thumbnail(props) {\n    var extra = [];\n    var info = [];\n\n    if (props.loves && props.showLoves) {\n        extra.push(React.createElement(\n            'div',\n            {\n                className: 'thumbnail-loves',\n                key: 'loves',\n                title: props.loves + ' loves'\n            },\n            props.loves\n        ));\n    }\n    if (props.favorites && props.showFavorites) {\n        extra.push(React.createElement(\n            'div',\n            {\n                className: 'thumbnail-favorites',\n                key: 'favorites',\n                title: props.favorites + ' favorites'\n            },\n            props.favorites\n        ));\n    }\n    if (props.remixes && props.showRemixes) {\n        extra.push(React.createElement(\n            'div',\n            {\n                className: 'thumbnail-remixes',\n                key: 'remixes',\n                title: props.remixes + ' remixes'\n            },\n            props.remixes\n        ));\n    }\n    if (props.views && props.showViews) {\n        extra.push(React.createElement(\n            'div',\n            {\n                className: 'thumbnail-views',\n                key: 'views',\n                title: props.views + ' views'\n            },\n            props.views\n        ));\n    }\n\n    var imgElement = void 0;\n    var titleElement = void 0;\n    var avatarElement = void 0;\n\n    if (props.linkTitle) {\n        imgElement = React.createElement(\n            'a',\n            {\n                className: 'thumbnail-image',\n                href: props.href,\n                key: 'imgElement'\n            },\n            React.createElement('img', {\n                alt: props.alt,\n                src: props.src\n            })\n        );\n        titleElement = React.createElement(\n            'a',\n            {\n                href: props.href,\n                key: 'titleElement',\n                title: props.title\n            },\n            props.title\n        );\n    } else {\n        imgElement = React.createElement('img', { src: props.src });\n        titleElement = props.title;\n    }\n\n    info.push(titleElement);\n\n    if (props.creator) {\n        info.push(React.createElement(\n            'div',\n            {\n                className: 'thumbnail-creator',\n                key: 'creator'\n            },\n            React.createElement(\n                'a',\n                { href: '/users/' + props.creator + '/' },\n                props.creator\n            )\n        ));\n    }\n\n    if (props.avatar && props.showAvatar) {\n        avatarElement = React.createElement(\n            'a',\n            {\n                className: 'creator-image',\n                href: '/users/' + props.creator + '/'\n            },\n            React.createElement('img', {\n                alt: props.creator,\n                src: props.avatar\n            })\n        );\n    }\n    return React.createElement(\n        'div',\n        {\n            className: classNames('thumbnail', props.type, props.className)\n        },\n        imgElement,\n        React.createElement(\n            'div',\n            { className: 'thumbnail-info' },\n            avatarElement,\n            React.createElement(\n                'div',\n                { className: 'thumbnail-title' },\n                info\n            )\n        ),\n        extra\n    );\n};\n\nThumbnail.propTypes = {\n    alt: PropTypes.string,\n    avatar: PropTypes.string,\n    className: PropTypes.string,\n    creator: PropTypes.string,\n    favorites: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),\n    href: PropTypes.string,\n    linkTitle: PropTypes.bool,\n    loves: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),\n    remixes: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),\n    showAvatar: PropTypes.bool,\n    showFavorites: PropTypes.bool,\n    showLoves: PropTypes.bool,\n    showRemixes: PropTypes.bool,\n    showViews: PropTypes.bool,\n    src: PropTypes.string,\n    title: PropTypes.string,\n    type: PropTypes.string,\n    views: PropTypes.oneOfType([PropTypes.number, PropTypes.string])\n};\n\nThumbnail.defaultProps = {\n    alt: '',\n    avatar: '',\n    href: '#',\n    linkTitle: true,\n    showAvatar: false,\n    showFavorites: false,\n    showLoves: false,\n    showRemixes: false,\n    showViews: false,\n    src: '',\n    title: 'Project',\n    type: 'project'\n};\n\nmodule.exports = Thumbnail;\n\n//////////////////\n// WEBPACK FOOTER\n// ./src/components/thumbnail/thumbnail.jsx\n// module id = 199\n// module chunks = 0 7 9 10 11 19 20\n\n//# sourceURL=scratch:///./src/components/thumbnail/thumbnail.jsx?");

/***/ })