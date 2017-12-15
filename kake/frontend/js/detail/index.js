/**
 * 控制器 - 详情
 */
app.controller('detail', ['$scope', '$controller', function ($scope, $controller) {

    $controller('generic', {$scope: $scope});

    $scope.totalPrice = 0;
    $scope.bind = null;
    $scope.buy = {
        package: {},
        user_info: {
            name: null,
            phone: null,
            captcha: null
        },
        payment_method: 'wx'
    };

    $scope.run = function () {
        $scope.service.reachBottom(function () {
            $('.classify-1-2').click();
            return false;
        })
    };

    // 初始化
    $scope.init = function (list, bind) {
        $.each(list, function (index, obj) {
            $scope.buy.package['limit_' + index] = {
                id: parseInt(index),
                number: 0,
                price: obj.min_price
            };
        });

        $scope.bind = bind;
    };


    // 点击选择框
    $scope.packageTap = function (id, showP) {

        if (!showP) {
            return null;
        }

        var key = 'limit_' + id;
        var obj = $scope.buy.package[key];

        // 捆绑销售
        var n = obj.number;
        $.each($scope.bind, function (key, value) {
            if ($.inArray(id.toString(), value) !== -1) {
                $.each(value, function (k, v) {
                    $scope.buy.package['limit_' + v].number = n ? 0 : 1;
                });
            }
        });

        obj.number = n ? 0 : 1;

        $scope.calPrice()
    };

    // 删减商品
    $scope.goodsDel = function (packageId) {

        var key = 'limit_' + packageId;
        var number = $scope.buy.package[key].number - 1;

        if (number < 1) {
            $.each($scope.bind, function (key, value) {
                if ($.inArray(packageId.toString(), value) !== -1) {
                    $.each(value, function (k, v) {
                        $scope.buy.package['limit_' + v].number = 0;
                    });
                }
            });
        } else {
            $scope.buy.package[key].number -= 1;
        }

        $scope.calPrice();
    };

    // 增加商品
    $scope.goodsAdd = function (packageId, limit) {

        var key = 'limit_' + packageId;

        if (limit >= 0) {
            var number = $scope.buy.package[key].number + 1;
            if (number > limit) {
                $scope.message('该套餐本次购买最大限定' + limit + '次');
                return false;
            }
        }

        $scope.buy.package[key].number += 1;
        $scope.calPrice();
    };

    // 计算总价
    $scope.calPrice = function () {

        var price = 0;
        $.each($scope.buy.package, function (k, v) {
            if ($scope.service.isEmpty(v)) {
                return true; // continue
            }

            price += parseInt(v.number) * parseInt(v.price * 100);
        });

        $scope.totalPrice = price / 100;
    };

    // 立即购买
    $scope.goToPayment = function () {

        if ($scope.totalPrice <= 0) {
            return $scope.message('请先选择您要购买的套餐');
        }

        var user = $scope.buy.user_info;

        if ($scope.service.isEmpty(user.name)) {
            return $scope.message('请填写联系人姓名');
        }

        if (!$scope.service.check(user.phone, 'phone')) {
            return $scope.message('手机号码格式不正确');
        }

        if (!user.captcha || user.captcha.toString().length !== 4) {
            return $scope.message('手机验证码应是4位数字');
        }

        var url = requestUrl + 'detail/prefix-payment';

        url += '&product_id=' + $('.body').attr('product-id');

        $.each($scope.buy.package, function (k, v) {
            if ($scope.service.isEmpty(v)) {
                return true;
            }
            url += '&package[' + v.id + ']=' + v.number;
        });

        url += '&user_info[name]=' + user.name;
        url += '&user_info[phone]=' + user.phone;
        url += '&user_info[captcha]=' + user.captcha;

        url += '&payment_method=' + $scope.buy.payment_method;
        url = $scope.service.supplyParams(url, ['channel']);

        location.href = url;
    };
}]);