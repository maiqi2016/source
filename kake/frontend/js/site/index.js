/**
 * 控制器 - 活动
 */
app.controller('site', ['$scope', '$controller', function ($scope, $controller) {

    $controller('generic', {$scope: $scope});

    $scope.y = 25;
    $scope.initEffect = function() {
        $('div#carousel-scroller-aim > div.scroll > div').each(function(key) {
            Transform(this, true);
            this.translateY = (key % 2 === 0) ? 0 : $scope.y;
        });
    };

    // Scroll effect
    $scope.effect = function (li, v, max) {

        var o = $('.hot-aim');

        var px = parseFloat(o.attr('px'));
        px = px || 0;

        var x = (v - px) / max * $scope.y;
        
        li.each(function(key, value) {
            var y;
            if (key % 2 === 0) {
                y = this.translateY ? parseFloat(this.translateY) : 0;
                this.translateY = y - x;
            } else {
                y = this.translateY ? parseFloat(this.translateY) : $scope.y;
                this.translateY = y + x;
            }
        });

        o.attr('px', v);
    };
}]);
