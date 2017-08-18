/**
 * 控制器 - 用户
 */
app.controller('user', ['$scope', '$controller', function ($scope, $controller) {

    $controller('generic', {$scope: $scope});

    $scope.apply = {
        phone: null,
        name: null,
        avatar_id: null
    };

    $scope.submitApply = function () {
        // if ($scope.service.check($scope.phone))
    };
}]);
