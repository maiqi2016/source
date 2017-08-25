/**
 * 控制器 - 活动
 */
app.controller('site', ['$scope', '$controller', function ($scope, $controller) {

    $controller('generic', {$scope: $scope});

    // Scroll effect
    $scope.effect = function (li, e, v) {
        li.each(function() {
            if ($(this).hasClass("top20")) {
                $(this).removeClass("top20");
            } else{
                $(this).addClass("top20");
            }
        });
    };
}]);
