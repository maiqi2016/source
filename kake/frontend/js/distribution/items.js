/**
 * 控制器 - 分销
 */
app.controller('distribution', ['$scope', '$controller', function ($scope, $controller) {

    $controller('generic', {$scope: $scope});

    // 点击出现地域选择
    $scope.toggle = function () {
        var areaSelect = $(".select-area");
        if (area=true) {
            areaSelect.toggleClass("hidden");
        };
    };
}]);