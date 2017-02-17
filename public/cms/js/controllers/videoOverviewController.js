var app = angular.module("ive_cms");

app.controller("videoOverviewController", function ($scope, $videoService, $location) {

    // $scope.active = "scenarios";
    $scope.subsite = "overview";
    $scope.portraitView = true;


    $videoService.list()
        .then(function onSuccess(response) {
            $scope.videos = response.data;

            $scope.videos.forEach(function (element) {
                element.tags = ['tag1', 'tag2', 'tag3', 'tag4', 'tag5']
            }, this);
            // console.log(response);

            console.log($scope.videos);
        })

    /**
     * [redirect description]
     * @param  {[type]} path [description]
     * @return {[type]}      [description]
     */
    $scope.redirect = function (path) {
        $location.url(path);
    };
    
});