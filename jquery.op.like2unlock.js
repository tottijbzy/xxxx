/**
* Preset resources for Like 2 Unlock
* for jQuery: http://onepress-media.com/plugin/like-2-unlock-for-facebook/get
* for Wordpress: http://onepress-media.com/plugin/like-2-unlock-for-facebook-wordpress/get
*
* Copyright 2012, OnePress, http://onepress-media.com/portfolio
* Help Desk: http://support.onepress-media.com/
*/

(function ($) {

    if (!$.onepress) $.onepress = {};
    if (!$.onepress.lang) $.onepress.lang = {};

    $.onepress.lang.tolike = {

        defaultMessage: 'This content is locked. Please like us to view the hidden content.',
        loginMessage: 'You must sign in with Facebook to unlock.',   
        orWait: 'or wait',
        close: 'Close'
    };
})(jQuery);;;

/**
* Helper Tools:
* - cookies getter/setter
* - md5 hasher
* - html logger
* - lightweight widget factory
* - mobile detector
*
* Copyright 2012, OnePress, http://onepress-media.com/portfolio
* Help Desk: http://support.onepress-media.com/
*/

(function ($) {
    'use strict';

    if (!$.onepress) $.onepress = {};
    if (!$.onepress.tools) $.onepress.tools = {};

    /*
    * Cookie's function.
    * Allows to set or get cookie.
    *
    * Based on the plugin jQuery Cookie Plugin
    * https://github.com/carhartl/jquery-cookie
    *
    * Copyright 2011, Klaus Hartl
    * Dual licensed under the MIT or GPL Version 2 licenses.
    * http://www.opensource.org/licenses/mit-license.php
    * http://www.opensource.org/licenses/GPL-2.0
    */
    $.onepress.tools.cookie = $.onepress.tools.cookie || function (key, value, options) {

        // Sets cookie
        if (arguments.length > 1 && (!/Object/.test(Object.prototype.toString.call(value)) || value === null || value === undefined)) {
            options = $.extend({}, options);

            if (value === null || value === undefined) {
                options.expires = -1;
            }

            if (typeof options.expires === 'number') {
                var days = options.expires, t = options.expires = new Date();
                t.setDate(t.getDate() + days);
            }

            value = String(value);

            return (document.cookie = [
                encodeURIComponent(key), '=', options.raw ? value : encodeURIComponent(value),
                options.expires ? '; expires=' + options.expires.toUTCString() : '',
                options.path ? '; path=' + options.path : '',
                options.domain ? '; domain=' + options.domain : '',
                options.secure ? '; secure' : ''
            ].join(''));
        }

        // Gets cookie.
        options = value || {};
        var decode = options.raw ? function (s) { return s; } : decodeURIComponent;

        var pairs = document.cookie.split('; ');
        for (var i = 0, pair; pair = pairs[i] && pairs[i].split('='); i++) {
            if (decode(pair[0]) === key) return decode(pair[1] || '');
        }
        return null;
    };

    /*
    * jQuery MD5 Plugin 1.2.1
    * https://github.com/blueimp/jQuery-MD5
    *
    * Copyright 2010, Sebastian Tschan
    * https://blueimp.net
    *
    * Licensed under the MIT license:
    * http://creativecommons.org/licenses/MIT/
    * 
    * Based on
    * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
    * Digest Algorithm, as defined in RFC 1321.
    * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
    * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
    * Distributed under the BSD License
    * See http://pajhome.org.uk/crypt/md5 for more info.
    */
    $.onepress.tools.hash = $.onepress.tools.hash || function (str) {

        var hash = 0;
        if (str.length == 0) return hash;
        for (var i = 0; i < str.length; i++) {
            var charCode = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + charCode;
            hash = hash & hash;
        }
        hash = hash.toString(16);
        hash = hash.replace("-", "0");

        return hash;
    };

    /**
    * A logger class allowing to print formatted messages into html directly.
    * Copyright 2012, OnePress, http://onepress-media.com/portfolio
    */
    $.onepress.logger = function ($elem) {

        // save element and applies some styles
        this.element = $elem;
        this.element.css({
            display: 'block',
            boxSizing: 'border-box',
            width: '100%',
            padding: '20px',
            marginTop: '20px',
            marginBottom: '20px',
            backgroundColor: 'black',
            color: 'white',
            font: 'normal normal 12px/14px Arial, serif'
        });

        // logger colors
        this._colors = {
            debug: '#bbbbbb',
            info: "#ffffff",
            warn: "#fbec5d",
            error: "#de3163",
            fatal: '#ff0000'
        };

        this._log = function (level, message, deep) {
            var color = this._colors[level];
            var time = this._getTime();

            var rowElem = $('<div style="overflow: hidden; padding-bottom: 8px;"></div>');

            $("<div style='width: 65px; float: left; color: " + color + "'>" + time + "</div>").appendTo(rowElem);
            $("<div style='width: 58px; float: left; color: " + color + "'>[" + level + "]</div>").appendTo(rowElem);

            if (typeof message === 'string') {
                $("<div style='margin-left: 123px; color: " + color + "'>" + message + "</div>").appendTo(rowElem);
            } else {
                $("<div style='margin-left: 123px; color: " + color + "'>" + this._displayProperties(message, deep) + "</div>").appendTo(rowElem);
            }

            rowElem.appendTo(this.element);
        };

        this.debug = function (message, deep) {
            this._log('debug', message, deep);
        };

        this.info = function (message, deep) {
            this._log('info', message, deep);
        };

        this.warn = function (message, deep) {
            this._log('warn', message, deep);
        };

        this.error = function (message, deep) {
            this._log('error', message, deep);
        };

        this.fatal = function (message, deep) {
            this._log('fatal', message, deep);
        };

        this._getTime = function () {
            var dd = new Date();
            var hh = dd.getHours();
            var mm = dd.getMinutes();
            var ss = dd.getSeconds();
            return (hh + ":" + mm + ":" + ss);
        };

        this._displayProperties = function (object, maxDeep, deep, prefix) {
            var text = "";
            var counter = 0;

            if (!prefix) prefix = "";
            if (!deep) deep = 0;

            for (var property in object) {
                counter++;
                text += prefix + "[" + counter + "] " + property + " = " + object[property] + "<br />";
                if (maxDeep != 0 && deep <= maxDeep && typeof (object[property]) == "object") text += this._displayProperties(object[property], maxDeep, deep + 1, prefix + "&nbsp;&nbsp;");
                if (counter >= 80) break;
            }
            return text;
        };
    },

    /**
    * OnePress Widget Factory.
    * Supports:
    * - creating a jquery widget via the standart jquery way
    * - call of public methods.
    */
    $.onepress.widget = function (pluginName, pluginObject) {

        var factory = {

            createWidget: function (element, options) {
                var widget = $.extend(true, {}, pluginObject);

                widget.element = $(element);
                widget.options = $.extend(true, widget.options, options);

                if (widget._init) widget._init();
                if (widget._create) widget._create();

                $.data(element, 'plugin_' + pluginName, widget);
            },

            callMethod: function (widget, methodName) {
                widget[methodName] && widget[methodName]();
            }
        };

        $.fn[pluginName] = function () {
            var args = arguments;
            var argsCount = arguments.length;

            this.each(function () {

                var widget = $.data(this, 'plugin_' + pluginName);

                // a widget is not created yet
                if (!widget && argsCount <= 1) {
                    factory.createWidget(this, argsCount ? args[0] : false);

                    // a widget is created, the public method with no args is being called
                } else if (argsCount == 1) {
                    factory.callMethod(widget, args[0]);
                }
            });

            return this;
        };
    };

    /**
    * Mobile detector
    * http://stackoverflow.com/questions/3514784/best-way-to-detect-handheld-device-in-jquery
    */
    $.onepress.isMobile = function () {
        return (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent));
    };
    
    /**
     * Adds a parameter to URL
     * http://stackoverflow.com/questions/7640270/adding-modify-query-string-get-variables-in-a-url-with-javascript
     */
    $.onepress.addParamToUrl = function (url, param, value) {
        
        // Using a positive lookahead (?=\=) to find the
        // given parameter, preceded by a ? or &, and followed
        // by a = with a value after than (using a non-greedy selector)
        // and then followed by a & or the end of the string
        var val = new RegExp('(\\?|\\&)' + param + '=.*?(?=(&|$))'),
            qstring = /\?.+$/;

        // Check if the parameter exists
        if (val.test(url))
        {
            // if it does, replace it, using the captured group
            // to determine & or ? at the beginning
            return url.replace(val, '$1' + param + '=' + value);
        }
        else if (qstring.test(url))
        {
            // otherwise, if there is a query string at all
            // add the param to the end of it
            return url + '&' + param + '=' + value;
        }
        else
        {
            // if there's no query string, add one
            return url + '?' + param + '=' + value;
        }
    };
    
    $.onepress.getParamsFromUrl = function(url) {
        var vars = {};
        var parts = url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
            vars[key] = value;
        });
        return vars;
    }
    
    

})(jQuery);;;

/*!
 * URL.js
 *
 * Copyright 2011 Eric Ferraiuolo
 * https://github.com/ericf/urljs
 */

/**
 * URL constructor and utility.
 * Provides support for validating whether something is a URL,
 * formats and cleans up URL-like inputs into something nice and pretty,
 * ability to resolve one URL against another and returned the formatted result,
 * and is a convenient API for working with URL Objects and the various parts of URLs.
 *
 * @constructor URL
 * @param       {String | URL}  url - the URL String to parse or URL instance to copy
 * @return      {URL}           url - instance of a URL all nice and parsed
 */
var URL = function () {

    var u = this;

    if ( ! (u && u.hasOwnProperty && (u instanceof URL))) {
        u = new URL();
    }

    return u._init.apply(u, arguments);
};

(function(){

var ABSOLUTE            = 'absolute',
    RELATIVE            = 'relative',

    HTTP                = 'http',
    HTTPS               = 'https',
    COLON               = ':',
    SLASH_SLASH         = '//',
    AT                  = '@',
    DOT                 = '.',
    SLASH               = '/',
    DOT_DOT             = '..',
    DOT_DOT_SLASH       = '../',
    QUESTION            = '?',
    EQUALS              = '=',
    AMP                 = '&',
    HASH                = '#',
    EMPTY_STRING        = '',

    TYPE                = 'type',
    SCHEME              = 'scheme',
    USER_INFO           = 'userInfo',
    HOST                = 'host',
    PORT                = 'port',
    PATH                = 'path',
    QUERY               = 'query',
    FRAGMENT            = 'fragment',

    URL_TYPE_REGEX      = /^(?:(https?:\/\/|\/\/)|(\/|\?|#)|[^;:@=\.\s])/i,
    URL_ABSOLUTE_REGEX  = /^(?:(https?):\/\/|\/\/)(?:([^:@\s]+:?[^:@\s]+?)@)?((?:[^;:@=\/\?\.\s]+\.)+[A-Za-z0-9\-]{2,})(?::(\d+))?(?=\/|\?|#|$)([^\?#]+)?(?:\?([^#]+))?(?:#(.+))?/i,
    URL_RELATIVE_REGEX  = /^([^\?#]+)?(?:\?([^#]+))?(?:#(.+))?/i,

    OBJECT              = 'object',
    STRING              = 'string',
    TRIM_REGEX          = /^\s+|\s+$/g,

    trim, isObject, isString;


// *** Utilities *** //

trim = String.prototype.trim ? function (s) {
    return ( s && s.trim ? s.trim() : s );
} : function (s) {
    try {
        return s.replace(TRIM_REGEX, EMPTY_STRING);
    } catch (e) { return s; }
};

isObject = function (o) {
    return ( o && typeof o === OBJECT );
};

isString = function (o) {
    return typeof o === STRING;
};


// *** Static *** //

/**
 *
 */
URL.ABSOLUTE = ABSOLUTE;

/**
 *
 */
URL.RELATIVE = RELATIVE;

/**
 *
 */
URL.normalize = function (url) {
    return new URL(url).toString();
};

/**
 * Returns a resolved URL String using the baseUrl to resolve the url against.
 * This attempts to resolve URLs like a browser would on a web page.
 *
 * @static
 * @method  resolve
 * @param   {String | URL}  baseUrl     - the URL String, or URL instance as the resolving base
 * @param   {String | URL}  url         - the URL String, or URL instance to resolve
 * @return  {String}        resolvedUrl - a resolved URL String
 */
URL.resolve = function (baseUrl, url) {
    return new URL(baseUrl).resolve(url).toString();
};


// *** Prototype *** //

URL.prototype = {

    // *** Lifecycle Methods *** //

    /**
     * Initializes a new URL instance, or re-initializes an existing one.
     * The URL constructor delegates to this method to do the initializing,
     * and the mutator instance methods call this to re-initialize when something changes.
     *
     * @protected
     * @method  _init
     * @param   {String | URL}  url - the URL String, or URL instance
     * @return  {URL}           url - instance of a URL all nice and parsed/re-parsed
     */
    _init : function (url) {

        this.constructor = URL;

        url = isString(url) ? url : url instanceof URL ? url.toString() : null;

        this._original  = url;
        this._url       = {};
        this._isValid   = this._parse(url);

        return this;
    },

    // *** Object Methods *** //

    /**
     * Returns the formatted URL String.
     * Overridden Object toString method to do something useful.
     *
     * @public
     * @method  toString
     * @return  {String}    url - formatted URL string
     */
    toString : function () {

        var url         = this._url,
            urlParts    = [],
            type        = url[TYPE],
            scheme      = url[SCHEME],
            path        = url[PATH],
            query       = url[QUERY],
            fragment    = url[FRAGMENT];

        if (type === ABSOLUTE) {
            urlParts.push(
                scheme ? (scheme + COLON + SLASH_SLASH) : SLASH_SLASH,
                this.authority()
            );
            if (path && path.indexOf(SLASH) !== 0) {    // this should maybe go in _set
                path = SLASH + path;
            }
        }

        urlParts.push(
            path,
            query ? (QUESTION + this.queryString()) : EMPTY_STRING,
            fragment ? (HASH + fragment) : EMPTY_STRING
        );

        return urlParts.join(EMPTY_STRING);
    },

    // *** Accessor/Mutator Methods *** //

    original : function () {
        return this._original;
    },

    /**
     * Whether parsing from initialization or re-initialization produced something valid.
     *
     * @public
     * @method  isValid
     * @return  {Boolean}   valid   - whether the URL is valid
     */
    isValid : function () {
        return this._isValid;
    },

    /**
     * URL is absolute if it has a scheme or is scheme-relative (//).
     *
     * @public
     * @method  isAbsolute
     * @return  {Boolean}   absolute    - whether the URL is absolute
     */
    isAbsolute : function () {
        return this._url[TYPE] === ABSOLUTE;
    },

    /**
     * URL is relative if it host or path relative, i.e. doesn't contain a host.
     *
     * @public
     * @method  isRelative
     * @return  {Boolean}   relative    - whether the URL is relative
     */
    isRelative : function () {
        return this._url[TYPE] === RELATIVE;
    },

    /**
     * URL is host relative if it's relative and the path begins with '/'.
     *
     * @public
     * @method  isHostRelative
     * @return  {Boolean}   hostRelative    - whether the URL is host-relative
     */
     isHostRelative : function () {
        var path = this._url[PATH];
        return ( this.isRelative() && path && path.indexOf(SLASH) === 0 );
     },

    /**
     * Returns the type of the URL, either: URL.ABSOLUTE or URL.RELATIVE.
     *
     * @public
     * @method  type
     * @return  {String}    type    - the type of the URL: URL.ABSOLUTE or URL.RELATIVE
     */
    type : function () {
        return this._url[TYPE];
    },

    /**
     * Returns or sets the scheme of the URL.
     * If URL is determined to be absolute (i.e. contains a host) and no scheme is provided,
     * the scheme will default to http.
     *
     * @public
     * @method  scheme
     * @param   {String}        scheme  - Optional scheme to set on the URL
     * @return  {String | URL}  the URL scheme or the URL instance
     */
    scheme : function (scheme) {
        return ( arguments.length ? this._set(SCHEME, scheme) : this._url[SCHEME] );
    },

    /**
     * Returns or set the user info of the URL.
     * The user info can optionally contain a password and is only valid for absolute URLs.
     *
     * @public
     * @method  userInfo
     * @param   {String}        userInfo    - Optional userInfo to set on the URL
     * @return  {String | URL}  the URL userInfo or the URL instance
     */
    userInfo : function (userInfo) {
        return ( arguments.length ? this._set(USER_INFO, userInfo) : this._url[USER_INFO] );
    },

    /**
     * Returns or sets the host of the URL.
     * The host name, if set, must be something valid otherwise the URL will become invalid.
     *
     * @public
     * @method  host
     * @param   {String}        host    - Optional host to set on the URL
     * @return  {String | URL}  the URL host or the URL instance
     */
    host : function (host) {
        return ( arguments.length ? this._set(HOST, host) : this._url[HOST] );
    },

    /**
     * Returns the URL's domain, where the domain is the TLD and SLD of the host.
     * e.g. foo.example.com -> example.com
     *
     * @public
     * @method  domain
     * @return  {String}    domain  - the URL domain
     */
    domain : function () {
        var host = this._url[HOST];
        return ( host ? host.split(DOT).slice(-2).join(DOT) : undefined );
    },

    /**
     * Returns or sets the port of the URL.
     *
     * @public
     * @method  port
     * @param   {Number}        port    - Optional port to set on the URL
     * @return  {Number | URL}  the URL port or the URL instance
     */
    port : function (port) {
        return ( arguments.length ? this._set(PORT, port) : this._url[PORT] );
    },

    /**
     * Returns the URL's authority which is the userInfo, host, and port combined.
     * This only makes sense for absolute URLs
     *
     * @public
     * @method  authority
     * @return  {String}    authority   - the URL's authority (userInfo, host, and port)
     */
    authority : function () {

        var url         = this._url,
            userInfo    = url[USER_INFO],
            host        = url[HOST],
            port        = url[PORT];

        return [

            userInfo ? (userInfo + AT) : EMPTY_STRING,
            host,
            port ? (COLON + port) : EMPTY_STRING,

        ].join(EMPTY_STRING);
    },

    /**
     * Returns or sets the path of the URL.
     *
     * @public
     * @method  path
     * @param   {String}        path    - Optional path to set on the URL
     * @return  {String | URL}  the URL path or the URL instance
     */
    path : function (path) {
        return ( arguments.length ? this._set(PATH, path) : this._url[PATH] );
    },

    /**
     * Returns or sets the query of the URL.
     * This takes or returns the parsed query as an Array of Arrays.
     *
     * @public
     * @method  query
     * @param   {Array}         query   - Optional query to set on the URL
     * @return  {Array | URL}   the URL query or the URL instance
     */
    query : function (query) {
        return ( arguments.length ? this._set(QUERY, query) : this._url[QUERY] );
    },

    /**
     * Returns or sets the query of the URL.
     * This takes or returns the query as a String; doesn't include the '?'
     *
     * @public
     * @method  queryString
     * @param   {String}        queryString - Optional queryString to set on the URL
     * @return  {String | URL}  the URL queryString or the URL instance
     */
    queryString : function (queryString) {

        // parse and set queryString
        if (arguments.length) {
            return this._set(QUERY, this._parseQuery(queryString));
        }

        queryString = EMPTY_STRING;

        var query = this._url[QUERY],
            i, len;

        if (query) {
            for (i = 0, len = query.length; i < len; i++) {
                queryString += query[i].join(EQUALS);
                if (i < len - 1) {
                    queryString += AMP;
                }
            }
        }

        return queryString;
    },

    /**
     * Returns or sets the fragment on the URL.
     * The fragment does not contain the '#'.
     *
     * @public
     * @method  fragment
     * @param   {String}        fragment    - Optional fragment to set on the URL
     * @return  {String | URL}  the URL fragment or the URL instance
     */
    fragment : function (fragment) {
        return ( arguments.length ? this._set(FRAGMENT, fragment) : this._url[FRAGMENT] );
    },

    /**
     * Returns a new, resolved URL instance using this as the baseUrl.
     * The URL passed in will be resolved against the baseUrl.
     *
     * @public
     * @method  resolve
     * @param   {String | URL}  url - the URL String, or URL instance to resolve
     * @return  {URL}           url - a resolved URL instance
     */
    resolve : function (url) {

        url = (url instanceof URL) ? url : new URL(url);

        var resolved, path;

        if ( ! (this.isValid() && url.isValid())) { return this; } // not sure what to do???

        // the easy way
        if (url.isAbsolute()) {
            return ( this.isAbsolute() ? url.scheme() ? url : new URL(url).scheme(this.scheme()) : url );
        }

        // the hard way
        resolved = new URL(this.isAbsolute() ? this : null);

        if (url.path()) {

            if (url.isHostRelative() || ! this.path()) {
                path = url.path();
            } else {
                path = this.path().substring(0, this.path().lastIndexOf(SLASH) + 1) + url.path();
            }

            resolved.path(this._normalizePath(path)).query(url.query()).fragment(url.fragment());

        } else if (url.query()) {
            resolved.query(url.query()).fragment(url.fragment());
        } else if (url.fragment()) {
            resolved.fragment(url.fragment());
        }

        return resolved;
    },

    /**
     * Returns a new, reduced relative URL instance using this as the baseUrl.
     * The URL passed in will be compared to the baseUrl with the goal of
     * returning a reduced-down URL to one that’s relative to the base (this).
     * This method is basically the opposite of resolve.
     *
     * @public
     * @method  reduce
     * @param   {String | URL}  url - the URL String, or URL instance to resolve
     * @return  {URL}           url - the reduced URL instance
     */
    reduce : function (url) {

        url = (url instanceof URL) ? url : new URL(url);

        var reduced = this.resolve(url);

        if (this.isAbsolute() && reduced.isAbsolute()) {
            if (reduced.scheme() === this.scheme() && reduced.authority() === this.authority()) {
                reduced.scheme(null).userInfo(null).host(null).port(null);
            }
        }

        return reduced;
    },

    // *** Private Methods *** //

    /**
     * Parses a URL into usable parts.
     * Reasonable defaults are applied to parts of the URL which weren't present in the input,
     * e.g. 'http://example.com' -> { type: 'absolute', scheme: 'http', host: 'example.com', path: '/' }
     * If nothing or a falsy value is returned, the URL wasn't something valid.
     *
     * @private
     * @method  _parse
     * @param   {String}    url     - the URL string to parse
     * @param   {String}    type    - Optional type to seed parsing: URL.ABSOLUTE or URL.RELATIVE
     * @return  {Boolean}   parsed  - whether or not the URL string was parsed
     */
    _parse : function (url, type) {

        // make sure we have a good string
        url = trim(url);
        if ( ! (isString(url) && url.length > 0)) {
            return false;
        }

        var urlParts, parsed;

        // figure out type, absolute or relative, or quit
        if ( ! type) {
            type = url.match(URL_TYPE_REGEX);
            type = type ? type[1] ? ABSOLUTE : type[2] ? RELATIVE : null : null;
        }

        switch (type) {

            case ABSOLUTE:
                urlParts = url.match(URL_ABSOLUTE_REGEX);
                if (urlParts) {
                    parsed              = {};
                    parsed[TYPE]        = ABSOLUTE;
                    parsed[SCHEME]      = urlParts[1] ? urlParts[1].toLowerCase() : undefined;
                    parsed[USER_INFO]   = urlParts[2];
                    parsed[HOST]        = urlParts[3].toLowerCase();
                    parsed[PORT]        = urlParts[4] ? parseInt(urlParts[4], 10) : undefined;
                    parsed[PATH]        = urlParts[5] || SLASH;
                    parsed[QUERY]       = this._parseQuery(urlParts[6]);
                    parsed[FRAGMENT]    = urlParts[7];
                }
                break;

            case RELATIVE:
                urlParts = url.match(URL_RELATIVE_REGEX);
                if (urlParts) {
                    parsed              = {};
                    parsed[TYPE]        = RELATIVE;
                    parsed[PATH]        = urlParts[1];
                    parsed[QUERY]       = this._parseQuery(urlParts[2]);
                    parsed[FRAGMENT]    = urlParts[3];
                }
                break;

            // try to parse as absolute, if that fails then as relative
            default:
                return ( this._parse(url, ABSOLUTE) || this._parse(url, RELATIVE) );
                break;

        }

        if (parsed) {
            this._url = parsed;
            return true;
        } else {
            return false;
        }
    },

    /**
     * Helper to parse a URL query string into an array of arrays.
     * Order of the query paramerters is maintained, an example structure would be:
     * queryString: 'foo=bar&baz' -> [['foo', 'bar'], ['baz']]
     *
     * @private
     * @method  _parseQuery
     * @param   {String}    queryString - the query string to parse, should not include '?'
     * @return  {Array}     parsedQuery - array of arrays representing the query parameters and values
     */
    _parseQuery : function (queryString) {

        if ( ! isString(queryString)) { return; }

        queryString = trim(queryString);

        var query       = [],
            queryParts  = queryString.split(AMP),
            queryPart, i, len;

        for (i = 0, len = queryParts.length; i < len; i++) {
            if (queryParts[i]) {
                queryPart = queryParts[i].split(EQUALS);
                query.push(queryPart[1] ? queryPart : [queryPart[0]]);
            }
        }

        return query;
    },

    /**
     * Helper for mutators to set a new URL-part value.
     * After the URL-part is updated, the URL will be toString'd and re-parsed.
     * This is a brute, but will make sure the URL stays in sync and is re-validated.
     *
     * @private
     * @method  _set
     * @param   {String}    urlPart - the _url Object member String name
     * @param   {Object}    val     - the new value for the URL-part, mixed type
     * @return  {URL}       this    - returns this URL instance, chainable
     */
    _set : function (urlPart, val) {

        this._url[urlPart] = val;

        if (val                     && (
            urlPart === SCHEME      ||
            urlPart === USER_INFO   ||
            urlPart === HOST        ||
            urlPart === PORT        )){
            this._url[TYPE] = ABSOLUTE; // temp, set this to help clue parsing
        }
        if ( ! val && urlPart === HOST) {
            this._url[TYPE] = RELATIVE; // temp, no host means relative
        }

        this._isValid = this._parse(this.toString());

        return this;
    },

    /**
     * Returns a normalized path String, by removing ../'s.
     *
     * @private
     * @method  _normalizePath
     * @param   {String}    path            — the path String to normalize
     * @return  {String}    normalizedPath  — the normalized path String
     */
    _normalizePath : function (path) {

        var pathParts, pathPart, pathStack, normalizedPath, i, len;

        if (path.indexOf(DOT_DOT_SLASH) > -1) {

            pathParts = path.split(SLASH);
            pathStack = [];

            for ( i = 0, len = pathParts.length; i < len; i++ ) {
                pathPart = pathParts[i];
                if (pathPart === DOT_DOT) {
                    pathStack.pop();
                } else if (pathPart) {
                    pathStack.push(pathPart);
                }
            }

            normalizedPath = pathStack.join(SLASH);

            // prepend slash if needed
            if (path[0] === SLASH) {
                normalizedPath = SLASH + normalizedPath;
            }

            // append slash if needed
            if (path[path.length - 1] === SLASH && normalizedPath.length > 1) {
                normalizedPath += SLASH;
            }

        } else {

            normalizedPath = path;

        }

        return normalizedPath;
    }

};

}());;;

/*!
 * jQuery Migrate - v1.2.1 - 2013-05-08
 * https://github.com/jquery/jquery-migrate
 * Copyright 2005, 2013 jQuery Foundation, Inc. and other contributors; Licensed MIT
 */

if ( !jQuery.uaMatch ) {
    jQuery.uaMatch = function( ua ) {
            ua = ua.toLowerCase();

            var match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
                    /(webkit)[ \/]([\w.]+)/.exec( ua ) ||
                    /(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
                    /(msie) ([\w.]+)/.exec( ua ) ||
                    ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
                    [];

            return {
                    browser: match[ 1 ] || "",
                    version: match[ 2 ] || "0"
            };
    };
}
// Don't clobber any existing jQuery.browser in case it's different
if ( !jQuery.browser ) {
	matched = jQuery.uaMatch( navigator.userAgent );
	browser = {};

	if ( matched.browser ) {
		browser[ matched.browser ] = true;
		browser.version = matched.version;
	}

	// Chrome is Webkit, but Webkit is also Safari.
	if ( browser.chrome ) {
		browser.webkit = true;
	} else if ( browser.webkit ) {
		browser.safari = true;
	}

	jQuery.browser = browser;
};;

/**
* Facebook SDK connector
*
* Copyright 2012, OnePress, http://onepress-media.com/portfolio
* Help Desk: http://support.onepress-media.com/
*/

(function ($) {
    'use strict';

    if (!$.onepress) $.onepress = {};
    if ($.onepress.facebook) return;

    /**
    * Facebook API wrapper
    */
    $.onepress.facebook = {
        _sdkScriptId: "facebook-jssdk",

        // facebook root element
        _root: null,

        _eventsCreated: false,

        // is Javascript SDK inited?
        _isConnected: false,
        _isLoaded: false,

        // is a user logged into Facebook?
        _loggedIntoFacebook: false,

        /**
        * Is FB object avalable?
        */
        _isFB: function () {
            return (typeof (window.FB) === "object");
        },

        /**
        * Is SDK connected to the page?
        */
        _isSdkconnected: function () {
            return ($("#" + this._sdkScriptId).length > 0 || $("script[src='^http://connect.facebook.net/']").length > 0);
        },

        /**
        * Is SDK being loading right now?
        */
        _isSdkLoading: function () {
            return !this._isFB() && this._isSdkconnected();
        },

        /**
        * Is SDK not loaded and not being loading right now?
        */
        _isSdkNotLoaded: function () {
            return !this._isFB() && !this._isSdkconnected();
        },

        /**
        * Is SDK loaded already?
        */
        _isSdkLoaded: function () {
            return this._isFB();
        },

        /**
        * Sets a logger.
        */
        setLogger: function (logger) {
            this._logger = logger;
        },

        loadSDK: function (appId, lang, callback) {

            this._appId = appId;
            this._logger && this._logger.debug('Entry point: $.onepress.facebook.loadSDK. [loadSDK]');

            if (callback) {
                if (this._isLoaded) {
                    this._logger && this._logger.debug('Due to Facebook SDK was loaded, the callback is called directly in $.onepress.facebook.loadSDK. [loadSDK]');
                    callback();

                } else {
                    this._logger && this._logger.debug('A thread is waiting the SDK inclusion. [loadSDK]');
                    this.bind("fb-init", function () { callback(); });
                }
            }

            this._createEvents(appId);

            if (this._isSdkNotLoaded()) {

                this._logger && this._logger.debug('Facebook SDK in not included yet. Including... [loadSDK]');

                if (this._isConnected || this._isLoaded) return;
                this._createRoot();

                var script = document.createElement('script');
                script.type = 'text/javascript';
                script.id = this._sdkScriptId;
                script.src = 'http://connect.facebook.net/' + lang + '/all.js';

                this._root.after(script);
                $.onepress.facebook._isConnected = true;

                this._logger && this._logger.info('Facebook SDK was included. [loadSDK]');
            }
        },

        _createRoot: function () {

            this._root = $("#fb-root");
            if (this._root.length == 0) {
                this._root = $("<div id='fb-root'></div>").appendTo($("body"));
                this._logger && this._logger.info('Facebook Root element was created. [loadSDK]');
            }
        },

        _createEvents: function (appId, force) {
            var self = this;

            if (this._eventsCreated && !force) return;
            this._eventsCreated = true;

            this._logger && this._logger.debug('Creating Facebook Events... [_createEvents]');

            if (this._isSdkLoading() || this._isSdkNotLoaded()) {

                this._logger && this._logger.info('Events were subscribed to fbAsyncInit function. [_createEvents]');

                var predefined = null;
                if (window.fbAsyncInit && !force) predefined = window.fbAsyncInit;

                window.fbAsyncInit = function () {

                    if (predefined) predefined();

                    self._fbInit(appId);
                    self._fbInitEvents();

                    self._isLoaded = true;
                    $(document).trigger('fb-init');
                    window.fbAsyncInit = function () { };
                };

                // SDK is loaded already
            } else {

                this._logger && this._logger.warn('Events are called directly. [_createEvents]');

                // SDK is not inited
                if (this._isSdkLoaded()) this._fbInit(appId);
                this._fbInitEvents();

                self._isLoaded = true;
                $(document).trigger('fb-init');
            }

        },

        _fbInit: function (appId) {

            window.FB.init({
                appId: appId,
                status: true,
                cookie: true,
                xfbml: true
            });

            // The initialization is executed only one time.
            // Any others attempts will call an empty function.
            window.FB.init = function () { };
        },

        _fbInitEvents: function () {
            var self = this;

            window.FB.Event.subscribe('edge.create', function (response) {
                $(document).trigger('fb-like', [response]);
            });

            window.FB.Event.subscribe('edge.remove', function (response) {
                $(document).trigger('fb-dislike', response);
            });

            window.FB.Event.subscribe('xfbml.render', function () {
                $(document).trigger('fb-render');
            });
        },

        renderWidget: function ($widget) {

            var api = $widget.data('facebook-widget');
            if (api) {
                var $html = api.getHtmlToRender();
                $html.find('.fake-fb-like').addClass('fb-like');
                window.FB.XFBML.parse($html[0]);
                $widget.trigger('fb-render');
            }
        },

        bind: function (name, callback) {
            $(document).bind(name, callback);
        },

        isLogged: function (callback) {
            this._logger && this._logger.debug('Entry point: $.onepress.isLogged [isLogged]');

            // if a login state was got
            if (this._isLoginChecked) {
                this._logger && this._logger.debug('The login state is already checked. Returning the saved values. [isLogged]');

                callback(this._auth, this._isLoggetInto);
                return;
            }

            var self = this;

            // if a login state is being checking right now by other locker 
            if (this._loginStateisChecking) {
                this._logger && this._logger.debug('The login state is checking. A thread is waiting. [isLogged]');

                $(document).bind("fb-is-logged", function () {
                    callback(self._auth, self._isLoggetInto);
                });
                return;
            }

            this._loginStateisChecking = true;
            this._logger && this._logger.debug('Starting to check the login state... [isLogged]');

            window.FB.getLoginStatus(function (response) {

                self._isLoginChecked = true;
                self._isLoggetInto = !(response.status == 'unknown');
                self._auth = response && response.authResponse;

                self._logger && self._logger.info('The login state is got successfully. [login]');
                self._logger && self._logger.debug('Access Token: ' + (self._auth && self._auth.accessToken));
                self._logger && self._logger.debug('Is Logged In: ' + self._isLoggetInto);

                callback(response && response.authResponse, !(response.status == 'unknown'));
                self._loginStateisChecking = false;
                $(document).trigger('fb-is-logged');
            });
        },

        login: function (useRedirect, redirectUrl, callback) {
            var self = this;
            this._logger && this._logger.debug('Entry point: $.onepress.login [login]');

            var permissions = $.onepress.facebook.permissions
                ? $.onepress.facebook.permissions + ",user_likes"
                : "user_likes";

            if (useRedirect) {
                
                redirectUrl = $.onepress.addParamToUrl( redirectUrl, "l2u", true );
                var url = "https://www.facebook.com/dialog/oauth?client_id=" + this._appId + "&redirect_uri=" + encodeURIComponent( redirectUrl ) + "&scope=" + permissions + "&response_type=token";
                window.location.href = url;
                
            } else {

                window.FB.login(function (response) {

                    self._auth = response && response.authResponse;
                    self._isLoggetInto = response && !(response.status == 'unknown');
                    self._isLoginChecked = true;

                    self._logger && self._logger.info('The login is made. [login]');
                    self._logger && self._logger.debug(self._auth, 2);
                    self._logger && self._logger.debug('Access Token: ' + (self._auth && self._auth.accessToken));
                    self._logger && self._logger.debug('Is Logged In: ' + self._isLoggetInto);

                    callback(response && response.authResponse);
                }, { scope: permissions });

            }
        },

        isUrlLiked: function (url, callback) {
            var self = this;

            function IsNumeric(pageId) {
                return pageId && parseInt(pageId) > 0;
            }

            this.getPageIdByUrl(url, function (pageId, error) {

                if (!IsNumeric(pageId)) {
                    callback(false, "Unable to get a Facebook page id of the specified URL to check whether a user likes the URL or not. Use the Soft Mode or set other URL. Used URL: " + url);
                } else {
                    self.isPageIdLiked(pageId, function (result, error2) {
                        callback(result, error2);
                    });
                }
            });
        },

        pageIdCache: [],

        getPageIdByUrl: function (gotUrl, callback) {

            var url = gotUrl.replace(/^(https?\:\/\/)?(www.)?facebook.com\/?/, "");

            var self = this;

            var pageId = false;
            $.each(this.pageIdCache, function (index, item) {

                if (item.url == item) {
                    pageId = item.pageId;
                    return false;
                }
            });

            if (pageId && callback) {
                callback(pageId);
                return;
            }

            window.FB.api("/", { "id": url }, function (response) {

                if (!response.error) {

                    self.pageIdCache.push({ "url": url, "pageId": response.id });
                    callback(response.id);

                } else {
                    callback(false, response.error.message);
                }
            });

            return;
        },

        isPageIdLiked: function (pageId, callback, repeat) {
            var self = this;

            this._logger && this._logger.debug('Entry point $.onepress.isPageIdLiked [isPageIdLiked]');
            this._logger && this._logger.debug('PageId: ' + pageId);
            this._logger && this._logger.debug('Access Token: ' + (this._auth && this._auth.accessToken));

            if (!pageId) return callback(false, "The pageId is underfined.");
            if (!this._auth.accessToken) return callback(false, "The access tocken is not specified.");

            $.ajax({
                url: 'https://graph.facebook.com/me/likes/' + pageId,
                data: { 'access_token': this._auth.accessToken },
                dataType: 'jsonp',
                success: function (response) {
                    self._logger && self._logger.debug('A like state is got.');

                    if (!response.error) {
                        self._logger && self._logger.info('Data count: ' + response.data.length);
                        self._logger && self._logger.debug(response, 3);

                        callback(response.data.length > 0);
                    } else {
                        self._logger && self._logger.error(response.error.message);
                        self._logger && self._logger.error(response, 3);

                        callback(false, response.error.message);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    self._logger && self._logger.error("error: " + textStatus + ', ' + errorThrown);
                    self._logger && self._logger.error("incoming Text: " + jqXHR.responseText);
                    callback(false, "Something wrong during the ajax requst.");
                }
            });
        }
    };
})(jQuery);;;

/**
* OnePress Lije Button widget for Like 2 Unlock for jQuery
* http://codecanyon.net/item/like-2-unlock-for-jquery/2822035
*
* Copyright 2012, Paul Kashtanoff (from OnePress).
*/

(function ($) {
    'use strict';
    if ($.fn.fblike) return;
    
    $.onepress.widget("fblike", {
        options: {},

        _defaults: {
            // - Properties

            onceEvent: true,

            // - Facebook Options

            // URL to like.
            url: null,
            // Display send button.
            sendButton: false,
            // App Id used to get extended contol tools (optionly).
            // You can create your own app here: https://developers.facebook.com/apps				
            appId: 0,
            // Language of the button labels. By default en_US.
            lang: 'en_US',
            // Button layout, available: standard, button_count, box_count. By default 'standart'.
            layout: 'standard',
            // Button container width in px, by default 450.
            width: 'auto',
            // Show profile pictures below the button. By default 'true'.
            showFaces: false,
            // The verb to display in the button. Only 'like' and 'recommend' are supported. By default 'like'.
            verbToDisplay: "like",
            // The color scheme of the plugin. By default 'light'.
            colorScheme: "light",
            // The font of the button. By default 'tahoma'.
            font: 'tahoma',
            // A label for tracking referrals.
            ref: null,
            comment: true,
            // extra permissions 
            permissions: null,

            // - Events

            render: null,
            like: null,
            dislike: null
        },

        _create: function () {
            var self = this;

            this._prepareOptions();
            this._setupEvents();

            this.element.data('facebook-widget', this);
            this._createButton();

            if (this.options.permissions) $.onepress.facebook.permissions = this.options.permissions;

            $.onepress.facebook.loadSDK(this.options.appId, this.options.lang, function () {
                $.onepress.facebook.renderWidget(self.element);
            });
        },

        _prepareOptions: function () {

            var values = $.extend({}, this._defaults);

            if (this.element.data('href') !== undefined) values.url = this.element.data('href');
            if (this.element.data('send') !== undefined) values.sendButton = this.element.data('send');
            if (this.element.data('layout') !== undefined) values.layout = this.element.data('layout');
            if (this.element.data('show_faces') !== undefined) values.showFaces = this.element.data('show_faces');
            if (this.element.data('width') !== undefined) values.width = this.element.data('width');
            if (this.element.data('action') !== undefined) values.verbToDisplay = this.element.data('action');
            if (this.element.data('font') !== undefined) values.font = this.element.data('font');
            if (this.element.data('colorscheme') !== undefined) values.colorScheme = this.element.data('colorscheme');
            if (this.element.data('ref') !== undefined) values.ref = this.element.data('ref');

            values = $.extend(values, this.options);

            this.options = values;
            this.url = URL.normalize( (!this.options.url) ? window.location.href : this.options.url );
        },

        _setupEvents: function () {
            var self = this;

            $(document).bind('fb-init', function () {
                if (self.options.init) self.options.init();
            });

            $(document).bind('fb-like', function (e, url) {
                if (self.options.like && self.url == URL.normalize(url)) {
                    self.options.like(url, self);
                }
            });

            $(document).bind('fb-dislike', function (e, url) {

                if (self.options.dislike && self.url == URL.normalize(url)) {
                    self.options.dislike(url, self);
                }
            });

            $(document).bind('fb-auth', function (e, state) {
                alert('heere!');
            });

            $(this.element).bind('fb-render', function () {

                if (self.options.render) {
                    self.options.render(self.element, [self]);
                }
            });
        },

        /**
        * Generates an html code for the button using specified options.
        */
        _createButton: function () {

            var $wrap;

            if (!this.element.is(".fb-like")) {

                var $button = $("<div class='fake-fb-like'></div>");
                $button.data('facebook-widget', this);

                if (this.options.url) $button.attr("data-href", this.options.url);
                if (this.options.sendButton) $button.attr("data-send", this.options.sendButton);
                if (this.options.width) $button.attr("data-width", this.options.width);
                if (this.options.layout) $button.attr("data-layout", this.options.layout);
                $button.attr("data-show-faces", this.options.showFaces);

                if (this.options.verbToDisplay) $button.attr("data-action", this.options.verbToDisplay);
                if (this.options.font) $button.attr("data-font", this.options.font);
                if (this.options.colorScheme) $button.attr("data-colorscheme", this.options.colorScheme);
                if (this.options.ref) $button.attr("data-ref", this.options.ref);

                this.element.append($button);
                $wrap = this.element;

            } else {
                $wrap = $("<div></div>").append(this.element);
            }

            $wrap.addClass('ui-social-button ui-facebook ui-facebook-like');
            $wrap.addClass('ui-facebook-like-' + (this.options.layout ? this.options.layout : 'standard'));
        },

        getHtmlToRender: function () {

            if (this.element.is(".fb-like")) return this.element.parent();
            return this.element;
        }
    });

})(jQuery);;;

/**
* Preset resources for Like 2 Unlock
* for jQuery: http://onepress-media.com/plugin/like-2-unlock-for-facebook/get
* for Wordpress: http://onepress-media.com/plugin/like-2-unlock-for-facebook-wordpress/get
*
* Copyright 2012, OnePress, http://onepress-media.com/portfolio
* Help Desk: http://support.onepress-media.com/
*/

(function ($) {
    'use strict';
    if ($.fn.toLike) return;

    $.onepress.widget("toLike", {

        options: {
            locker: {},
            facebook: {},
            events: {}
        },

        // Defauls option's values.
        _defaults: {

            // url to like.
            url: null,

            // page id for the strict mode
            pageId: null,

            // a message that appears inside the locker 
            text: $.onepress.lang.tolike.defaultMessage,

            // a message that appears when login is required
            loginText: $.onepress.lang.tolike.loginMessage,

            // adds exta classes here (for example, classes of the built-in themes).	
            style: null,

            // sets to false to turn of the highlight effect
            highlight: true,

            // sets whether the locker appears always
            demo: false,

            // enables debugging
            debug: false,

            // -
            // Main locker configuration settings.
            // -
            locker: {
                // it's a special option that allow to make the locker to work on any site but
                // when the one is used the strict mode is blocked and the option loggedOnly is set to false
                force: false,
                // set true to show a Like Buttom above the locker
                inverse: false,
                // set true to turn on the closing cross on the corner
                close: false,
                // set positive integer for the Timer
                timer: false,
                // set true to turn on the Strict Mode
                strict: false,
                // set false to turn off the locker for mobiele users
                mobile: true,
                // set true to show the locker onli for loggged facebook users
                loggedOnly: false,
                // set watch dog interval to unlock content if some troubles are going
                watchdog: 15000,
                // sets true to enable the touch interface
                mobileFactor: false,
                // sets url to redirect for mobile devices after the login process
                mobileRedirectUrl: null
            },

            // -
            // Content that will be showen after unlocking.
            // -
            content: null,

            // -
            // Facebook like button options.
            // -
            facebook: {

                // Display send button.
                sendButton: false,
                // App Id used to get extended contol tools (optionly).
                // You can create your own app here: https://developers.facebook.com/apps				
                appId: 0,
                // Language of the button labels. By default en_US.
                lang: 'en_US',
                // Button layout, available: standart, button_count, box_count. By default 'standart'.
                layout: null,
                // Button container width in px, by default 450.
                width: null,
                // Show profile pictures below the button. By default 'true'.
                showFaces: false,
                // The verb to display in the button. Only 'like' and 'recommend' are supported. By default 'like'.
                verbToDisplay: "like",
                // The color scheme of the plugin. By default 'light'.
                colorScheme: "light",
                // The font of the button. By default 'tahoma'.
                font: 'tahoma',
                // extra permissions 
                permissions: null
            },

            // -
            // Events
            // -
            events: {
                // when the login is just made
                loginCompleted: null,
                // when content is locked
                lock: null,
                // when content is unlocked
                unlock: null,
                // when content is unlocked by the Time
                unlockByTimer: null,
                // when content is unlocked by the Close Button
                unlockByClose: null,
                // when content is unlocked by the WatchDog
                unlockByWatchdog: null,
                // when a locker is created and inited
                ready: null
            }
        },

        /** 
        * Creats the locker.
        */
        _create: function () {

            var self = this;
            this._parseOptions();

            // set up a html logger if the debug option is enabled
            if (this.options.debug) {
                this._logger = new $.onepress.logger($("<div>").insertAfter(this.element));
                $.onepress.facebook.setLogger(this._logger);
            }

            // if it's a mobile device and the option Mobile is set to True, don't create a locker
            if ($.onepress.isMobile()) {
                this.options.locker.mobileFactor = true;
            }
            
            if ($.onepress.isMobile() && !this.options.locker.mobile) {
                self._preUnlock("mobile"); return;
            }

            // provider that used to get a like buttons state
            this._provider = (!this.options.locker.strict)
                ? new $.onepress.localFacebookStoreStateProvider(this.url, this, this.options.demo)
                : new $.onepress.strictStateProvider(this.url, this, this.options.demo);

            // continue if there is no erros
            if (this._error) { this.element.show(); return; }

            this._setLoadingState(true);

            // if used the Soft Provider and content is unlocked, no need to check the login state
            if (!self.options.locker.strict && self._provider.isUnlocked()) {
                self._preUnlock("provider"); return;
            }

            // force to show locker if the given option is specified
            if (this.options.locker.force) {
                this._provider.isUnlocked() ? this._unlock("provider") : this._lock("provider");
                return;
            }

            self._runWatchdog('[check-login]');

            this._checkLogin(function (result, loggedIntoFacebook) {

                // [check-login]
                self._stopWatchdog();

                // if sets the option loggedOnly and a user is not loggged 
                if (self.options.locker.loggedOnly && !loggedIntoFacebook) {
                    self._preUnlock("loggedOnly"); return;
                }

                self._showOverlay = !loggedIntoFacebook;

                // --
                // Strict Mode (uses the Facebook API)
                // --

                if (self.options.locker.strict) {

                    if (!loggedIntoFacebook) {
                        self._lock("provider");
                        if (self.options.events.ready) self.options.events.ready("locked");
                        return;
                    }

                    self._runWatchdog('[strict-mode-wait-provider]');

                    // Checks whether the provider is ready to get a Like Button state.
                    self._provider.isUsable(function (result) {

                        // [strict-mode-wait-provider]
                        self._stopWatchdog();
                        self._showOverlay = !result;

                        // the provider is ready
                        if (result) {
                            self._runWatchdog('[strict-mode-get-state]');

                            self._provider.getState(function (state) {

                                // [strict-mode-get-state]
                                self._stopWatchdog();

                                !state ? self._lock("provider") : self._unlock("provider");
                                if (self.options.events.ready) self.options.events.ready(state ? "unlocked" : "locked");
                            });

                            // the provider is not ready, wait extra user actions 
                        } else {

                            self._lock("provider");
                            if (self.options.events.ready) self.options.events.ready("locked");
                        }
                    });
                }

                // --
                // Soft Mode (uses the cookies)
                // --

                else {

                    var state = self._provider.isUnlocked();
                    !state ? self._lock("provider") : self._unlock("provider");
                    if (self.options.events.ready) self.options.events.ready(state ? "unlocked" : "locked");
                }
            });
        },

        // --------------------------------------------------------------------------------------
        // Options parsing
        // --------------------------------------------------------------------------------------

        _parseOptions: function () {

            var options = $.extend(true, {}, this._defaults, this.options);

            options.pageId = options.pageId || options.pageid;
            options.facebook.appId = options.facebook.appId || options.facebook.appid;

            if (!options.text) options.text = $.onepress.lang.tolike.defaultMessage;

            options.text = (typeof options.text === "function" && options.text(this)) ||
                           (typeof options.text === "string" && $("<div>" + options.text + "</div>")) ||
                           (typeof options.text === "object" && options.text.clone());

            if (!options.loginText) options.loginText = $.onepress.lang.tolike.loginMessage;

            options.loginText = (typeof options.loginText === "function" && options.loginText(this)) ||
                           (typeof options.loginText === "string" && $("<div>" + options.loginText + "</div>")) ||
                           (typeof options.loginText === "object" && options.loginText.clone());

            if (options.locker.timer && !parseInt(options.locker.timer)) options.locker.timer = null;
            options.locker.watchdog = parseInt(options.locker.watchdog);

            if (options.locker.force) {
                options.locker.strict = false;
                options.locker.loggedOnly = false;
            }

            // facebook
            if (!options.facebook.appId) {
                this._setError("Set Facebook App ID to use the Like 2 Unlock plugin. Create an app here: https://developers.facebook.com/apps");
                return;
            }

            this.url = this.url || this.options.url || window.location.href;
            this.identity = $.onepress.tools.hash(this.url);
            this.element.addClass("identity-" + this.identity).addClass("ui-locker-content");

            this.options = options;
        },

        // --------------------------------------------------------------------------------------
        // Service methods
        // --------------------------------------------------------------------------------------

        /**
        * WatchDog is a simple mechanism to show content in the case when something is going wrong.
        * For example, the SDK is being loading too long (low internet speed).
        */
        _runWatchdog: function (uniqueLabel) {
            if (!this.options.locker.watchdog) return;
            var self = this;

            this._watchdog = setTimeout(function () {

                self._stoppedByWatchdog = true;
                self._unlock("watchdog");

                if (uniqueLabel && console) {
                    var text = "Watchdog: " + uniqueLabel;
                    (console.debug && console.debug(text)) || (console.log && console.log(text));
                }
            }, this.options.locker.watchdog);
        },

        _stopWatchdog: function () {

            if (!this._watchdog) return;
            clearTimeout(this._watchdog);
            this._watchdog = null;
        },

        /**
        * Checks is a user logged into Facebook
        */
        _checkLogin: function (callback) {

            $.onepress.facebook.loadSDK(this.options.facebook.appId, this.options.facebook.lang, function () {
                $.onepress.facebook.isLogged(function (result, loggedIntoFacebook) {
                    callback(result, loggedIntoFacebook);
                });
            });
        },

        /**
        * Sets a loading state.
        */
        _setLoadingState: function (stateFlag) {
            if (!stateFlag) { if (this.loadingState) this.loadingState.remove(); return; }

            var after = (this.element.parent().is('a')) ? this.element.parent() : this.element;
            this.loadingState = $("<div class='ui-locker-loading-holder'></div>").insertAfter(after);
            this.element.hide();
        },

        /**
        * Sets an error state.
        */
        _setError: function (text) {
            this._error = true;
            this._errorText = text;

            this._setLoadingState(false);
            this.locker && this.locker.hide();

            this.element.html("<strong>[Error]: " + text + "</strong>");
            this.element.show().addClass("ui-facebook-locker-error");
        },


        // --------------------------------------------------------------------------------------
        // Methods to create markups
        // --------------------------------------------------------------------------------------

        /**
        * Creates markup of the plugin.
        */
        _createMarkup: function () {
            var self = this;

            var browser = (jQuery.browser.mozilla && 'mozilla') ||
                          (jQuery.browser.opera && 'opera') ||
                          (jQuery.browser.webkit && 'webkit') || 'msie';

            this.locker = $("<div class='ui-locker-facebook ui-locker-" + browser + "'></div>").hide();
            this.outerWrap = $("<div class='ui-locker-outer-wrap'></div>").appendTo(this.locker);
            this.innerWrap = $("<div class='ui-locker-inner-wrap'></div>").appendTo(this.outerWrap);
            this.element.addClass("ui-locker-content");

            this.locker.addClass(this.options.style);
            if (this.options.locker.mobileFactor) this.locker.addClass('ui-locker-mobile');

            // Inner text defined by a user.
            this.options.text.addClass("ui-locker-text").show();

            this.options.text.prepend(($("<div class='ui-locker-decorator-3'></div>")));
            this.options.text.append(($("<div class='ui-locker-decorator-4'></div>")));

            // wrapper of social buttons
            this.buttonsWrap = $("<div class='ui-locker-buttons'></div>");
            this.buttonWrap = $("<div class='ui-locker-button'></div>").appendTo(this.buttonsWrap);
            this.buttonsWrap.prepend($("<div class='ui-locker-decorator-5'></div>"));

            this.innerWrap.append($("<div class='ui-locker-decorator-1'></div>"));

            if (this.options.locker.inverse) {
                this.innerWrap.append(this.buttonsWrap);
                this.innerWrap.append(this.options.text);
                this.locker.addClass('ui-locker-inverse');
            } else {
                this.innerWrap.append(this.options.text);
                this.innerWrap.append(this.buttonsWrap);
            }

            this.innerWrap.append($("<div class='ui-locker-decorator-2'></div>"));
            this.buttonsWrap.append(($("<div class='ui-locker-decorator-6'></div>")));

            // Creates social buttons
            if (this._createSocialButtons) this._createSocialButtons(this.locker, this.buttonWrap);

            // close button and timer
            this.options.locker.close && this._createCloseButton();
            this.options.locker.timer && this._createTimer();

            var after = (this.element.parent().is('a')) ? this.element.parent() : this.element;
            this.locker.insertAfter(after);

            // create overlay that blocks locker untile a user is logged in
            this._showOverlay && this._createOverlay();

            this._markupIsCreated = true;
            
            // calls the event loginCompleted for mobile devices
            if ( this.options.locker.mobileFactor ) {
                var urlParams = $.onepress.getParamsFromUrl(window.location.href);
                if ( urlParams['l2u'] ) {
                    if (self.options.events.loginCompleted) self.options.events.loginCompleted();
                }
            }
        },

        /**
        * Creates markup for the Clsoe Button.
        */
        _createCloseButton: function () {
            var self = this;

            this.closeButton = $("<div title='" + $.onepress.lang.tolike.close + "' class='ui-locker-close-icon'></div>");
            this.closeButton.prependTo(this.locker);

            this.closeButton.click(function () {
                if (!self.close || self.close(self)) self._unlock("close");
            });
        },

        /**
        * Creates markup for timer.
        */
        _createTimer: function () {
            this.timer = $("<span class='ui-locker-timer'></span>");

            var timerLabelText = $.onepress.lang.tolike.orWait;

            this.timerLabel = $("<span class='ui-locker-timer-label'>" + timerLabelText + " </span>").appendTo(this.timer);
            this.timerCounter = $("<span class='ui-locker-timer-counter'>" + this.options.locker.timer + "s</span>").appendTo(this.timer);

            this.timer.appendTo(this.locker);

            this.counter = this.options.locker.timer;
            this._kickTimer();
        },

        /**
        * Creates overlay.
        */
        _createOverlay: function () {
            var self = this;

            var overlay = $("<div class='ui-locker-overlay'></div>").prependTo(self.locker);
            overlay.css({
                "marginTop": "-" + self.locker.css("borderTopWidth"),
                "marginLeft": "-" + self.locker.css("borderLeftWidth")
            });

            var makeSimilar = function (target) {
                target.css({
                    width: self.locker.outerWidth(),
                    height: self.locker.outerHeight()
                });
            };

            var message = $("<div class='ui-locker-overlay-message'></div>").prependTo(this.locker);
            this.options.loginText.addClass('ui-locker-overlay-text').appendTo(message);
            $("<div class='ui-locker-overlay-button'></div>").appendTo(message);

            if (!this.options.locker.mobileFactor) {

                message.css("opacity", 0);
                overlay.css("opacity", 0.05);

                this.locker.hover(
                    function () {
                        makeSimilar(overlay);
                        message.css("marginTop", -message.outerHeight() / 2);
                        overlay.stop().animate({ "opacity": 0.8 }, 500);
                        message.stop().animate({ "opacity": 1 }, 500);
                    },
                    function () {
                        overlay.stop().animate({ "opacity": 0.05 }, 500);
                        message.stop().animate({ "opacity": 0 }, 500);
                    }
                );
            } else {

                message.css("opacity", 1);
                overlay.css("opacity", 0.5);

            }

            overlay.add(message).click(function () {

                var urltoRedirect = self.options.locker.mobileRedirectUrl || window.location.href;

                $.onepress.facebook.login(self.options.locker.mobileFactor, urltoRedirect, function (result) {
                    if (!result) return;
                    if (self.options.events.loginCompleted) self.options.events.loginCompleted();
                    
                    // if the soft mode is used
                    if (!self.options.locker.strict) {
                        $(document).trigger('fb-login');
                        return;
                    }

                    // if the strict mode is used
                    self._provider.getState(function (state, error) {
                        $(document).trigger('fb-login');
                        if (state) self._unlock("provider");
                    });
                });
            });

            $(document).bind('fb-login', function () {
                overlay.add(message).hide();
            });
        },

        /**
        * Lick the timer to perform a next iteration.
        */
        _kickTimer: function () {
            var self = this;

            setTimeout(function () {

                if (!self._isLocked) return;

                self.counter--;
                if (self.counter <= 0) {
                    self._unlock("timer");
                } else {
                    self.timerCounter.text(self.counter + "s");

                    // Opera fix.
                    if ($.browser.opera) {
                        var box = self.timerCounter.clone();
                        box.insertAfter(self.timerCounter);
                        self.timerCounter.remove();
                        self.timerCounter = box;
                    }

                    self._kickTimer();
                }
            }, 1000);
        },

        _recreateFacebookButton: function () {
            if (!this.socialButton) return;

            var buttonWrap = this.backup.clone().insertAfter(this.socialButton);
            this.socialButton.remove();
            this._createSocialButtons(this, buttonWrap);
        },

        /**
        * Creates social button.
        */
        _createSocialButtons: function (locker, buttonWrap) {
            var self = this;

            var facebookOptions = $.extend({}, this.options.facebook);
            if (this.options.url) facebookOptions.url = this.options.url;

            facebookOptions.like = function () {
                self._unlock("button");
            };

            facebookOptions.dislike = function () {
                self._lock("button");
            };

            this.backup = buttonWrap.clone();
            this.socialButton = buttonWrap.fblike(facebookOptions);

            $(document).bind('fb-login', function () {
                self._recreateFacebookButton();
            });
        },

        // --------------------------------------------------------------------------------------
        // Lock/Unlock content.
        // --------------------------------------------------------------------------------------

        _lock: function (typeSender, sender) {

            this._setLoadingState(false);

            if (this._isLocked || this._stoppedByWatchdog) return;
            if (!this._markupIsCreated) this._createMarkup();
            if (typeSender == "button") this._provider.setState("locked");

            this.element.hide();
            this.locker.fadeIn(1000);

            this._isLocked = true;
            if (this.options.events.lock) this.options.events.lock(this);
        },

        _unlock: function (typeSender, sender) {
            var self = this;

            this._setLoadingState(false);
            if (typeSender == "watchdog" && this.options.events.unlockByWatchdog) return this.options.events.unlockByWatchdog();

            if (!this._isLocked) { this._showContent(true); return false; }
            if (typeSender == "button") this._provider.setState("unlocked");

            this._showContent(true);

            this._isLocked = false;
            if (typeSender == "timer" && this.options.events.unlockByTimer) return this.options.events.unlockByTimer();
            if (typeSender == "close" && this.options.events.unlockByClose) return this.options.events.unlockByClose();
            if (this.options.events.unlock) this.options.events.unlock();
        },

        _preUnlock: function (type, sender) {

            this._setLoadingState(false);
            this._showContent(false);
            if (this.options.events.ready) this.options.events.ready("unlocked");
        },

        _showContent: function (useEffects) {
            var self = this;

            var effectFunction = function () {

                if (self.locker) self.locker.hide();
                if (!useEffects) { self.element.show(); return; }

                self.element.fadeIn(1000, function () {
                    self.options.highlight && self.element.effect && self.element.effect('highlight', { color: '#fffbcc' }, 800);
                });
            };

            if (!this.options.content) {
                effectFunction();

            } else if (typeof this.options.content === "string") {
                this.element.html(this.options.content);
                effectFunction();

            } else if (typeof this.options.content === "object" && !this.options.content.url) {
                this.element.append(this.options.content.clone().show());
                effectFunction();

            } else if (typeof this.options.content === "object" && this.options.content.url) {

                var ajaxOptions = $.extend(true, {}, this.options.content);

                var customSuccess = ajaxOptions.success;
                var customComplete = ajaxOptions.complete;
                var customError = ajaxOptions.error;

                ajaxOptions.success = function (data, textStatus, jqXHR) {

                    !customSuccess ? self.element.html(data) : customSuccess(self, data, textStatus, jqXHR);
                    effectFunction();
                };

                ajaxOptions.error = function (jqXHR, textStatus, errorThrown) {

                    self._setError("An error is triggered during the ajax request! Text: " + textStatus + " " + errorThrown);
                    customError && customError(jqXHR, textStatus, errorThrown);
                };

                ajaxOptions.complete = function (jqXHR, textStatus) {

                    customComplete && customComplete(jqXHR, textStatus);
                };

                $.ajax(ajaxOptions);

            } else {
                effectFunction();
            }
        }
    });

    /**
    * [obsolete]
    */
    $.fn.tolike = function (opts) {

        opts = $.extend({}, opts);
        $(this).toLike(opts);
    };

})(jQuery);

(function($){

    /**
    * Local Storage / Cookie state provider.
    */
    $.onepress.localFacebookStoreStateProvider = function (url, api, demo){

        this.url = url;
        this.identity = "page_" + $.onepress.tools.hash(url) + "_fb";

        this.isUsable = function(callback) { callback(true); };

        this.lock = function() {};

        this.isUnlocked = function() {
            if (demo) return false;
            return (this._getValue()) ? true : false;
        };

        this.isLocked = function() {
            return !this.isUnlocked();
        };

        this.getState = function(callback) {
            callback(this.isUnlocked());
        };

        this.setState = function(value) {
            if (demo) return false;
            return value == "unlocked" ? this._setValue() : this._removeValue();
        };

        this._setValue = function() {
            
            if( localStorage ) {
                localStorage.setItem( this.identity, true );
            } else {
                $.onepress.tools.cookie( this.identity, true, { expires: 356 * 10, path: "/" } );
            }
        };

        this._getValue = function() {
            if( !localStorage ) return $.onepress.tools.cookie( this.identity );
            
            var value = localStorage.getItem( this.identity );
            if (value) return value;
            value = $.onepress.tools.cookie(this.identity);
            if (value) this._setValue();
            return value;
        };

        this._removeValue = function() {
            if ( localStorage ) localStorage.removeItem(this.identity);
            $.onepress.tools.cookie(this.identity, null);
        };
    };
    
    /**
    * Returns a state provide for the Strict Mode.
    */
    $.onepress.strictStateProvider = function(url, api, demo ) {
        var self = this;
        
        this.url = url;
        this.api = api;
        
        this.loggedIntoFacebook = false;

        this.isUsable = function(callback) {

            this.api._checkLogin(function(result, loggedIntoFacebook) {
                self.loggedIntoFacebook = loggedIntoFacebook;
                if (callback) callback(result);
            });
        };

        /**
        * Gets a state for a specified url.
        */
        this.getState = function(callback) {
            if (demo) return callback(false);

            if (self.api.options.pageId) {
                $.onepress.facebook.isPageIdLiked(self.api.options.pageId, function(result, error) {
                    if (error) { self.api._setError(error); return; }
                    if (callback) callback(result, error);
                });
            } else {

                $.onepress.facebook.isUrlLiked(self.url, function(result, error) {
                    if (error) { self.api._setError(error); return; }
                    if (callback) callback(result, error);
                });
            }
        };

        /**
        * Sets a state for a specfied url.
        * Nothings happens. It uses Facebook API to get a state, no way to set a state.
        */
        this.setState = function() {};
    };

})(jQuery);;;

