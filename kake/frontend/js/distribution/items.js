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

    $('*').on('touchstart', function (e) {
        var touch = e.touches[0];
        var y = Number(touch.pageY);
        if (y > 400) {
            $scope.timeout(function () {
                $scope.showTab = false;
                $scope.scroll(true);
            });
        }
    });

    // Click to show
    $scope.showAnimate = true;
    $scope.showBody = false;
    $scope.key = 'open-animated';

    $scope.hidden = function () {
        var time = 500;
        $('.opening').fadeOut(time);
        $scope.timeout(function () {
            $scope.showBody = true;
            $scope.showAnimate = false;
            $scope.service.cookie.set($scope.key, true);
        }, time);
    };

    $scope.autoHide = function () {
        if ($scope.service.cookie.get($scope.key)) {
            $scope.hidden();
        } else {
            $scope.timeout(function () {
                $scope.hidden();
            }, 5000);
        }
    }
}]);