/**
 * 控制器 - 用户
 */
app.controller('user', ['$scope', '$controller', function ($scope, $controller) {

    $controller('generic', {$scope: $scope});
}]);
