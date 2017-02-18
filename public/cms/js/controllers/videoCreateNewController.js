var app = angular.module("ive_cms");

app.controller("videoCreateNewController", function ($scope, $videoService, $location, $document, Upload) {


    $scope.existingVideo = false;

        $scope.newVideo = {
            name: "",
            description: "",
            tags: [],
            recorded: null,
            location: { latitude: 0, longitude: 0 }
        }  

       // Small function to switch the variable
    $scope.switchVideoType = function () {
        if ($scope.existingVideo) {
            $scope.existingVideo = false;
        } else {
            $scope.existingVideo = true;
        }
    }

        /**
     * [redirect description]
     * @param  {[type]} path [description]
     * @return {[type]}      [description]
     */
    $scope.redirect = function (path) {
        $location.url(path);
    };

});