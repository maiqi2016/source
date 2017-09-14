/**
 * 控制器 - 分销
 */
app.controller('distribution', ['$scope', '$controller', function ($scope, $controller) {

    $controller('generic', {$scope: $scope});

    // 筛选二级菜单
    $scope.showTab = false;
    $scope.toggle = function() {
        $scope.showTab = !$scope.showTab;
        $scope.scroll(!$scope.showTab);
    };

    // Click to show
    $scope.showBody = true;
    $scope.hidden = function () {
        
        var time = 500;

        $('.opening').fadeOut(time);
        $scope.timeout(function() {
            $scope.showBody = true;
        }, time);
    };

    $scope.autoHide = function() {
        $scope.timeout(function() {
            $scope.hidden();
        }, 8000);
    }
}]);