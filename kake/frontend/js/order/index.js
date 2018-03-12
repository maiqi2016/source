/**
 * 控制器 - 订单中心
 */
app.controller('order', ['$scope', '$controller', function ($scope, $controller) {

    $controller('generic', {$scope: $scope});

    $scope.f5 = function () {
        $scope.timeout(function () {
            history.go(0);
        }, 2500);
    };

    $scope.refund = [];
    $scope.order = [];
    $scope.bill = [];
    $scope.second = 15;
    $scope.code = '';

    // 微信吊起支付
    $scope.wxPayment = function (data, orderNumber) {
        function onBridgeReady() {
            WeixinJSBridge.invoke('getBrandWCPayRequest', data, function (response) {
                    if (response.err_msg === 'get_brand_wcpay_request:ok') {
                        var url = requestUrl + 'order/pay-result&order_number=' + orderNumber
                        url = $scope.service.supplyParams(url, ['channel']);

                        location.href = url;
                    }
                }
            );
        }

        if (typeof WeixinJSBridge === 'undefined') {
            if (document.addEventListener) {
                document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
            } else if (document.attachEvent) {
                document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
            }
        } else {
            onBridgeReady();
        }
    };

    // 轮询订单是否完成（支付宝专用）
    $scope.pollOrder = function (orderNumber, userId) {
        $scope.request({
            api: 'order/ajax-poll-order',
            loading: false,
            post: {
                order_number: orderNumber,
                user_id: userId,
                channel: $scope.service.parseQueryString().channel
            },
            success: function (res) {
                location.href = res.data;
            },
            fail: function () {
                $scope.timeout(function () {
                    $scope.pollOrder(orderNumber, userId);
                }, 3000);
            }
        });
    };

    // 立即付款
    $scope.paymentAgain = function (paymentMethod, orderNumber) {
        $scope.request({
            api: 'order/ajax-payment-again',
            post: {
                payment_method: paymentMethod,
                order_number: orderNumber
            },
            success: function (res) {
                location.href = res.data;
            }
        });
    };

    // 取消订单
    $scope.cancelOrder = function (orderNumber) {

        var result = confirm('确定取消该订单吗?');
        if (!result) {
            return null;
        }

        $scope.request({
            api: 'order/ajax-cancel-order',
            post: {
                order_number: orderNumber
            },
            success: $scope.f5
        });
    };

    // 申请退款
    $scope.applyRefund = function (id) {

        var refund = $scope.refund[id];

        if (!refund || $scope.service.isEmpty(refund.remark)) {
            return $scope.message('请填写退款申请原因');
        }

        refund.id = id;
        $scope.request({
            api: 'order/ajax-apply-refund',
            post: refund,
            success: $scope.f5
        });
    };

    // 申请预约
    $scope.applyOrder = function (id) {

        var order = $scope.order[id];

        if (!order || $scope.service.isEmpty(order.name)) {
            return $scope.message('请填写入住人姓名');
        }

        if (!order || $scope.service.isEmpty(order.phone) || !$scope.service.check(order.phone, 'phone')) {
            return $scope.message('请填写正确的入住人联系方式');
        }

        if (!order || $scope.service.isEmpty(order.date)) {
            return $scope.message('请选择入住日期');
        }

        order.id = id;
        order.time = order.date.format('yyyy-MM-dd');

        $scope.request({
            api: 'order/ajax-apply-order',
            post: order,
            success: $scope.f5
        });
    };

    // 我已入住
    $scope.completed = function (id) {
        var result = confirm('确定已入住酒店?');
        if (!result) {
            return null;
        }

        $scope.request({
            api: 'order/ajax-completed',
            post: {
                id: id
            },
            success: $scope.f5
        });
    };

    // 申请发票
    $scope.applyBill = function (id) {

        var bill = $scope.bill[id];

        if (!bill || bill.company && $scope.service.isEmpty(bill.company_name)) {
            return $scope.message('请填写发票抬头公司名称');
        }

        if (!bill || $scope.service.isEmpty(bill.address)) {
            return $scope.message('请填写发票的邮寄地址');
        }

        bill.id = id;
        $scope.request({
            api: 'order/ajax-apply-bill',
            post: bill,
            success: $scope.f5
        });
    };

    // 倒计时跳转
    $scope.paidLocation = function (url) {
        $scope.interval(function () {
            $scope.second--;
            if ($scope.second <= 0) {
                location.href = url;
            }
        }, 1000);
    };

    $scope.posBox = function (e, box) {
        var pos = $scope.service.offset(box[0]);
        $('body, html').animate({scrollTop: pos.top});
    };

    //核销页面js
    $scope.$watch('code', function (n, o) {

        var add = true;

        if (o.length > n.length) {
            add = false
        }

        if (add) {
            n = n.replace(/ /g, '');
            o = o.replace(/ /g, '');

            if (n === o || n.length >= 12) {
                return;
            }

            if (n.length % 4 === 0) {
                $scope.code += ' ';
            }
        } else {
            $scope.code = $scope.code.trim();
        }
    });
}]);

