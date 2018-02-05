/**
 * 控制器 - 分销
 */
app.controller('distribution', ['$scope', '$controller', '$sce', function ($scope, $controller, $sce) {

    $controller('generic', {$scope: $scope});

    // 筛选二级菜单
    $scope.showTab = true;
    $scope.toggle = function () {
        $scope.showTab = !$scope.showTab;
        $scope.scroll(!$scope.showTab);
    };

    // Click to show
    $scope.showAnimate = true;
    $scope.showBody = true;

    $scope.hidden = function () {
        var time = 500;
        $('.opening').fadeOut(time);
        $scope.timeout(function () {
            $scope.showBody = true;
            $scope.showAnimate = false;
        }, time);
    };

    $scope.autoHide = function (time) {
        $('.opening_bj img').css('height', window.screen.height);
        $scope.timeout(function () {
            $scope.hidden();
        }, time);
    };

    $scope.showCalFn = function () {
        $scope.showCal = !$scope.showCal;
    };

    // $scope.showBanner = true;
    // $scope.timeout(function () {
    //     $scope.showBanner = false;
    // },4000)

}]);