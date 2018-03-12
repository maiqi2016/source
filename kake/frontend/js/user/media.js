/**
 * 控制器 - 媒体触发
 */
app.controller('user', ['$scope', '$controller', function ($scope, $controller) {

    $controller('generic', {$scope: $scope});

    $scope.init = function (type, value) {
        location.href = type + ':' + value;
    };
}]);
