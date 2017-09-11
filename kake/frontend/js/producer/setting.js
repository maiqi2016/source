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

        if (!c.logo_attachment_id) {
            return $scope.message('请选择头像文件');
        }

        if (!c.name || c.name.length < 1 || c.name.length > 32) {
            return $scope.message('名称长度不符合规范 [1~32个字符]');
        }

        if (!c.account_type) {
            return $scope.message('请选择收款账号类型');
        }

        if (!c.account_number) {
            return $scope.message('请填写收款账号');
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
