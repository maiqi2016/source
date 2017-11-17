var app = angular.module('kkApp', []);

/**
 * Service
 */
app.service('service', ['$http', '$q', function ($http, $q) {

    var that = this;

    // CSRF
    this.csrfKey = document.getElementsByName('csrf-param')[0].getAttribute('content');
    this.csrfToken = document.getElementsByName('csrf-token')[0].getAttribute('content');

    // Show message
    this.debug = function (message, type) {

        type = type || 'error';

        console.log('%c' + type.ucFirst() + ':', 'color:red;');
        console.log(message);

        return false;
    };

    // Array.prototype.each
    Array.prototype.each = function (callback) {
        callback = callback || Function.K;
        var a = [];
        var args = Array.prototype.slice.call(arguments, 1);
        for (var i = 0; i < this.length; i++) {
            var res = callback.apply(this, [this[i], i].concat(args));
            if (res !== null) {
                a.push(res);
            }
        }
        return a;
    };

    // Array.prototype.contains
    Array.prototype.contains = function (element) {
        var self = this;
        for (var i = 0; i < self.length; i++) {
            if (self[i] === element) {
                return true;
            }
        }
        return false;
    };

    // Array.prototype.unique
    Array.prototype.unique = function () {
        var ra = [];
        for (var i = 0; i < this.length; i++) {
            if (!ra.contains(this[i])) {
                ra.push(this[i]);
            }
        }
        return ra;
    };

    // Array.prototype.intersect
    Array.prototype.intersect = function (arr) {
        return this.unique().each(function (o) {
            return arr.contains(o) ? o : null;
        });
    };

    // Array.prototype.minus
    Array.prototype.minus = function (arr) {
        return this.unique().each(function (o) {
            return arr.contains(o) ? null : o;
        });
    };

    // Array.prototype.union
    Array.prototype.union = function (arr) {
        return this.concat(arr).unique();
    };

    // Array.prototype.complement
    Array.prototype.complement = function (arr) {
        return this.union(arr).minus(this.intersect(arr));
    };

    // Array.prototype.remove
    Array.prototype.remove = function (val) { // 删除指定值
        var index = this.indexOf(val);
        if (index > -1) {
            this.splice(index, 1);
        }
        return this;
    };

    // Array.prototype.swap
    Array.prototype.swap = function (first, last) {
        this[first] = this.splice(last, 1, this[first])[0];
        return this;
    };

    // Array.prototype.up
    Array.prototype.up = function (index) {
        if (index === 0) {
            return this;
        }
        return this.swap(index, index - 1);
    };

    // Array.prototype.down
    Array.prototype.down = function (index) {
        if (index === this.length - 1) {
            return this;
        }
        return this.swap(index, index + 1);
    };

    // String.prototype.trim
    String.prototype.trim = function (str) {
        str = str ? ('\\s' + str) : '\\s';
        return this.replace(new RegExp('(^[' + str + ']*)|([' + str + ']*$)', 'g'), '');
    };

    // String.prototype.leftTrim
    String.prototype.leftTrim = function (str) {
        str = str ? ('\\s' + str) : '\\s';
        return this.replace(new RegExp('(^[' + str + ']*)', 'g'), '');
    };

    // String.prototype.rightTrim
    String.prototype.rightTrim = function (str) {
        str = str ? ('\\s' + str) : '\\s';
        return this.replace(new RegExp('([' + str + ']*$)', 'g'), '');
    };

    // String.prototype.lengths (mb length)
    String.prototype.lengths = function () {

        var length = 0;
        for (var i = 0; i < this.length; i++) {
            if (0 !== (this.charCodeAt(i) & 0xff00)) {
                length++;
            }
            length++;
        }

        return length;
    };

    // String.prototype.pad
    String.prototype.pad = function (padStr, length, type) {

        padStr = padStr.toString();
        type = type || 'left';

        if (this.length >= length || !['left', 'right', 'both'].exists(type)) {
            return this;
        }
        var last = (length - this.length) % padStr.length;

        var padNum, _padNum;
        padNum = _padNum = Math.floor((length - this.length) / padStr.length);

        if (last > 0) {
            padNum += 1;
        }

        var _that = this;
        for (var i = 0; i < padNum; i++) {
            if (i === _padNum) {
                padStr = padStr.substr(0, last);
            }
            switch (type) {
                case 'left':
                    _that = padStr + _that;
                    break;
                case 'right':
                    _that += padStr;
                    break;
                case 'both':
                    _that = (0 === i % 2) ? (padStr + _that) : (_that + padStr);
                    break;
            }
        }

        return _that;
    };

    // String.prototype.fill
    String.prototype.fill = function (fillstr, length, type) {

        fillstr = fillstr.toString();
        type = type || 'left';

        if (length < 1 || !['left', 'right', 'both'].exists(type)) {
            return this;
        }

        var _that = this;
        for (var i = 0; i < length; i++) {
            switch (type) {
                case 'left':
                    _that = fillstr + _that;
                    break;
                case 'right':
                    _that += fillstr;
                    break;
                case 'both':
                    _that = (0 === i % 2) ? (fillstr + _that) : (_that + fillstr);
                    break;
            }
        }

        return _that;
    };

    // String.prototype.repeat
    String.prototype.repeat = function (num) {
        num = (isNaN(num) || num < 1) ? 1 : num + 1;
        return new Array(num).join(this)
    };

    // String.prototype.ucWords
    String.prototype.ucWords = function () {
        return this.replace(/\b(\w)+\b/g, function (word) {
            return word.replace(word.charAt(0), word.charAt(0).toUpperCase());
        });
    };

    // String.prototype.ucFirst
    String.prototype.ucFirst = function () {
        return this.replace(this.charAt(0), this.charAt(0).toUpperCase());
    };

    // String.prototype.lcFirst
    String.prototype.lcFirst = function () {
        return this.replace(this.charAt(0), this.charAt(0).toLowerCase());
    };

    // String.prototype.bigHump
    String.prototype.bigHump = function (split) {
        split = split || '-';
        var reg = new RegExp(split, 'g');
        return this.replace(reg, ' ').ucWords().replace(/ /g, '');
    };

    // String.prototype.smallHump
    String.prototype.smallHump = function (split) {
        return this.bigHump(split).lcFirst();
    };

    // Date.prototype.format
    // yyyy-MM-dd hh:mm:ss
    Date.prototype.format = function (fmt) {
        var o = {
            "M+": this.getMonth() + 1,
            "d+": this.getDate(),
            "h+": this.getHours(),
            "m+": this.getMinutes(),
            "s+": this.getSeconds(),
            "q+": Math.floor((this.getMonth() + 3) / 3),
            "S": this.getMilliseconds()
        };

        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        }

        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }

        return fmt;
    };

    // AlloyTouch.prototype.ratio
    AlloyTouch.prototype.ratio = function (moveTo, changePx, minDelta) {

        changePx = changePx || 30;
        minDelta = minDelta || 0;

        var baseTranX = this.currentPage * this.step * -1;
        var delta = moveTo - baseTranX;

        var to;
        var moveStep = Math.abs(Math.floor(delta / this.step));
        moveStep = moveStep || 1;

        if (moveTo < this.min) {
            to = this.min + minDelta;
        } else if (moveTo > this.max) {
            to = this.max;
        } else if (Math.abs(delta) < changePx) {
            to = baseTranX;
        } else if (delta > 0) {
            to = baseTranX + this.step * moveStep;
        } else {
            to = baseTranX - this.step * moveStep;
        }

        return {
            moveTo: moveTo,
            to: to,
            realDelta: delta,
            delta: delta % this.step,
            index: to / this.step * -1
        };
    };

    // Is array
    this.isArray = function (val) {
        if (null === val) {
            return false;
        }
        return typeof val === 'object' && val.constructor === Array;
    };

    // Is object
    this.isObject = function (val) {
        if (null === val) {
            return false;
        }
        return typeof val === 'object' && val.constructor === Object;
    };

    // Is json
    this.isJson = function (val) {
        if (null === val) {
            return false;
        }
        return typeof val === 'object' && Object.prototype.toString.call(val).toLowerCase() === '[object object]';
    };

    // Is string
    this.isString = function (val) {
        if (null === val) {
            return false;
        }
        return typeof val === 'string' && val.constructor === String;
    };

    // Is numeric
    this.isNumeric = function (val) {
        if (null === val || '' === val) {
            return false;
        }
        return !isNaN(val);
    };

    // Is boolean
    this.isBoolean = function (val) {
        if (null === val) {
            return false;
        }
        return typeof val === 'boolean' && val.constructor === Boolean;
    };

    // Is function
    this.isFunction = function (val) {
        if (null === val) {
            return false;
        }
        return typeof val === 'function' && Object.prototype.toString.call(val).toLowerCase() === '[object function]';
    };

    // Is empty
    this.isEmpty = function (val, outNumZero) {
        if (typeof val === 'undefined' || val === null) {
            return true;
        }
        if (that.isNumeric(val) && outNumZero) {
            return Number(val) === 0;
        } else if (that.isString(val)) {
            return val.trim() === '';
        } else if (that.isJson(val)) {
            return that.jsonLength(val) === 0;
        } else if (that.isArray(val) || that.isObject(val)) {
            return val.length === 0;
        }
        return !val;
    };

    // Get timestamp
    this.time = function (sec) {
        var time = new Date().getTime();
        return sec ? Math.ceil(time / 1000) : time;
    };

    // Get json length
    this.jsonLength = function (json) {
        var length = 0;
        var i;
        for (i in json) {
            length++;
        }
        return length;
    };

    // Get document offset
    this.offset = function (obj) {
        return {
            left: obj.offsetLeft,
            top: obj.offsetTop,
            width: obj.offsetWidth,
            height: obj.offsetHeight
        };
    };

    // Listen scroll reach to bottom
    this.reachBottom = function (callback, prefixHeight) {

        $(window).scroll(function () {

            var scrollTop = $(window).scrollTop();
            var documentHeight = $(document).height();
            var windowHeight = $(window).height();

            prefixHeight = parseInt(prefixHeight) || 0;
            if ((prefixHeight + scrollTop) >= (documentHeight - windowHeight)) {
                callback(scrollTop, documentHeight, windowHeight);
            }
        });
    };

    // Listen scroll for to top
    this.goToTop = function (button, screenNum, time) {

        that.tap(button, function () {
            $('body, html').animate({scrollTop: 0}, time || 500);
        });

        button = $(button);
        $(window).scroll(function () {

            var scrollTop = $(window).scrollTop();
            var windowHeight = $(window).height();

            screenNum = parseInt(screenNum) || 1;

            if (scrollTop >= (windowHeight * screenNum)) {
                button.fadeIn();
            } else {
                button.fadeOut();
            }
        });
    };

    // Send post base on ajax
    this.ajaxPost = function (uri, params, errorCallback) {

        var defer = $q.defer();
        params[that.csrfKey] = this.csrfToken;

        $http({
            method: 'POST',
            url: requestUrl + uri,
            data: params
        }).then(function (result) {

            if (result.data.state) {
                defer.resolve(result.data);
            } else {
                defer.reject(result.data);
            }

        }, function () {
            var error = 'An error occurred, try again later.';
            if (errorCallback) {
                errorCallback(error);
            } else {
                that.debug(error);
            }
        });

        return defer.promise;
    };

    // Validate
    this.check = function (param, type) {

        var items = {
            phone: /^[\d]([\d\- ]+)?[\d]$/
        };

        return !!items[type].test(param);
    };

    // Parse query string
    this.parseQueryString = function (url, hostPart) {

        url = url || location.href;
        url = decodeURIComponent(url);
        hostPart = hostPart || false;

        if (url.indexOf('?') === -1) {
            if (url.indexOf('http') === 0) {
                url = url + '?';
            } else {
                url = '?' + url;
            }
        }

        var items = {};
        var urlArr = url.split('?');
        if (hostPart) {
            items['host_part'] = urlArr[0];
        }

        url = urlArr[1];
        if (that.isEmpty(url)) {
            return items;
        }

        if (url.indexOf('#')) {
            url = url.split('#')[0];
        }

        url = url.split('&');
        $.each(url, function (key, item) {
            item = item.split('=');
            items[item[0]] = item[1];
        });

        return items;
    };

    // Build query with json object
    this.jsonBuildQuery = function (obj) {
        var query = '', name, value, fullSubName, subName, subValue, innerObj, i;

        for (name in obj) {
            if (!obj.hasOwnProperty(name)) {
                continue;
            }
            value = obj[name];

            if (value instanceof Array) {
                for (i = 0; i < value.length; ++i) {
                    subValue = value[i];
                    fullSubName = name + '[' + i + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += jsonToUrl(innerObj) + '&';
                }
            } else if (value instanceof Object) {
                for (subName in value) {
                    if (!value.hasOwnProperty(subName)) {
                        continue;
                    }
                    subValue = value[subName];
                    fullSubName = name + '[' + subName + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += jsonToUrl(innerObj) + '&';
                }
            } else if (value !== undefined && value !== null) {
                query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
            }
        }

        return query.length ? query.substr(0, query.length - 1) : query;
    };

    // Supplement params from current location
    this.supplyParams = function (href, params) {
        var queryParams = that.parseQueryString();
        var queryString = '';
        $.each(params || [], function (k, v) {
            if (typeof queryParams[v] !== 'undefined') {
                queryString += '&' + v + '=' + queryParams[v];
            }
        });

        if (href.indexOf('?')) {
            href += queryString;
        } else {
            href = href + '?' + queryString.leftTrim('&')
        }

        return href;
    };

    // Set params to url
    this.setParams = function (params, url) {
        var queryString = '';
        $.each(params || {}, function (k, v) {
            queryString += '&' + k + '=' + v;
        });

        if (url.indexOf('?')) {
            url += queryString;
        } else {
            url = url + '?' + queryString.leftTrim('&')
        }

        return url;
    };

    // Unset params from url
    this.unsetParams = function (params, url) {
        url = url || location.href;
        var queryParams = that.parseQueryString(url, true);

        $.each(params || [], function (k, v) {
            if (typeof queryParams[v] !== 'undefined') {
                delete queryParams[v];
            }
        });

        var host = queryParams.host_part;
        delete queryParams.host_part;

        url = host + '?' + decodeURI(that.jsonBuildQuery(queryParams));

        return url;
    };

    // Count px of padding and margin
    this.pam = function (obj, length, type, pos) {

        length = length || 1;
        type = type || ['margin', 'padding'];
        pos = pos || ['left', 'right'];

        var px = 0;

        type.each(function (m) {
            pos.each(function (n) {
                px += parseInt(obj.css(m + '-' + n)) * length;
            });
        });

        return px;
    };

    // Get device version
    this.device = function () {
        var u = navigator.userAgent;
        return {
            ie: u.indexOf('Trident') > -1,
            opera: u.indexOf('Presto') > -1,
            chrome: u.indexOf('AppleWebKit') > -1,
            firefox: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') === -1,
            mobile: !!u.match(/AppleWebKit.*Mobile.*/),
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1,
            iPhone: u.indexOf('iPhone') > -1,
            iPad: u.indexOf('iPad') > -1,
            webApp: u.indexOf('Safari') === -1,
            version: navigator.appVersion
        };
    }();

    // Tap
    this.tap = function (target, action, options) {

        if (target.jquery) {
            target = target[0];
        }

        if (that.device.mobile) {
            options = options || {};
            options.singleTap = action;
            return new AlloyFinger(target, options);
        }

        $(target).click(action);

        return false;
    };

    // Rand
    this.rand = function (end, begin) {
        begin = begin || 0;

        var rank = begin;
        var _end = end - rank;

        return parseInt(new Number(Math.random() * _end).toFixed(0)) + rank;
    };

    // Bind key down
    this.keyBind = function (num, callback, obj, ctrl) {
        obj = obj || $(document);
        obj.unbind('keydown').bind('keydown', function (event) {
            if (ctrl) {
                if (event.keyCode === num && event.ctrlKey && callback) {
                    callback();
                }
            } else {
                if (event.keyCode === num && callback) {
                    callback();
                }
            }
        });
    };

    // Json length
    this.jsonLength = function (json) {
        var length = 0;
        $.each(json, function () {
            length++;
        });
        return length;
    };

    // Is IE
    that.isIE = function () {
        return /msie/.test(navigator.userAgent.toLowerCase());
    };

    // Json to String
    this.jsonToString = function (json) {
        if (!that.isIE() && JSON !== 'undefined') {
            return JSON.stringify(json);
        } else {
            var arr = [];
            $.each(json, function (key, val) {
                var next = '\'' + key + '\':\'';
                next += $.isPlainObject(val) ? that.jsonToString(val) : val;
                next += '\'';
                arr.push(next);
            });
            return '{' + arr.join(', ') + '}';
        }
    };

    // Dump project
    this.dump = function (val, old) {
        if (typeof old === 'undefined') {
            old = true;
        }
        if (that.isObject(val)) {
            if (!that.isIE() && typeof JSON !== 'undefined') {
                val = JSON.stringify(val);
            } else {
                var arr = [];
                $.each(val, function (key, val) {
                    var next = key + ':';
                    next += $.isPlainObject(val) ? that.jsonToString(val) : val;
                    arr.push(next);
                });
                val = '{' + arr.join(',') + '}';
            }
        }
        old ? alert(val) : that.debug(val);
    };

    // Is Array
    this.isArray = function (val) {
        if (null === val) {
            return false;
        }
        return typeof val === 'object' && val.constructor === Array;
    };

    // Is Object
    this.isObject = function (val) {
        if (null === val) {
            return false;
        }
        return typeof val === 'object' && val.constructor === Object;
    };

    // Is Json
    this.isJson = function (val) {
        if (null === val) {
            return false;
        }
        return typeof val === 'object' && Object.prototype.toString.call(val).toLowerCase() === '[object object]';
    };

    // Is String
    this.isString = function (val) {
        if (null === val) {
            return false;
        }
        return typeof val === 'string' && val.constructor === String;
    };

    // Is Numeric
    this.isNumeric = function (val) {
        if (null === val || '' === val) {
            return false;
        }
        return !isNaN(val);
    };

    // Is Boolean
    this.isBoolean = function (val) {
        if (null === val) {
            return false;
        }
        return typeof val === 'boolean' && val.constructor === Boolean;
    };

    // Is Function
    this.isFunction = function (val) {
        if (null === val) {
            return false;
        }
        return typeof val === 'function' && Object.prototype.toString.call(val).toLowerCase() === '[object function]';
    };

    // Is empty
    this.isEmpty = function (val, outNumZero) {
        if (typeof val === 'undefined' || val === null) {
            return true;
        }
        if (that.isNumeric(val) && outNumZero) {
            return Number(val) === 0;
        } else if (that.isString(val)) {
            return val.trim() === '';
        } else if (that.isJson(val)) {
            return that.jsonLength(val) === 0;
        } else if (that.isArray(val) || that.isObject(val)) {
            return val.length === 0;
        }
        return !val;
    };

    // Cookie
    this.cookie = {
        set: function (name, value, time, domain) {
            var expires = new Date();
            if (!time) {
                time = 86400 * 365;
            }
            expires.setTime(expires.getTime() + time * 1000);
            if (that.isEmpty(domain)) {
                domain = '';
            } else {
                domain = '; domain=' + domain;
            }
            document.cookie = name + '=' + escape(value) + '; expires=' + expires.toGMTString() + '; path=/' + domain;
        },
        get: function (name) {
            var cookieArray = document.cookie.split('; ');
            for (var i = 0; i < cookieArray.length; i++) {
                var arr = cookieArray[i].split('=');
                if (arr[0] === name) {
                    return unescape(arr[1]);
                }
            }
            return false;
        },
        delete: function (name, domain) {
            if (that.isEmpty(domain)) {
                domain = '';
            } else {
                domain = '; domain=' + domain;
            }
            document.cookie = name + '=; expires=' + (new Date(0)).toGMTString() + '; path=/' + domain;
        }
    };

    // Sleep
    this.sleep = function (second) {
        var start = new Date();
        while (new Date() - start < second) {
        }
    };
}]);

/**
 * Config
 */
app.config(['$httpProvider', function ($httpProvider) {

    var jsonToUrl = function (obj) {
        var query = '', name, value, fullSubName, subName, subValue, innerObj, i;

        for (name in obj) {
            if (!obj.hasOwnProperty(name)) {
                continue;
            }
            value = obj[name];

            if (value instanceof Array) {
                for (i = 0; i < value.length; ++i) {
                    subValue = value[i];
                    fullSubName = name + '[' + i + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += jsonToUrl(innerObj) + '&';
                }
            } else if (value instanceof Object) {
                for (subName in value) {
                    if (!value.hasOwnProperty(subName)) {
                        continue;
                    }
                    subValue = value[subName];
                    fullSubName = name + '[' + subName + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += jsonToUrl(innerObj) + '&';
                }
            } else if (value !== undefined && value !== null) {
                query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
            }
        }

        return query.length ? query.substr(0, query.length - 1) : query;
    };

    // Format query data
    $httpProvider.defaults.transformRequest = function (obj) {
        return jsonToUrl(obj);
    };

    // Statement ajax request
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
}]);

/**
 * Directive repeat done
 */
app.directive('kkRepeatDone', ['$timeout', function ($timeout) {

    var command = {
        scope: true,
        restrict: 'A'
    };

    command.link = function (scope, elem, attr) {

        /**
         * @param attr.kkRepeatDone
         */
        if (scope.$last) {
            $timeout(function () {
                var fn = scope.$eval(attr.kkRepeatDone);
                fn();
            }, 0);
        }
    };

    return command;
}]);

/**
 * Directive tap replace ng-click
 */
app.directive('kkTap', ['service', '$parse', function (service, $parse) {

    var command = {
        restrict: 'A'
    };

    command.compile = function ($elem, attr) {
        /**
         * @param attr.kkTap
         */
        var fn = $parse(attr.kkTap);
        return function ngEventHandler(scope, elem) {
            service.tap(elem[0], function (event) {
                event = event || window.event;
                var callback = function () {
                    fn(scope, {
                        $event: event,
                        $elem: elem
                    });
                };
                scope.$apply(callback);
            });
        };
    };

    return command;
}]);

/**
 * Directive spread
 */
app.directive('kkSpread', ['$timeout', 'service', function ($timeout, service) {

    var command = {
        scope: true,
        restrict: 'A',
        template: '<i class="kk-animate"></i><span ng-transclude></span>',
        transclude: true
    };

    command.link = function (scope, elem, attr) {

        /**
         * @param attr.kkSpread
         */
        service.tap(elem[0], function (e) {

            var i = elem.find('i');
            i.removeClass('kk-spread').removeAttr('style');

            e = e.changedTouches[0];

            elem.css({
                position: 'relative',
                overflow: 'hidden'
            });

            var multiple = 2;
            var cal = function (type, b) {
                if ($.inArray(type, ['x', 'y']) === -1) {
                    return null;
                }
                var px;
                if (type === 'x') {
                    type = e.pageX;
                    px = pos.left;
                } else {
                    type = e.pageY;
                    px = pos.top;
                }

                return type - px - b / 2 * multiple;
            };

            var w = elem.width(),
                h = elem.height(),
                pos = elem.offset(),

                left = cal('x', w),
                top = cal('y', h);

            switch (parseInt(attr.kkSpread)) {
                case 1:
                    left = cal('x', w * 2);
                    top = cal('y', h * 2);
                    break;

                case 2:
                    left = w;
                    top = cal('y', h * 2);
                    break;

                case 3:
                    left = w;
                    top = h;
                    break;

                case 4:
                    left = cal('x', w * 2);
                    top = h;
                    break;
            }

            i.addClass('kk-spread').css({
                width: w * multiple,
                height: h * multiple,
                left: left,
                top: top
            });
        });
    };

    return command;
}]);

/**
 * Directive focus
 */
app.directive('kkFocus', ['service', function (service) {

    var command = {
        scope: true,
        restrict: 'A'
    };

    command.link = function (scope, elem, attr) {

        /**
         * @param attr.kkFocus
         * @param attr.stayTime
         * @param attr.playTime
         * @param attr.id
         * @param attr.numberTpl
         * @param attr.pointCurrent
         */
        var that = {};

        that.scroll = elem.children();
        that.img = that.scroll.find('img');
        that.point = $(attr.kkFocus);

        that.scroll.css({
            width: 100 * that.img.length + '%'
        });

        that.img.css({
            width: 100 / that.img.length + '%'
        });

        that.scrollWidth = that.img.width();

        that.stayTime = attr.stayTime || 5000;
        that.playTime = attr.playTime || 500;

        if (!attr.id) {
            return service.debug('[kk-focus] Current element must has attribute `id`!');
        }

        var changeCurrent = function (index) {
            index = index || 0;
            var tpl = attr.numberTpl;
            if (tpl) {
                tpl = tpl.replace(/{TOTAL}/g, that.img.length);
                tpl = tpl.replace(/{NOW}/g, index + 1);
                that.point.html(tpl);
            } else {
                var currentCss = attr.pointCurrent || 'current';
                that.point.children().removeClass(currentCss);
                that.point.children().eq(index).addClass(currentCss);
            }
        };

        changeCurrent();
        Transform(that.scroll[0], true);

        try {
            var touch = new AlloyTouch({
                touch: '#' + attr.id,
                vertical: false,
                target: that.scroll[0],
                property: 'translateX',
                min: that.scrollWidth * -(that.img.length - 1),
                max: 0,
                step: that.scrollWidth,
                inertia: false,
                sensitivity: 1,

                touchStart: function () {
                    clearInterval(that.plan);
                },

                touchMove: function () {
                    this.preventDefault = true;
                },

                touchEnd: function (event, to) {

                    this.preventDefault = false;

                    var obj = this.ratio(to);
                    this.to(obj.to, that.playTime);
                    that.auto(obj.to);

                    return false;
                },

                animationEnd: function () {
                    changeCurrent(this.currentPage);
                }
            });
        } catch (e) {
            service.debug(e, 'error');
        }

        that.auto = function (v) {

            v = v || touch.max;

            that.plan = setInterval(function () {
                v -= touch.step;
                v = (v < touch.min) ? touch.max : v;
                touch.to(v, that.playTime);
            }, that.stayTime);
        };

        that.auto();
    };

    return command;
}]);

/**
 * Directive focus camel
 */
app.directive('kkFocusCamel', ['service', function (service) {

    var command = {
        scope: true,
        restrict: 'A'
    };

    command.link = function (scope, elem, attr) {

        /**
         * @param attr.id
         * @param attr.scale
         */
        var that = {};

        if (!attr.id) {
            return service.debug('[kk-focus-camel] Current element must has attribute `id`!');
        }

        // Var
        that.camel = elem.children();
        that.img = that.camel.children();

        that.width = that.img.width();
        that.number = that.img.length;
        that.pam = service.pam(that.img);

        that.allPam = service.pam(that.camel) + that.pam * that.number;
        that.half = (elem.width() - that.width) / 2;
        that.scale = parseFloat(attr.scale) || .9;

        that.first = -(that.width + that.pam);
        that.last = -(that.width + that.pam) * (that.number - 2);

        // Transform
        Transform(that.camel[0], true);
        that.camel[0].translateX = -(that.width + that.pam);

        that.img.each(function (k, v) {
            Transform(v, true);
            v.translateX = that.half - service.pam(that.img, 1, null, ['left']);
            v.scaleX = v.scaleY = that.scale;
        });

        that.img[1].scaleX = that.img[1].scaleY = 1;

        // Diy to
        var moveTo = function (index, time) {

            time = time || 200;
            index = index || 2;

            if (index < 1) {
                index = 1;
            } else if (index >= that.number) {
                index = that.number - 1;
            }

            touch.to(-touch.step * index, time);
            that.img.each(function (k, v) {
                v.scaleX = v.scaleY = (k === index ? 1 : that.scale);
            });
        };

        // Core
        try {
            var touch = new AlloyTouch({
                touch: '#' + attr.id,
                vertical: false,
                target: that.camel[0],
                property: 'translateX',
                min: that.width * -(that.number) - that.allPam,
                max: 0,
                sensitivity: 1,
                step: that.width + that.pam,
                inertia: false,

                pressMove: function (event, to) {

                    var obj = this.ratio(to, this.step);
                    if (!obj.delta) {
                        return false;
                    }

                    var current = obj.index;
                    var next = obj.delta < 0 ? (current + 1) : (current - 1);
                    var percent = (1 - that.scale) * Math.abs(obj.delta) / this.step;

                    if (that.img[current]) {
                        that.img[current].scaleX = that.img[current].scaleY = 1 - percent;
                    }

                    if (that.img[next]) {
                        that.img[next].scaleX = that.img[next].scaleY = that.scale + percent;
                    }
                },

                touchMove: function () {
                    this.preventDefault = true;
                },

                touchEnd: function (event, to) {
                    this.preventDefault = false;

                    var obj = this.ratio(to, null, this.step);
                    if (obj.to > that.first) {
                        obj.to = that.first;
                        obj.index += 1;
                    } else if (obj.to < that.last) {
                        obj.to = that.last;
                        obj.index -= 1;
                    }

                    moveTo(obj.index);

                    return false;
                }
            });
        } catch (e) {
            service.debug(e, 'error');
        }

        // Init
        moveTo(2);
    };

    return command;
}]);

/**
 * Directive focus card
 */
app.directive('kkFocusCard', ['service', '$timeout', function (service, $timeout) {

    var command = {
        scope: true,
        restrict: 'A'
    };

    command.link = function (scope, elem, attr) {

        /**
         * @param attr.kkFocusCard
         * @param attr.smallScale
         * @param attr.smallTranX
         * @param attr.smallTranY
         * @param attr.zIndex
         * @param attr.time
         */

        if (!attr.id) {
            return service.debug('[kk-focus-card] Current element must has attribute `id`!');
        }

        var big = elem.find('div:first'),
            small = elem.find('ul'),
            firstLi = small.find('li:first'),

            zIndex = attr.zIndex || 99,
            smallScale = attr.smallScale || .9,
            smallTranX = attr.smallTranX || 55,
            smallTranY = attr.smallTranY || 10;

        // 复位到小图
        var toSmall = function (item) {
            item.jquery && (item = item[0]);
            item.scaleX = item.scaleY = smallScale;
            item.translateX = smallTranX;
            item.translateY = smallTranY;
        };

        // 复位到大图
        var toBig = function (item) {
            item.jquery && (item = item[0]);
            item.scaleX = item.scaleY = 1;
            item.translateX = item.translateY = 0;
        };

        // 动画到大图
        var smallToBig = function (item) {

            var tickID;
            item.jquery && (item = item[0]);

            var toTick = function () {
                if (item.scaleX >= 1 || item.translateX <= 0) {
                    cancelAnimationFrame(tickID);
                    return false;
                }
                var step = 10;
                item.scaleX += (1 - smallScale) / step;
                item.scaleY += (1 - smallScale) / step;
                item.translateX -= smallTranX / step;
                item.translateY -= smallTranY / step;

                tickID = requestAnimationFrame(toTick);
            };
            toTick();
        };

        // 初始化
        big.html(firstLi.html());
        small.append(firstLi);

        big.addClass('animated');
        Transform(big[0], true);

        var li = small.children();
        li.each(function (i, item) {
            Transform(item, true);
            $(item).css('z-index', zIndex + li.length - i).addClass('animated');
            toSmall(item);
        });

        var animateTime = 800;

        // 下一张
        var next = function (ami) {

            ami = ami || 'fadeOutLeft';
            var first = small.children().first();
            big.addClass(ami);

            setTimeout(function () {
                smallToBig(first);
            }, animateTime / 2);

            setTimeout(function () {
                big.css('opacity', 1).html(first.html()).removeClass(ami);
                toBig(big);
                small.append(first);

                var li = small.children();
                li.each(function (i, item) {
                    $(item).css('z-index', zIndex + li.length - i);
                });
                toSmall(first);

                auto();
            }, animateTime + 10);



        };

        //上一张
        var prev = function () {
            var ulLast = small.children().last(),
                lastTwo = ulLast.prev();
            toSmall(big);
            small.prepend(ulLast);
            toBig(big);
            var li = small.children();
            li.each(function (i, item) {
                $(item).css('z-index', zIndex + li.length - i);
            });
            big.html(lastTwo.html());
            big.addClass('fadeInLeft');
            setTimeout(function () {
                big.removeClass('fadeInLeft');
            }, 1000);
            big.css('opacity', 1);
            auto();

        }
        // 自动轮播
        var run;
        var auto = function () {
            run && clearInterval(run);
            run = setInterval(function () {
                next();
            }, attr.time || 3000);
        };
        setTimeout(function () {
            auto();
        },3000);

        // 手动轮播
        var width = big.find('img').width();
        new AlloyTouch({
            touch: '#focus-card',
            vertical: false,
            target: big[0],
            property: "translateX",
            inertia: false,
            sensitivity: 1,
            min: width * -1,
            max: 0,

            change: function (value) {
                var v = Math.abs(value);
                v = v > width ? width : v;
                $(this.target).css('opacity', 1 - (v / width) * 0.7);
            },

            touchStart: function () {
                this.preventDefault = true;
                clearInterval(run);
            },

            touchEnd: function (evt, value) {
                this.preventDefault = false;

                if (value >= -80 && value <= 40) {
                    this.to(this.max, 100);
                    auto();
                    return false;
                }

                if (value < -80) {
                    next();
                } else if (value > 40) {
                    prev();
                }

                return false;
            }
        });
    };

    return command;
}]);

/**
 * Directive scroll
 */
app.directive('kkScroll', ['service', '$timeout', function (service, $timeout) {

    var command = {
        scope: true,
        restrict: 'A'
    };

    command.link = function (scope, elem, attr) {

        /**
         * @param attr.id
         * @param attr.kkScroll
         * @param attr.callbackMove
         */
        var that = {};

        if (!attr.id) {
            return service.debug('[kk-scroll] Current element must has attribute `id`!');
        }

        that.scroll = elem.children();
        that.img = that.scroll.children();
        that.pam = service.pam(that.scroll) + service.pam(that.img, that.img.length);

        that.offset = parseInt(attr.kkScroll) ? parseInt(attr.kkScroll) : 0;
        that.offset = window.innerWidth - that.pam - that.offset;

        Transform(that.scroll[0], true);

        try {
            new AlloyTouch({
                touch: '#' + attr.id,
                vertical: false,
                target: that.scroll[0],
                property: 'translateX',
                min: that.img.width() * -(that.img.length) + that.offset,
                max: 0,
                sensitivity: 1,

                touchMove: function () {
                    this.preventDefault = true;
                },

                touchEnd: function () {
                    this.preventDefault = false;
                },

                change: function (value) {
                    var min = Math.abs(this.min);
                    $timeout(function () {
                        var fn = scope.$eval(attr.callbackChange);
                        fn(that.img, value, min);
                    }, 0);
                }
            });
        } catch (e) {
            service.debug(e, 'error');
        }
    };

    return command;
}]);

/**
 * Directive sms
 */
app.directive('kkSms', ['service', function (service) {

    var command = {
        scope: true,
        restrict: 'A'
    };

    command.link = function (scope, elem, attr) {

        /**
         * @param attr.time
         * @param attr.type
         * @param attr.kkSms
         */
        var time = attr.time || 60;
        var type = attr.type;
        var uri = 'general/ajax-sms';

        service.tap(elem[0], function () {

            // disabled
            if (typeof elem.attr('disabled') !== 'undefined') {
                return null;
            }

            scope.loading(true);

            var data = {
                api: uri,
                post: {
                    phone: attr.kkSms,
                    type: type
                }
            };

            data.success = function () {
                scope.loading(false);
                elem.attr('disabled', 'disabled');

                var oldText = elem.html();
                var newText = '<i>' + time + '</i>秒后可重发';

                elem.html(newText);

                var obj = elem.find('i');
                var smsTime = setInterval(function () {
                    var sec = parseInt(obj.text());
                    if (sec <= 1) {
                        clearInterval(smsTime);
                        elem.html(oldText);
                        elem.removeAttr('disabled');

                        return null;
                    }
                    obj.text(sec - 1);
                }, 1000);
            };

            data.fail = function (result) {
                scope.message(result.info);
            };

            scope.request(data);
        });
    };

    return command;
}]);

/**
 * Directive menu
 */
app.directive('kkMenu', ['service', function (service) {

    var command = {
        scope: true,
        restrict: 'A'
    };

    command.link = function (scope, elem, attr) {

        /**
         * @param attr.posX
         * @param attr.posY
         * @param attr.kkMenu
         */







        var menu = $(attr.kkMenu);

        service.tap(elem[0], function () {
            var pos = service.offset(elem[0]);
            var padding = parseInt(menu.css('paddingLeft')) + parseInt(menu.css('paddingRight'));

            var posX = parseInt(attr.posX || 0);
            var posY = parseInt(attr.posY || 0);

            menu.css({
                left: pos.left - parseInt(menu.width()) - padding + parseInt(elem.width()) + posX,
                top: pos.top + pos.height + 15 + posY
            });

            menu.fadeToggle();
        });

        $(window).scroll(function () {
            menu.fadeOut('fast');
        });

        $('*').click(function (e) {
            var pos = service.offset(elem[0]);
            var x1 = pos.left,
                y1 = pos.top,
                x2 = pos.left + pos.width,
                y2 = pos.top + pos.height;

            var x = e.clientX;
            var y = e.clientY;

            if (!(x > x1 && x < x2 && y > y1 && y < y2)) {
                menu.fadeOut('fast');
            }
        });
    };

    return command;
}]);

/**
 * Directive menu-lm
 */
app.directive('kkMenuLm', ['service', '$timeout', function (service, $timeout) {

    var command = {
        scope: true,
        restrict: 'A'
    };
    var door = false;

    command.link = function (scope, elem, attr) {

        var animateShadeIn = 'fadeIn',
            animateShadeOut = 'fadeOut',
            animateMenuIn = 'fadeInRight',
            animateMenuOut = 'fadeOutRight';

        var menu = $('.menu-lm'),
            shade = $('<div class="shade hidden animated"></div>'),
            shapeF = $('.shape-fixed');

        menu.css('height', window.screen.height);
        $('body').append(shade);

        // 打开菜单
        var openMenu = function () {
            door = true;
            menu.removeClass('hidden ' + animateMenuOut).addClass(animateMenuIn);
            shade.removeClass('hidden ' + animateShadeOut).addClass(animateShadeIn);
            service.tap(shade, closeMenu);
        };

        // 关闭菜单
        var closeMenu = function () {
            door = false;
            menu.removeClass(animateMenuIn).addClass(animateMenuOut);
            shade.removeClass(animateShadeIn).addClass(animateShadeOut);
            $timeout(function () {
                menu.addClass('hidden');
                shade.addClass('hidden');
            }, 400);
        };

        service.tap(elem[0], function () {
            door ? closeMenu() : openMenu();
        });

        service.tap($('.menuclose')[0], function () {
            closeMenu();
        });
    };

    return command;
}]);

/**
 * Directive fixed box
 */
app.directive('kkFixed', ['service', function (service) {

    var command = {
        scope: true,
        restrict: 'A'
    };

    command.link = function (scope, elem, attr) {

        /**
         * @param attr.box
         * @param attr.kkFixed
         */
        var prefixHeight;
        if (isNaN(attr.kkFixed)) {
            prefixHeight = eval(attr.kkFixed);
        } else {
            prefixHeight = parseInt(attr.kkFixed);
        }

        var left = parseInt(attr.left) || 0;
        var top = parseInt(attr.top) || 0;
        var pos = service.offset(elem[0]);

        var fillBoxClass = attr.box || 'fixed-fill-box';
        var _fillBoxClass = '.' + fillBoxClass;

        $(window).scroll(function () {

            var scrollTop = $(window).scrollTop();

            if (prefixHeight + scrollTop >= pos.top + elem.height()) {
                elem.addClass('fixed-box');
                elem.css({
                    top: top,
                    left: left
                });

                if (!$(_fillBoxClass).length) {
                    var fillBox = $('<div></div>');
                    fillBox.addClass(fillBoxClass).css({
                        width: pos.width,
                        height: pos.height
                    });
                    elem.before(fillBox);
                }
            } else {
                elem.removeClass('fixed-box');
                $(_fillBoxClass).remove();
            }
        });
    };

    return command;
}]);

/**
 * Directive table card
 */
app.directive('kkTabCard', ['service', function (service) {

    var command = {
        scope: true,
        restrict: 'A'
    };

    command.link = function (scope, elem, attr) {

        /**
         * @param attr.element
         * @param attr.kkTabCard
         */
        var tabElements = elem.find(attr.element || '*');
        var tab = [];
        var tabElement = [];
        tabElements.each(function () {
            var tabDiv = $(this).attr('data-card');

            if (tabDiv) {
                tab.push($(tabDiv)[0]);
                tabElement.push(this);
            }
        });

        $(tabElement[0]).addClass(attr.kkTabCard);
        $(tab).hide();
        $(tab[0]).show();

        $.each(tabElement, function () {
            service.tap(this, function () {
                // action tab
                $(tabElement).removeClass(attr.kkTabCard);
                $(this).addClass(attr.kkTabCard);

                // action card
                var tabDiv = $(this).attr('data-card');
                $(tab).hide();
                $(tabDiv).fadeIn();
            });
        });
    };

    return command;
}]);

/**
 * Directive anchor
 */
app.directive('kkAnchor', ['service', function (service) {

    var command = {
        scope: true,
        restrict: 'A'
    };

    command.link = function (scope, elem, attr) {

        /**
         * @param attr.element
         * @param attr.kkAnchor
         */

        var anchorElements = elem.find(attr.element || '*');
        var anchor = [];
        var anchorElement = [];
        anchorElements.each(function () {
            var anchorDiv = $(this).attr('data-anchor');

            if (anchorDiv) {
                anchor.push($(anchorDiv)[0]);
                anchorElement.push(this);
            }
        });

        $(anchorElement[0]).addClass(attr.kkAnchor);

        $.each(anchorElement, function () {
            service.tap(this, function () {
                // action tab
                $(anchorElement).removeClass(attr.kkAnchor);
                $(this).addClass(attr.kkAnchor);

                // action card
                var anchorDiv = $(this).attr('data-anchor');
                $('body, html').animate({scrollTop: $(anchorDiv).offset().top - $(anchorDiv).height() / 2 + 4}, 500);
            });
        });
    };

    return command;
}]);

/**
 * Directive input cancel
 */
app.directive('kkInputCancel', ['service', function (service) {

    var command = {
        scope: true,
        restrict: 'A'
    };

    command.link = function (scope, elem, attr) {

        /**
         * @param attr.kkInputCancel
         */
        var input = $(attr.kkInputCancel);

        input.bind('focus', function () {
            elem.show();
        });

        service.tap(elem[0], function () {
            input.val(null).blur();
            elem.hide();
        });
    };

    return command;
}]);

/**
 * Directive ajax load
 */
app.directive('kkAjaxLoad', ['service', '$compile', function (service, $compile) {

    var command = {
        scope: true,
        restrict: 'A'
    };

    command.link = function (scope, elem, attr) {

        /**
         * @param attr.params
         * @param attr.kkAjaxLoad
         * @param attr.message
         */

        var lock = false;

        service.reachBottom(function () {
            if (lock) {
                return null;
            }
            lock = true;

            if (elem.attr('data-over')) {
                return null;
            }

            var page = parseInt(elem.attr('data-page'));
            page = page ? page : 2;

            var query = location.search.replace('?r=', '');
            query = query ? service.parseQueryString(query) : {};

            var data = attr.params;
            data = data ? service.parseQueryString(data) : {};
            data.page = page;

            data = $.extend({}, query, data);

            scope.request({
                api: attr.kkAjaxLoad,
                post: data,

                /**
                 * @param res.data.html
                 * @param res.data.over
                 */
                success: function (res) {
                    var over = function () {
                        elem.attr('data-over', true);
                        attr.message && scope.message(attr.message);
                        return null;
                    };

                    service.isEmpty(res.data.html) && over();

                    var tpl = $compile(res.data.html);
                    res.data.html = tpl(scope);

                    elem.append(res.data.html).attr('data-page', page + 1);
                    res.data.over && over();

                    lock = false;
                }
            });
        });
    };

    return command;
}]);

/**
 * Directive ajax upload
 */
app.directive('kkAjaxUpload', ['service', '$timeout', function (service, $timeout) {

    var command = {
        scope: true,
        restrict: 'A'
    };

    command.link = function (scope, elem, attr) {

        /**
         * @param attr.params
         * @param attr.kkAjaxUpload
         * @param attr.action
         * @param attr.callback
         */
        var data = attr.params ? service.parseQueryString(data) : {};
        data[service.csrfKey] = service.csrfToken;

        new AjaxUpload($(attr.kkAjaxUpload), {
            action: requestUrl + attr.action,
            name: 'ajax',
            autoSubmit: true,
            responseType: 'json',
            accept: '*',
            data: data,
            onChange: function () {
                scope.loading(true);
            },
            onComplete: function (file, response) {

                scope.loading(false);

                if (!response.state) {
                    return scope.message(response.info);
                }

                $timeout(function () {
                    var fn = scope.$eval(attr.callback);
                    fn(response.data);
                }, 0);
            }
        });
    };

    return command;
}]);

/**
 * Directive link
 */
app.directive('kkLink', ['service', function (service) {

    var command = {
        scope: true,
        restrict: 'A'
    };

    command.link = function (scope, elem, attr) {

        /**
         * @param attr.kkLink
         */
        service.tap(elem[0], function () {
            location.href = attr.kkLink;
        });
    };

    return command;
}]);

/**
 * Directive pull up
 */
app.directive('kkPullUp', ['service', function (service) {

    var command = {
        scope: true,
        restrict: 'A'
    };

    command.link = function (scope, elem, attr) {

        Transform(elem[0], true);
        elem[0].scaleX = elem[0].scaleY = 0;

        var toTop = false;

        /**
         * @param attr.kkPullUp
         * @param attr.height
         */
        service.reachBottom(function (top, h, _h) {

            var bottom = top + _h - h;
            var percentBili = bottom / parseInt(attr.kkPullUp);

            if (percentBili < 1) {
                if (toTop) {
                    percentBili = 1;
                }
                elem[0].scaleX = elem[0].scaleY = percentBili;
            } else {
                toTop = true;
                elem[0].scaleX = elem[0].scaleY = 1;
            }
        });
    };

    return command;
}]);

/**
 * Directive print text
 */
app.directive('kkPrintText', ['service', function (service) {

    var command = {
        scope: true,
        restrict: 'A'
    };

    command.link = function (scope, elem, attr) {
        /**
         * @param attr.kkPrintText
         * @param attr.time
         */
        var index = 0;

        function type() {
            if (index >= attr.kkPrintText.length) {
                clearInterval(interval);
            }
            elem.html(attr.kkPrintText.substring(0, index++));
        }

        var interval = setInterval(type, parseInt(attr.time || 250));
    };

    return command;
}]);

/**
 * Directive copy text
 */
app.directive('kkCopyText', ['service', function (service) {

    var command = {
        scope: true,
        restrict: 'A'
    };

    command.link = function (scope, elem, attr) {
        /**
         * @param attr.kkCopyText
         * @param attr.successMessage
         */
        var copy = new Clipboard(attr.kkCopyText || '.copy');

        copy.on('success', function (e) {
            e.clearSelection();
            scope.message(attr.successMessage || '链接复制成功', 3);
        });

        copy.on('error', function (e) {
            console.log(e);
        });

        // For fixed bug
        $('*').click(function (e) {
        });
    };

    return command;
}]);

/**
 * Directive location with enter on input
 */
app.directive('kkLocationOnInput', ['service', function (service) {

    var command = {
        scope: true,
        restrict: 'A'
    };

    command.link = function (scope, elem, attr) {
        /**
         * @param attr.kkLocationOnInput
         */
        service.keyBind(13, function () {
            var query = {};
            elem.find('input, textarea, select').each(function () {
                query[$(this).attr('name')] = $(this).val();
            });

            location.href = service.setParams(query, attr.kkLocationOnInput);
        }, elem.find('input, textarea, select'));
    };

    return command;
}]);

/**
 * Directive show modal
 */
app.directive('kkModal', ['service', '$timeout', function (service, $timeout) {

    var command = {
        scope: true,
        restrict: 'A'
    };

    command.link = function (scope, elem, attr) {
        /**
         * @param attr.kkModal
         * @param attr.close
         * @param attr.title
         * @param attr.no
         * @param attr.yes
         * @param attr.onNo
         * @param attr.onYes
         * @param attr.width
         */
        var content;

        var createModal = function (html) {
            // begin
            var tpl = '<div class="modal fade"><div class="modal-dialog"><div class="modal-content">';

            // header
            if (attr.title || attr.close) {
                tpl += '<div class="modal-header">';
                attr.close && (tpl += '<button type="button" class="close" data-dismiss="modal"><span>&times;</span></button>');
                attr.title && (tpl += '<h4 class="modal-title">' + attr.title + '</h4>');
                tpl += '</div>';
            }

            tpl += '<div class="modal-body">' + html + '</div>';

            // footer
            if (attr.yes || attr.no) {
                tpl += '<div class="modal-footer">';
                attr.no && (tpl += '<button type="button" class="btn btn-default no">' + attr.no + '</button>');
                attr.yes && (tpl += '<button type="button" class="btn btn-primary yes">' + attr.yes + '</button>');
                tpl += '</div>';
            }

            // end
            tpl += '</div></div></div>';
            tpl = $(tpl);

            $.each(['no', 'yes'], function (k, v) {
                var optionName = 'on' + v.ucFirst();
                if (attr[v]) {
                    service.tap(tpl.find('button.' + v)[0], function () {
                        $timeout(function () {
                            var onResult = true;
                            if (attr[optionName]) {
                                var fn = scope.$eval(attr[optionName]);
                                var result = fn();
                                onResult = (typeof result === 'undefined') ? true : !!result;
                            }
                            onResult && tpl.modal('hide');
                        }, 0);
                    });
                }
            });

            return tpl;
        };

        var tpl;
        if (attr.kkModal.indexOf('/') !== -1) {
            tpl = createModal(null);
            service.tap(elem[0], function () {
                scope.request({
                    api: attr.kkModal,
                    post: attr.params ? service.parseQueryString(attr.params) : {},
                    success: function (res) {
                        if (!res.state) {
                            return scope.message(res.info);
                        }

                        tpl.find('.modal-dialog').css('width', attr.width);
                        tpl.find('.modal-body').html(res.data.message);
                        tpl.modal();
                    }
                });
            });
            content = '';
        } else {
            var modal = $('.kk-modal > ' + attr.kkModal);
            if (!modal.length) {
                return false;
            }

            // content
            tpl = createModal(modal.html());
            tpl.find('.modal-dialog').css('width', attr.width);
            service.tap(elem[0], function () {
                tpl.modal();
            });
        }
    };

    return command;
}]);

/**
 * Controller
 */
app.controller('generic', ['$scope', '$timeout', 'service', function ($scope, $timeout, service) {

    $scope.timeout = $timeout;
    $scope.service = service;
    $scope.conf = {
        ajaxLock: {},
        timeout: null
    };

    /**
     * 禁用滚动条
     *
     * @param scroll
     */
    $scope.scroll = function (scroll) {

        var obj = $('html,body');

        if (scroll) {
            obj.removeClass('scroll-y');
        } else {
            obj.addClass('scroll-y');
        }
    };

    /**
     * 加载图
     *
     * @param load
     * @param time
     */
    $scope.loading = function (load, time) {

        var hideTag;
        load = (typeof load === 'undefined') ? true : load;
        time = (parseInt(time) || 0) * 1000;

        var box = $('#loading');
        var bar = box.find('.loading-bar');

        if (load) {
            $scope.scroll(false);
            box.removeClass('hidden');
        } else {
            $scope.scroll(true);
            $scope.hideAnimate(box, bar, 700, hideTag);
        }

        if (time) {
            hideTag = setTimeout(function () {
                $scope.loading(false);
            }, time);
        }

        return null;
    };

    /**
     * 显示消息
     *
     * @param msg
     * @param time
     */
    $scope.message = function (msg, time) {

        var hideTag;
        $scope.loading(false);
        time = (parseInt(time) || 10) * 1000;

        var box = $('#message');
        var bar = box.find('.message-bar');

        $scope.scroll(false);
        var hide = function () {
            $scope.scroll(true);
            $scope.hideAnimate(box, bar, 700, hideTag);
        };

        box.removeClass('hidden').on('click', hide).find('.message-box').html(msg);
        hideTag = setTimeout(hide, time);

        return null;
    };

    /**
     * 收起动画
     *
     * @param box
     * @param bar
     * @param time
     * @param clear
     */
    $scope.hideAnimate = function (box, bar, time, clear) {

        time += 10;

        box.removeClass('kk-show').addClass('kk-hide');
        bar.removeClass('kk-t2b-show').addClass('kk-b2t-hide');

        clearTimeout(clear);

        setTimeout(function () {
            box.addClass('hidden');
            box.removeClass('kk-hide').addClass('kk-show');
            bar.removeClass('kk-b2t-hide').addClass('kk-t2b-show');
        }, time);
    };

    /**
     * Ajax lock
     *
     * @param api
     * @param unlock
     */
    $scope.ajaxLock = function (api, unlock) {
        var lock = $scope.conf.ajaxLock;
        if (unlock) {
            lock[api] = 0;
            return true;
        } else {
            if (!lock[api] || service.time() > lock[api]) {
                lock[api] = service.time() + 1000; // 1 second
                return true;
            }
            return false;
        }
    };

    /**
     * Request and show loading, lock
     *
     * @param option
     */
    $scope.request = function (option) {

        if (typeof option.loading === 'undefined') {
            option.loading = true;
        }

        if (!$scope.ajaxLock(option.api)) {
            return false;
        }

        if (option.loading) {
            $scope.loading(true);
        }

        service.ajaxPost(option.api, option.post, function (error) {

            $scope.message(error);

        }).then(function (result) {

            var handler = function () {
                $scope.loading(false);
                if (!service.isEmpty(result.info)) {
                    $scope.message(result.info);
                }

                option.success && option.success(result);
            };

            $timeout(handler, 500);

        }, function (result) {

            $scope.loading(false);
            if (option.fail) {
                option.fail(result);
            } else {
                $scope.message(result.info);
            }
        });
    };

    /**
     * 微信 SDK
     *
     * @param conf
     * @param title
     * @param description
     * @param cover
     */
    $scope.wxSDK = function (conf, title, description, cover) {

        wx.config(conf);
        wx.ready(function () {

            var hideList = [
                'menuItem:share:qq',
                'menuItem:share:weiboApp',
                'menuItem:share:facebook',
                'menuItem:share:QZone',
                'menuItem:editTag',
                'menuItem:delete',
                'menuItem:originPage',
                'menuItem:readMode',
                'menuItem:share:email',
                'menuItem:share:brand'
            ];
            wx.hideMenuItems({menuList: hideList});

            var options = {
                title: title,
                link: service.unsetParams(['code']),
                imgUrl: cover,
                success: function () {
                    $scope.message('分享成功');
                }
            };

            // 分享到朋友圈
            wx.onMenuShareTimeline(options);

            // 分享给朋友
            options.desc = description;
            wx.onMenuShareAppMessage(options);
        });

        // 扫一扫
        var scanBtn = $('.lift-scan');
        if (scanBtn.length) {
            service.tap(scanBtn, function () {
                wx.scanQRCode({
                    needResult: 0,
                    scanType: ['qrCode']
                });
            });
        }
    };

    /**
     * 公用内容
     */
    $scope.common = function (option) {

        // 分销商标识
        $('a').on('tap click', function (e) {
            var href = $(this).attr('href');
            if (!href || href.indexOf('javascript:') === 0 || href.indexOf('tel:') === 0) {
                return true;
            }

            if (href.indexOf('http') === 0 && href.indexOf(baseUrl) === -1) {
                return true;
            }

            var _href = service.supplyParams(href, ['channel']);
            if (href === _href) {
                return true;
            }

            e && e.preventDefault && e.preventDefault();
            location.href = _href;
        });

        // 图片加载
        $scope.loading(true);
        $('body').imagesLoaded({background: true}).always(function () {
            $scope.loading(false);
        });

        // 刷新提示
        if (option.message) {
            $scope.message(option.message);
        }
    };
}]);