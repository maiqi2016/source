/**
 * 控制器 - 分销活动
 */
app.controller('distribution', ['$scope', '$controller', function ($scope, $controller) {

    $controller('generic', {$scope: $scope});

    $scope.code = function (phone, captcha) {

        // 验证手机号码和验证码
        if (!(/0?(13|14|15|17|18|19)[0-9]{9}/.test(phone))) {
            $scope.message('请输入正确的手机号码');
        }

        var query = $scope.service.parseQueryString();

        $scope.request({
            api: 'distribution/ajax-code',
            post: {
                phone: phone,
                captcha: captcha,
                channel: query.channel ? query.channel : null,
                from: query.from ? query.from : null
            },
            success: function (res) {
                if (res.state) {
                    // 3秒后跳转到 res.data.href
                    $scope.message('活动参与成功');
                    $scope.timeout(function () {
                        location.href = res.data.href;
                    }, 3000)
                } else {
                    // 显示错误信息 res.info
                    $scope.message(res.info);
                }
            }
        });
    };

    var str = window.location.search;
    if(str.indexOf("&") != -1){
        str = str.substr(-1);
        if (str === '0'){
            $('.has-no').css({'display':'block'});
        }else if (str === '2'){
            $('.has-no').css({'display':'block'});
            $('.has-no').html('活动已结束');
        }else {
            $('.has-yes').css({'display':'block'});
        }
    }


    
}]);