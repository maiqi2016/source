/**
 * 控制器 - 授权
 */
app.controller('auth', ['$scope', '$controller', function ($scope, $controller) {

    $controller('generic', {$scope: $scope});

    $scope.info = {
        phone: null,
        captcha: null
    };

    $scope.goBack = function () {
        $scope.timeout(function () {
            history.go(-1);
        }, 3000);
    };

    $scope.login = function () {
        if (!$scope.service.check($scope.info.phone, 'phone')) {
            return $scope.message('请输入正确的手机号码');
        }

        if (!$scope.info.captcha || $scope.info.captcha.length !== 4) {
            return $scope.message('验证码长度应为4位数字串');
        }

        $scope.request({
            api: 'auth/ajax-login',
            post: {
                phone: $scope.info.phone,
                captcha: $scope.info.captcha
            },
            success: function (res) {
                $scope.message(res.info);
                $scope.timeout(function () {
                    history.go(0);
                }, 2500);
            }
        });
    };
}]);
