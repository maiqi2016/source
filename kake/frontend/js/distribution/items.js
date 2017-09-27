/**
 * 控制器 - 分销
 */
app.controller('distribution', ['$scope', '$controller', function ($scope, $controller) {

    $controller('generic', {$scope: $scope});

    // 筛选二级菜单
    $scope.showTab = false;
    $scope.toggle = function () {
        $scope.showTab = !$scope.showTab;
        $scope.scroll(!$scope.showTab);
    };

    // Click to show
    $scope.showAnimate = true;
    $scope.showBody = false;

    $scope.hidden = function () {
        var time = 500;
        $('.opening').fadeOut(time);
        $scope.timeout(function () {
            $scope.showBody = true;
            $scope.showAnimate = false;
        }, time);
    };

    $scope.autoHide = function () {
        $('.opening_bj img').css('height', window.screen.height);
        $scope.timeout(function () {
            $scope.hidden();
        }, 5000);
    }
}]);