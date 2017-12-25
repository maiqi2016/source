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

    //下雪
    // var Canvas = function (w, h) {
    //     this.width = w;
    //     this.height = h;
    // };
    //
    // Canvas.prototype = {
    //     init: function () {
    //         var oC = document.createElement("canvas");
    //         oC.setAttribute('width', this.width);
    //         oC.setAttribute('height', this.height);
    //         oC.setAttribute('id', 'canvas');
    //         oC.style.backgroundColor = 'transparent';
    //         oC.style.position = 'absolute';
    //         oC.style.top = 0;
    //         $('.opening')[0].appendChild(oC);
    //     }
    // };
    // var curWinWidth = window.innerWidth,
    //     curWinHeight = window.innerHeight,
    //     oCanvas = new Canvas(curWinWidth, curWinHeight);
    //
    // oCanvas.init();
    //
    // var oC = document.querySelector('#canvas'),
    //     width = oC.width,
    //     height = oC.height,
    //     oGc = oC.getContext('2d');
    //
    // var Snow = function () {
    //     this.random = function (min, max) {
    //         return Math.random() * (max - min) + min;
    //     }
    // };
    //
    // Snow.prototype = {
    //
    //     init: function () {
    //         this.x = this.random(0, width);
    //         this.y = this.random(0, 100);
    //         this.r = this.random(1, 6);
    //         this.vy = this.random(1, 3);
    //         this.py = this.random(0.5, 0);
    //     },
    //
    //     draw: function (cxt) {
    //         cxt.beginPath();
    //         cxt.fillStyle = 'white';
    //         cxt.arc(this.x, this.y + this.r, this.r, 0, Math.PI * 2, false);
    //         cxt.fill();
    //         cxt.closePath();
    //         this.update(cxt);
    //     },
    //
    //     update: function (cxt) {
    //         if (this.y < height - this.r && this.x < width - this.r) {
    //             this.y += this.vy;
    //             if ($scope.service.rand(0.5,0)) {
    //                 this.x -= this.py;
    //             } else {
    //                 this.x += this.py;
    //             }
    //         } else {
    //             this.init();
    //         }
    //     }
    // };
    // var snow = [];
    // for (var i = 0; i < 50; i++) {
    //     setTimeout(function () {
    //         var oSnow = new Snow();
    //         oSnow.init();
    //         snow.push(oSnow);
    //     }, 10 * i);
    // }
    // (function move() {
    //     oGc.clearRect(0, 0, width, height);
    //     for (var i = 0; i < snow.length; i++) {
    //         snow[i].draw(oGc);
    //     }
    //     requestAnimationFrame(move);
    // })()

    //日历
    $scope.li = '';
    $scope.days = {};
    $scope.cal = function () {
        var d1 = new Date(),
            y = d1.getFullYear(),
            m = d1.getMonth() + 1,
            d = d1.getDate(),
            firstDay = new Date(y, m - 1, 1).getDay(),
            dayCount = new Date(y, m, 0).getDate(),
            blank = '<li></li>';

        $scope.li = blank.repeat(firstDay);

        for (var i = 1; i <= dayCount; i++) {
            var day = y + '-' + m + '-' + i;
            var cls = $scope.days[day] ? $scope.days[day] : '';
            cls += $scope.days[day]==='0' ? ' hotel' : '';
            cls += $scope.days[day]==='1' ? ' eat' : '';
            cls += $scope.days[day]==='2' ? ' play' : '';
            cls += i<d ? ' prev' : ' next';

            var url = requestUrl + 'distribution/activity-boot&date=' + day;
            url = $scope.service.supplyParams(url, ['channel']);

            if($scope.days[day] === 'today'){
                $scope.li += '<a href="' + url + '"><li class="' + cls.trim() + '">' + i + '<b></b>' + '<div></div>' + '<p></p>' + '</li></a>';
            }else if ($scope.days[day] === '0' || $scope.days[day] === '1' || $scope.days[day] === '2'){
                $scope.li += '<a href="' + url + '"><li class="' + cls.trim() + '">' + i + '<div></div>' + '</li></a>';
            }else if($scope.days[day] === 'signed'){
                $scope.li += '<a href="' + url + '"><li class="' + cls.trim() + '">' + i + '<div></div>' + '</li></a>';
            }else {
                $scope.li += '<li class="' + cls.trim() + '">' + i + '<div></div>' + '</li>';
            }
        }

        $scope.li += blank.repeat(7 - (firstDay + dayCount) % 7);

        $scope.li = $sce.trustAsHtml($scope.li);

    //    点击切换日历
        $scope.showCal = false;
        $scope.change = function () {
            $scope.showCal = !$scope.showCal;
            if($scope.showCal){
                $('.luck-draw').css({'display':'block'})
            }else {
                $('.luck-draw').css({'display':'none'})
            }
        }
    }
}]);