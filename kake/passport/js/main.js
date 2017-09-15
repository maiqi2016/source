var app = angular.module('kkApp', []);

/**
 * Service
 */
app.service('service', ['$http', '$q', function ($http, $q) {

    var that = this;

    // CSRF
    this.csrfKey = document.getElementsByName('csrf-param')[0].getAttribute('content');
    this.csrfToken = document.getElementsByName('csrf-token')[0].getAttribute('content');

    // String.trim
    String.prototype.trim = function (str) {
        str = str ? ('\\s' + str) : '\\s';
        return this.replace(new RegExp('(^[' + str + ']*)|([' + str + ']*$)', 'g'), '');
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
    this.tap = function (target, action) {
        if (that.device.mobile) {
            new AlloyFinger(target, {tap: action});
        } else {
            $(target).click(action);
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
                window.event = event;
                var callback = function () {
                    fn(scope, {
                        $event: event
                    });
                };
                scope.$apply(callback);
            });
        };
    };

    return command;
}]);

/**
 * Directive sms
 */
app.directive('kkSms', ['service', function (service) {

    var command = {
        scope: false,
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
        var uri = 'main/ajax-sms';

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
 * Controller
 */
app.controller('generic', ['$scope', '$timeout', '$interval', 'service', function ($scope, $timeout, $interval, service) {

    $scope.timeout = $timeout;
    $scope.interval = $interval;
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
}]);