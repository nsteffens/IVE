var app = angular.module("ive_cms");

app.controller("videoOverviewController", function ($scope, $window, config, $videoService, $location, $authenticationService, $relationshipService) {

    // $scope.active = "scenarios";
    $scope.subsite = "overview";
    $scope.portraitView = true;

    // Authenticate with the backend to get permissions to delete content

    $authenticationService.authenticate(config.backendLogin)
        .then(function onSuccess(response) {
            $authenticationService.set(response.data);
        })
        .catch(function onError(response) {
            $window.alert(response.data);
        });


    $videoService.list()
        .then(function onSuccess(response) {
            $scope.videos = response.data;

            $scope.videos.forEach(function (element) {
                element.tags = ['tag1', 'tag2', 'tag3', 'tag4', 'tag5']
            }, this);
            // console.log(response);

            // TODO: Include Moment here and format the dates...
            // console.log($moment().format($scope.videos[0].created));
        })

    /**
     * [redirect description]
     * @param  {[type]} path [description]
     * @return {[type]}      [description]
     */
    $scope.redirect = function (path) {
        $location.url(path);
    };

    $scope.deleteVideo = function (video_id) {

        if ($window.confirm(`You are going to delete the Video. Are you sure? THIS WILL NOT BE REVERSIBLE!`)) {
            if ($window.confirm('Are you really, really sure?')) {

                $videoService.remove(video_id).then(function(response){
                    console.log('Video removed');
                });
                // Delete the video from the videos array
                $scope.videos.forEach(function (video, index) {

                    if (video.video_id == video_id) {
                        $scope.videos.splice(index, 1);
                    }

                }, this);

                // Delete relation to location
                $relationshipService.list_by_type('recorded_at').then(function (relations) {
                    relations.data.forEach(function (relation) {
                        if (relation.video_id == video_id) {
                            $relationshipService.remove(relation.relationship_id);
                        }
                    }, this);
                })

            }
        }

    }


});