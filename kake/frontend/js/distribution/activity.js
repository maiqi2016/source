/**
 * 控制器 - 分销活动
 */
app.controller('distribution', ['$scope', '$controller', function ($scope, $controller) {

    $controller('generic', {$scope: $scope});

    $scope.share = function () {
        $scope.$on('shareSuccess', function (event, data) {
            $scope.showShare = false;
        });
    };

    $scope.code = function (phone, captcha) {

        if (!$scope.service.check(phone, 'phone')) {
            return $scope.message('请输入正确的手机号码');
        }

        if (!captcha || captcha.toString().length !== 4) {
            return $scope.message('手机验证码应是4位数字');
        }

        var query = $scope.service.parseQueryString();

        $scope.request({
            api: 'distribution/ajax-code',
            post: {
                phone: phone,
                captcha: captcha,
                channel: query.channel ? query.channel : null,
                from_user: query.from_user ? query.from_user : (query.from ? query.from : null)
            },
            success: function (res) {
                if (res.state) {
                    $scope.message('活动参与成功');
                    $scope.timeout(function () {
                        location.href = res.data.href;
                    }, 3000)
                } else {
                    $scope.message(res.info);
                }
            }
        });

    };

    $scope.hide = function () {
        var current = new Date().format('yyyy-MM-dd'),
            currentDate = $scope.service.time(current),
            toTime = $scope.service.time(d);
        if (currentDate > toTime){
            $('.goon').remove();
            $('.little').remove();
            $('.call').remove();
        }
    };
}]);