/**
 * 控制器 - 用户
 */
app.controller('producer', ['$scope', '$controller', function ($scope, $controller) {

    $controller('generic', {$scope: $scope});

    $scope.apply = {
        phone: null,
        name: null,
        tip: '点击上传头像，不上传默认为微信头像', // 点击选择文件
        attachment: null
    };

    // 上传后处理
    $scope.handleUpload = function (data) {
        $scope.apply.attachment = data.id;
        $scope.apply.tip = data.name;

        $('#file').html(data.name);
    };

    $scope.submitApply = function () {

        var service = $scope.service;
        var data = $scope.apply;

        if (!service.check(data.phone, 'phone')) {
            return $scope.message('请输入正确的手机号码');
        }

        if (!data.name || data.name.length < 1 || data.name.length > 32) {
            return $scope.message('名称长度控制在 1 ~ 32 字之间');
        }

        $scope.request({
            api: 'producer/ajax-apply-distributor',
            post: data,
            success: function (res) {
                if (!res.state) {
                    return $scope.message(res.info);
                }

                $scope.message('申请提交成功，请等待审核通过~');
                $scope.timeout(function () {
                    location.href = res.data;
                }, 2500);
            }
        });
    };
}]);
