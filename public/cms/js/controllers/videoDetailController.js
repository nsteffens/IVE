var app = angular.module("ive_cms");

app.controller("videoDetailController", function ($scope, $videoService, $location, $routeParams, $sce) {

    $scope.subsite = "detail";

    $videoService.retrieve($routeParams.video_id)
        .then(function onSuccess(response) {

            $scope.video = response.data;

            $scope.video.tags = ['tag1,tag2,tag3'];
            console.log($scope.video);

        });

    // Init video, TODO: Fill with real video and remove placeholder
    $scope.videoConfig = {
        sources: [
            { src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.mp4"), type: "video/mp4" }
        ],
        tracks: [],
        theme: "../bower_components/videogular-themes-default/videogular.css",
        // plugins: {
        //     poster: "http://www.videogular.com/assets/images/videogular.png"
        // }
    }


    /**
     * [redirect description]
     * @param  {[type]} path [description]
     * @return {[type]}      [description]
     */
    $scope.redirect = function (path) {
        $location.url(path);
    };


    // Function that is triggered, when the edit button has been pressed
    $scope.editVideo = function() {



    }



});