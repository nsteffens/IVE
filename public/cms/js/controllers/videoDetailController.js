var app = angular.module("ive_cms");

app.controller("videoDetailController", function ($scope, $videoService, $location, $routeParams, $sce, $filter) {

    $scope.subsite = "detail";
    $scope.editMode = false;

    $videoService.retrieve($routeParams.video_id)
        .then(function onSuccess(response) {

            $scope.video = response.data;
            
            // Style date to 
            $scope.video.recorded = $filter('timestamp')($scope.video.recorded);
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

        $scope.editMode = true;
        // Enable input Fields
        var inputFields = angular.element('.col-10 > .form-control').removeAttr('disabled');

    }

    // Function that is triggered when the in editMode accessible button "delete" is clicked
    $scope.saveVideo = function (){
        console.log($scope.video);

        // Validate input

        // Save using $videoService

    }


});