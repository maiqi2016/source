/**
 * 控制器 - 活动
 */
app.controller('activity', ['$scope', '$controller', function ($scope, $controller) {

    $controller('generic', {$scope: $scope});

    $scope.story = {
        img: null,
        attachment: null,
        story: null
    };

    // 上传后处理
    $scope.handleUpload = function (data) {
        $scope.story.img = data.url;
        $scope.story.attachment = data.id;

        $('#preview').attr('src', data.url);
    };

    // 提交我的故事
    $scope.submitStory = function () {
        var data = $scope.story;

        if (!parseInt(data.attachment)) {
            $scope.message('请先上传照片');
            return null;
        }

        if (!data.story || data.story.length < 1 || data.story.length > 100) {
            $scope.message('故事内容长度控制在 1 ~ 100 字之间');
            return null;
        }

        $scope.request({
            api: 'activity/ajax-story',
            post: data,
            success: function (res) {

                var pos = {
                    w: document.body.offsetWidth,
                    h: document.body.offsetHeight
                };
                $('textarea').blur();

                var img = new Image(pos.w, pos.h);
                img.src = res.data.img;
                img.classList.add('screen-shot');

                $('body').append(img);

                /*
                 $scope.timeout(function () {
                 html2canvas(obj[0], {
                 useCORS: true,
                 width: pos.w,
                 height: pos.h,
                 onrendered: function (canvas) {

                 $scope.message('提交成功,长按保存图片');

                 try {
                 var base64 = canvas.toDataURL();
                 } catch (e) {
                 console.log(e);
                 }

                 var img = new Image(pos.w, pos.h);
                 img.src = base64;
                 img.classList.add('screen-shot');

                 $('body').append(img);
                 }
                 });
                 }, 850);
                 */
            }
        });
    };
}]);
