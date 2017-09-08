/**
 * 控制器 - 分销商
 */
app.controller('producer', ['$scope', '$controller', function ($scope, $controller) {

    $controller('generic', {$scope: $scope});

    $scope.money = {
        quota: null,
        withdraw: null
    };
    $scope.withdrawAll = function () {
        $scope.money.withdraw = parseFloat($('.money').text());
    };

    $scope.withdraw = function () {
        var quota = parseFloat($scope.money.withdraw);

        if (isNaN(quota) || quota <= 0) {
            return $scope.message('请填入合法的提现金额数字');
        }

        if (quota > parseFloat($scope.money.quota)) {
            return $scope.message('提现额度不能超过余额上限');
        }

        $scope.request({
            api: 'producer/ajax-apply-withdraw',
            post: {
                quota: quota
            },
            success: function (res) {
                if (!res.state) {
                    return $scope.message(res.info);
                }

                $scope.message('提现申请提交成功');
                $scope.timeout(function () {
                    location.href = res.data;
                }, 2500);
            }
        });
    };
}]);
