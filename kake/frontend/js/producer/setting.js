/**
 * 控制器 - 分销商
 */
app.controller('producer', ['$scope', '$controller', function ($scope, $controller) {

    $controller('generic', {$scope: $scope});

    $scope.setting = {};
    $scope.payment_method = {
        0: '微信',
        1: '支付宝'
    };

    // 上传头像后处理
    $scope.handleUpload = function (data) {
        $scope.setting.logo_attachment_id = data.id;
        $('img.right').attr('src', data.url);
    };

    // 更改账号类型
    $scope.radio = function () {
        var radio = $('.style-2 > span');
        radio.each(function () {
            $scope.service.tap(this, function () {
                radio.removeClass('active');
                $(this).addClass('active');

                $('span.right').html($(this).html());
                $scope.setting.account_type = $(this).attr('data-key');
            });
        });
    };

    // 保存
    $scope.editSetting = function () {

        var c = $scope.setting;

        if (c.name.length <= 0 || c.name.length > 32) {
            return $scope.message('名称不能为空 [0~32个字符]');
        }

        $scope.request({
            api: 'producer/ajax-edit-setting',
            post: c,
            success: function (res) {
                if (!res.state) {
                    return $scope.message(res.info);
                }

                $scope.message('个人资料更新成功');
                $scope.timeout(function () {
                    location.href = res.data;
                }, 2500);
            }
        });
    };
}]);
