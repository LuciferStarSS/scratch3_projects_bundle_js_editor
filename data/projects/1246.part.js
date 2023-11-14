/* 1246 */
 (function(module, exports, __webpack_require__) {
"use strict";
eval("\nvar window = __webpack_require__(766)\nvar isFunction = __webpack_require__(770)\nvar parseHeaders = __webpack_require__(804)\nvar xtend = __webpack_require__(833)\nmodule.exports = createXHR\n// Allow use of default import syntax in TypeScript\nmodule.exports.default = createXHR;\ncreateXHR.XMLHttpRequest = window.XMLHttpRequest || noop\ncreateXHR.XDomainRequest = \"withCredentials\" in (new createXHR.XMLHttpRequest()) ? createXHR.XMLHttpRequest : window.XDomainRequest\nforEachArray([\"get\", \"put\", \"post\", \"patch\", \"head\", \"delete\"], function(method) {\n    createXHR[method === \"delete\" ? \"del\" : method] = function(uri, options, callback) {\n        options = initParams(uri, options, callback)\n        options.method = method.toUpperCase()\n        return _createXHR(options)\n    }\n})\nfunction forEachArray(array, iterator) {\n    for (var i = 0; i < array.length; i++) {\n        iterator(array[i])\n    }\n}\nfunction isEmpty(obj){\n    for(var i in obj){\n        if(obj.hasOwnProperty(i)) return false\n    }\n    return true\n}\nfunction initParams(uri, options, callback) {\n    var params = uri\n    if (isFunction(options)) {\n        callback = options\n        if (typeof uri === \"string\") {\n            params = {uri:uri}\n        }\n    } else {\n        params = xtend(options, {uri: uri})\n    }\n    params.callback = callback\n    return params\n}\nfunction createXHR(uri, options, callback) {\n    options = initParams(uri, options, callback)\n    return _createXHR(options)\n}\nfunction _createXHR(options) {\n    if(typeof options.callback === \"undefined\"){\n        throw new Error(\"callback argument missing\")\n    }\n    var called = false\n    var callback = function cbOnce(err, response, body){\n        if(!called){\n            called = true\n            options.callback(err, response, body)\n        }\n    }\n    function readystatechange() {\n        if (xhr.readyState === 4) {\n            setTimeout(loadFunc, 0)\n        }\n    }\n    function getBody() {\n        // Chrome with requestType=blob throws errors arround when even testing access to responseText\n        var body = undefined\n        if (xhr.response) {\n            body = xhr.response\n        } else {\n            body = xhr.responseText || getXml(xhr)\n        }\n        if (isJson) {\n            try {\n                body = JSON.parse(body)\n            } catch (e) {}\n        }\n        return body\n    }\n    function errorFunc(evt) {\n        clearTimeout(timeoutTimer)\n        if(!(evt instanceof Error)){\n            evt = new Error(\"\" + (evt || \"Unknown XMLHttpRequest Error\") )\n        }\n        evt.statusCode = 0\n        return callback(evt, failureResponse)\n    }\n    // will load the data & process the response in a special response object\n    function loadFunc() {\n        if (aborted) return\n        var status\n        clearTimeout(timeoutTimer)\n        if(options.useXDR && xhr.status===undefined) {\n            //IE8 CORS GET successful response doesn't have a status field, but body is fine\n            status = 200\n        } else {\n            status = (xhr.status === 1223 ? 204 : xhr.status)\n        }\n        var response = failureResponse\n        var err = null\n        if (status !== 0){\n            response = {\n                body: getBody(),\n                statusCode: status,\n                method: method,\n                headers: {},\n                url: uri,\n                rawRequest: xhr\n            }\n            if(xhr.getAllResponseHeaders){ //remember xhr can in fact be XDR for CORS in IE\n                response.headers = parseHeaders(xhr.getAllResponseHeaders())\n            }\n        } else {\n            err = new Error(\"Internal XMLHttpRequest Error\")\n        }\n        return callback(err, response, response.body)\n    }\n    var xhr = options.xhr || null\n    if (!xhr) {\n        if (options.cors || options.useXDR) {\n            xhr = new createXHR.XDomainRequest()\n        }else{\n            xhr = new createXHR.XMLHttpRequest()\n        }\n    }\n    var key\n    var aborted\n    var uri = xhr.url = options.uri || options.url\n    var method = xhr.method = options.method || \"GET\"\n    var body = options.body || options.data\n    var headers = xhr.headers = options.headers || {}\n    var sync = !!options.sync\n    var isJson = false\n    var timeoutTimer\n    var failureResponse = {\n        body: undefined,\n        headers: {},\n        statusCode: 0,\n        method: method,\n        url: uri,\n        rawRequest: xhr\n    }\n    if (\"json\" in options && options.json !== false) {\n        isJson = true\n        headers[\"accept\"] || headers[\"Accept\"] || (headers[\"Accept\"] = \"application/json\") //Don't override existing accept header declared by user\n        if (method !== \"GET\" && method !== \"HEAD\") {\n            headers[\"content-type\"] || headers[\"Content-Type\"] || (headers[\"Content-Type\"] = \"application/json\") //Don't override existing accept header declared by user\n            body = JSON.stringify(options.json === true ? body : options.json)\n        }\n    }\n    xhr.onreadystatechange = readystatechange\n    xhr.onload = loadFunc\n    xhr.onerror = errorFunc\n    // IE9 must have onprogress be set to a unique function.\n    xhr.onprogress = function () {\n        // IE must die\n    }\n    xhr.onabort = function(){\n        aborted = true;\n    }\n    xhr.ontimeout = errorFunc\n    xhr.open(method, uri, !sync, options.username, options.password)\n    //has to be after open\n    if(!sync) {\n        xhr.withCredentials = !!options.withCredentials\n    }\n    // Cannot set timeout with sync request\n    // not setting timeout on the xhr object, because of old webkits etc. not handling that correctly\n    // both npm's request and jquery 1.x use this kind of timeout, so this is being consistent\n    if (!sync && options.timeout > 0 ) {\n        timeoutTimer = setTimeout(function(){\n            if (aborted) return\n            aborted = true//IE9 may still call readystatechange\n            xhr.abort(\"timeout\")\n            var e = new Error(\"XMLHttpRequest timeout\")\n            e.code = \"ETIMEDOUT\"\n            errorFunc(e)\n        }, options.timeout )\n    }\n    if (xhr.setRequestHeader) {\n        for(key in headers){\n            if(headers.hasOwnProperty(key)){\n                xhr.setRequestHeader(key, headers[key])\n            }\n        }\n    } else if (options.headers && !isEmpty(options.headers)) {\n        throw new Error(\"Headers cannot be set on an XDomainRequest object\")\n    }\n    if (\"responseType\" in options) {\n        xhr.responseType = options.responseType\n    }\n    if (\"beforeSend\" in options &&\n        typeof options.beforeSend === \"function\"\n    ) {\n        options.beforeSend(xhr)\n    }\n    // Microsoft Edge browser sends \"undefined\" when send is called with undefined value.\n    // XMLHttpRequest spec says to pass null as body to indicate no body\n    // See https://github.com/naugtur/xhr/issues/100.\n    xhr.send(body || null)\n    return xhr\n}\nfunction getXml(xhr) {\n    // xhr.responseXML will throw Exception \"InvalidStateError\" or \"DOMException\"\n    // See https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseXML.\n    try {\n        if (xhr.responseType === \"document\") {\n            return xhr.responseXML\n        }\n        var firefoxBugTakenEffect = xhr.responseXML && xhr.responseXML.documentElement.nodeName === \"parsererror\"\n        if (xhr.responseType === \"\" && !firefoxBugTakenEffect) {\n            return xhr.responseXML\n        }\n    } catch (e) {}\n    return null\n}\nfunction noop() {}\n// ./~/nets/~/xhr/index.js\n// module id = 1246\n// module chunks = 0\n//# sourceURL=scratch:///./~/nets/~/xhr/index.js?");
 })