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
        loginMessage: 'You must log in to perform this action.',   
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
    
    $.onepress.detectBrowser = $.onepress.detectBrowser || function(){
        
        var uaMatch = jQuery.uaMatch || function( ua ) {
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

	var matched = uaMatch( navigator.userAgent );
	$.onepress.browser = {};
        
 	if ( matched.browser ) {
            $.onepress.browser[ matched.browser ] = true;
            $.onepress.browser.version = matched.version;
	}
        
        function getInternetExplorerVersion()
        {
            var rv = -1;
            if (navigator.appName == 'Microsoft Internet Explorer')
            {
                var ua = navigator.userAgent;
                var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
                if (re.exec(ua) != null) rv = parseFloat( RegExp.$1 );
            }
            else if (navigator.appName == 'Netscape')
            {
                var ua = navigator.userAgent;
                var re  = new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})");
                if (re.exec(ua) != null) rv = parseFloat( RegExp.$1 );
            }
            return rv;
        }
        
        var ieVersion = getInternetExplorerVersion();
        if ( ieVersion > 0 ) {
            $.onepress.browser.msie = true;
            $.onepress.browser.version = ieVersion;
        }

	// Chrome is Webkit, but Webkit is also Safari.
	if ( $.onepress.browser.chrome ) {
            $.onepress.browser.webkit = true;
	} else if ( $.onepress.browser.webkit ) {
            $.onepress.browser.safari = true;
	}
    }
    
    $.onepress.detectBrowser();

})(jQuery);;;

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
            this.url = (!this.options.url) ? window.location.href : this.options.url;
        },

        _setupEvents: function () {
            var self = this;

            $(document).bind('fb-init', function () {
                if (self.options.init) self.options.init();
            });

            $(document).bind('fb-like', function (e, url) {

                if (self.options.like && self.url == url) {
                    self.options.like(url, self);
                }
            });

            $(document).bind('fb-dislike', function (e, url) {

                if (self.options.dislike && self.url == url) {
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
                mobileFactor: null,
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

                if (!this.options.locker.mobile) {
                    self._preUnlock("mobile"); return;
                }
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

            var browser = ($.onepress.browser.mozilla && 'mozilla') ||
                          ($.onepress.browser.opera && 'opera') ||
                          ($.onepress.browser.webkit && 'webkit') || 'msie';

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
            if (typeSender == "watchdog" && this.options.events.unlockByWatchdog) {
                this._showContent(true);
                return this.options.events.unlockByWatchdog();
            }

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

})(jQuery);

(function($){
    if ( !window.onpl2u ) window.onpl2u = {};
    if ( !window.onpl2u.lockerOptions ) window.onpl2u.lockerOptions = {};
    
    window.onpl2u.lockers = function() {
        
        // shortcodes
        
        $(".onp-like2unlock-call").each(function(){
            var $target = $(this);
            var lockId = $target.data('lock-id');

            var data = window.onpl2u.lockerOptions[lockId] 
                ? window.onpl2u.lockerOptions[lockId] 
                : $.parseJSON( $target.next().text() );
            
            window.onpl2u.createLocker( $target, data, lockId );
        });
        
    };
    
    window.onpl2u.createLocker = function( $target, data, lockId ) {

        var options = data.options;

        if ( data.ajax ) {
            options.content = {
                url: data.ajaxUrl, type: 'POST', data: {
                    lockerId: data.lockerId,
                    action: 'like2unlock_loader',
                    hash: data.contentHash
                }
            }
        }

        $target.removeClass("onp-like2unlock-call");
        if ( !window.onpl2u.lockerOptions[lockId] ) $target.next().remove();

        $target.tolike( options );
    };    
    
    // adding support for dynamic themes
    
    var bindFunction = function(){
        if ( !window.onpl2u.dynamicThemeSupport ) return;

        if ( window.onpl2u.dynamicThemeEvent != '' ) {
            $(document).bind(window.onpl2u.dynamicThemeEvent, function(){
                window.onpl2u.lockers();
            });
        } else {
            $(document).ajaxComplete(function() {
                window.onpl2u.lockers();
            });
        }
    };

    if ( window.onpl2u.dynamicThemeSupport ) {
        bindFunction();
    } else {
        $(function(){ bindFunction(); });
    }

})(jQuery);

/*!
 * Creater Script for Like 2 Unlock
 * 
 * Created by the Like 2 Unlock (c) OnePress Ltd
 * for jQuery: http://onepress-media.com/plugin/like-2-unlock-for-facebook/get
 * for Wordpress: http://onepress-media.com/plugin/like-2-unlock-for-facebook-wordpress/get
*/
(function($){ 
    $(function(){ window.onpl2u.lockers(); });
})(jQuery);
