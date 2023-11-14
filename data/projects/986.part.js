/* 986 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return call && (typeof call === \"object\" || typeof call === \"function\") ? call : self; }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function, not \" + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }\n\nvar React = __webpack_require__(0);\nvar PropTypes = __webpack_require__(1);\nvar bindAll = __webpack_require__(9);\nvar classNames = __webpack_require__(5);\n\nvar FlexRow = __webpack_require__(12);\nvar Avatar = __webpack_require__(40);\nvar EmojiText = __webpack_require__(484);\nvar FormattedRelative = __webpack_require__(4).FormattedRelative;\nvar FormattedMessage = __webpack_require__(4).FormattedMessage;\nvar ComposeComment = __webpack_require__(755);\nvar DeleteCommentModal = __webpack_require__(918);\nvar ReportCommentModal = __webpack_require__(919);\nvar decorateText = __webpack_require__(754);\n\n__webpack_require__(746);\n\nvar Comment = function (_React$Component) {\n    _inherits(Comment, _React$Component);\n\n    function Comment(props) {\n        _classCallCheck(this, Comment);\n\n        var _this = _possibleConstructorReturn(this, (Comment.__proto__ || Object.getPrototypeOf(Comment)).call(this, props));\n\n        bindAll(_this, ['handleDelete', 'handleCancelDelete', 'handleConfirmDelete', 'handleReport', 'handleConfirmReport', 'handleCancelReport', 'handlePostReply', 'handleToggleReplying', 'handleRestore', 'setRef']);\n        _this.state = {\n            deleting: false,\n            reporting: false,\n            reportConfirmed: false,\n            replying: false\n        };\n        return _this;\n    }\n\n    _createClass(Comment, [{\n        key: 'componentDidMount',\n        value: function componentDidMount() {\n            if (this.props.highlighted) {\n                this.ref.scrollIntoView({ behavior: 'smooth' });\n            }\n        }\n    }, {\n        key: 'handlePostReply',\n        value: function handlePostReply(comment) {\n            this.setState({ replying: false });\n            this.props.onAddComment(comment);\n        }\n    }, {\n        key: 'handleToggleReplying',\n        value: function handleToggleReplying() {\n            this.setState({ replying: !this.state.replying });\n        }\n    }, {\n        key: 'handleDelete',\n        value: function handleDelete() {\n            if (this.props.canDeleteWithoutConfirm) {\n                this.props.onDelete(this.props.id);\n            } else {\n                this.setState({ deleting: true });\n            }\n        }\n    }, {\n        key: 'handleConfirmDelete',\n        value: function handleConfirmDelete() {\n            this.setState({ deleting: false });\n            this.props.onDelete(this.props.id);\n        }\n    }, {\n        key: 'handleCancelDelete',\n        value: function handleCancelDelete() {\n            this.setState({ deleting: false });\n        }\n    }, {\n        key: 'handleReport',\n        value: function handleReport() {\n            this.setState({ reporting: true });\n        }\n    }, {\n        key: 'handleRestore',\n        value: function handleRestore() {\n            this.props.onRestore(this.props.id);\n        }\n    }, {\n        key: 'handleConfirmReport',\n        value: function handleConfirmReport() {\n            this.setState({\n                reporting: false,\n                reportConfirmed: true,\n                deleting: false // To close delete modal if reported from delete modal\n            });\n\n            this.props.onReport(this.props.id);\n        }\n    }, {\n        key: 'handleCancelReport',\n        value: function handleCancelReport() {\n            this.setState({\n                reporting: false,\n                reportConfirmed: false\n            });\n        }\n    }, {\n        key: 'setRef',\n        value: function setRef(ref) {\n            this.ref = ref;\n        }\n    }, {\n        key: 'render',\n        value: function render() {\n            var _props = this.props,\n                author = _props.author,\n                canDelete = _props.canDelete,\n                canReply = _props.canReply,\n                canReport = _props.canReport,\n                canRestore = _props.canRestore,\n                content = _props.content,\n                datetimeCreated = _props.datetimeCreated,\n                highlighted = _props.highlighted,\n                id = _props.id,\n                parentId = _props.parentId,\n                projectId = _props.projectId,\n                replyUsername = _props.replyUsername,\n                visibility = _props.visibility;\n\n            // we allow comments that are fully visible, or markedByFilter (flagged by\n            // our bad words filter, but not at the critical level of offensiveness)\n\n            var markedByFilter = visibility === 'markedbyfilter';\n            var visible = markedByFilter || visibility === 'visible';\n\n            var commentText = content;\n            if (replyUsername) {\n                commentText = '@' + replyUsername + ' ' + commentText;\n            }\n            commentText = decorateText(commentText, {\n                scratchLinks: true,\n                usernames: true,\n                hashtags: false\n            });\n\n            return React.createElement(\n                'div',\n                {\n                    className: classNames('flex-row', 'comment', {\n                        'highlighted-comment': highlighted\n                    }),\n                    id: 'comments-' + id,\n                    ref: this.setRef\n                },\n                React.createElement(\n                    'a',\n                    { href: '/users/' + author.username },\n                    React.createElement(Avatar, { src: author.image })\n                ),\n                React.createElement(\n                    FlexRow,\n                    { className: 'comment-body column' },\n                    React.createElement(\n                        FlexRow,\n                        { className: 'comment-top-row' },\n                        React.createElement(\n                            'a',\n                            {\n                                className: 'username',\n                                href: '/users/' + author.username\n                            },\n                            author.username,\n                            author.scratchteam ? '*' : ''\n                        ),\n                        React.createElement(\n                            'div',\n                            { className: 'action-list' },\n                            visible ? React.createElement(\n                                React.Fragment,\n                                null,\n                                canDelete && React.createElement(\n                                    'span',\n                                    {\n                                        className: 'comment-delete',\n                                        onClick: this.handleDelete\n                                    },\n                                    React.createElement(FormattedMessage, { id: 'comments.delete' })\n                                ),\n                                canReport && React.createElement(\n                                    'span',\n                                    {\n                                        className: 'comment-report',\n                                        onClick: this.handleReport\n                                    },\n                                    React.createElement(FormattedMessage, { id: 'general.report' })\n                                )\n                            ) : React.createElement(\n                                React.Fragment,\n                                null,\n                                React.createElement(\n                                    'span',\n                                    { className: 'comment-visibility' },\n                                    React.createElement(FormattedMessage, { id: 'comments.status.' + visibility })\n                                ),\n                                canRestore && React.createElement(\n                                    'span',\n                                    {\n                                        className: 'comment-restore',\n                                        onClick: this.handleRestore\n                                    },\n                                    React.createElement(FormattedMessage, { id: 'comments.restore' })\n                                )\n                            )\n                        )\n                    ),\n                    React.createElement(\n                        'div',\n                        {\n                            className: classNames({\n                                'comment-bubble': true,\n                                'comment-bubble-markedbyfilter': markedByFilter,\n                                'comment-bubble-reported': !visible\n                            })\n                        },\n                        React.createElement(\n                            'span',\n                            { className: 'comment-content' },\n                            commentText.map(function (fragment, index) {\n                                if (typeof fragment === 'string') {\n                                    return React.createElement(EmojiText, {\n                                        as: 'span',\n                                        key: 'comments-' + id + '-fragment-' + index,\n                                        text: fragment\n                                    });\n                                }\n                                return fragment;\n                            })\n                        ),\n                        React.createElement(\n                            FlexRow,\n                            { className: 'comment-bottom-row' },\n                            React.createElement(\n                                'span',\n                                { className: 'comment-time' },\n                                React.createElement(FormattedRelative, { value: new Date(datetimeCreated) })\n                            ),\n                            canReply && visible ? React.createElement(\n                                'span',\n                                {\n                                    className: 'comment-reply',\n                                    onClick: this.handleToggleReplying\n                                },\n                                React.createElement(FormattedMessage, { id: 'comments.reply' })\n                            ) : null\n                        )\n                    ),\n                    this.state.replying ? React.createElement(\n                        FlexRow,\n                        { className: 'comment-reply-row' },\n                        React.createElement(ComposeComment, {\n                            commenteeId: author.id,\n                            parentId: parentId || id,\n                            projectId: projectId,\n                            onAddComment: this.handlePostReply,\n                            onCancel: this.handleToggleReplying\n                        })\n                    ) : null\n                ),\n                this.state.deleting ? React.createElement(DeleteCommentModal, {\n                    isOpen: true,\n                    key: 'delete-comment-modal',\n                    onDelete: this.handleConfirmDelete,\n                    onReport: this.handleConfirmReport,\n                    onRequestClose: this.handleCancelDelete\n                }) : null,\n                this.state.reporting || this.state.reportConfirmed ? React.createElement(ReportCommentModal, {\n                    isOpen: true,\n                    isConfirmed: this.state.reportConfirmed,\n                    key: 'report-comment-modal',\n                    onReport: this.handleConfirmReport,\n                    onRequestClose: this.handleCancelReport\n                }) : null\n            );\n        }\n    }]);\n\n    return Comment;\n}(React.Component);\n\nComment.propTypes = {\n    author: PropTypes.shape({\n        id: PropTypes.number,\n        image: PropTypes.string,\n        scratchteam: PropTypes.bool,\n        username: PropTypes.string\n    }),\n    canDelete: PropTypes.bool,\n    canDeleteWithoutConfirm: PropTypes.bool,\n    canReply: PropTypes.bool,\n    canReport: PropTypes.bool,\n    canRestore: PropTypes.bool,\n    content: PropTypes.string,\n    datetimeCreated: PropTypes.string,\n    highlighted: PropTypes.bool,\n    id: PropTypes.number,\n    onAddComment: PropTypes.func,\n    onDelete: PropTypes.func,\n    onReport: PropTypes.func,\n    onRestore: PropTypes.func,\n    parentId: PropTypes.number,\n    projectId: PropTypes.string,\n    replyUsername: PropTypes.string,\n    visibility: PropTypes.string\n};\n\nmodule.exports = Comment;\n\n//////////////////\n// WEBPACK FOOTER\n// ./src/views/preview/comment/comment.jsx\n// module id = 986\n// module chunks = 0\n\n//# sourceURL=scratch:///./src/views/preview/comment/comment.jsx?");

/***/ })