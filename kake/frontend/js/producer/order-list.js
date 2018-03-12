/**
 * 控制器 - 分销商
 */
app.controller('producer', ['$scope', '$controller', function ($scope, $controller) {

    $controller('generic', {$scope: $scope});

    $scope.settlement = function () {
        $scope.request({
            api: 'producer/ajax-settlement',
            post: {},
            success: function (res) {
                $scope.message(res.data);
                $scope.timeout(function () {
                    history.go(0);
                }, 2500);
            }
        });
    };
}]);
