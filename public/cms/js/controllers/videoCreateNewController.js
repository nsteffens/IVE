var app = angular.module("ive_cms");

app.controller("videoCreateNewController", function ($scope, $videoService, $location, $locationService, $document, Upload) {

    $scope.existingLocation = false;

    console.log($scope);
    $scope.newVideo = {
        name: "",
        description: "",
        tags: [],
        recorded: null,
        location: { latitude: 0, longitude: 0 }
    }

    //$scope.uploadingVideo = null;

    // console.log(uploadingVideo);

    $scope.submit = function(){

        // Validate input data here and then call:
        $scope.upload();

    }
    // Accept Uploaded files and send them to the backend server
    // TODO: Think about how the videos are ordered on the fs --> create location
    // before the upload is initialised


    $scope.upload = function () {
        // Placeholder for testing..
        var location_id = 1;
        
        console.log("Uploading...");

        // Get location if existing or create a new one...

        Upload.upload({
            url: '/cms/videos/upload',
            data: { file: $scope.uploadingVideo, 'location_id': location_id }
        })
            .progress(function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log(evt);
                console.log('progress: ' + progressPercentage + '% ' + evt.config._file.name);
            })
            .success(function (data, status, headers, config) {
                console.log('file ' + config._file.name + 'uploaded. Response: ' + data);
            })
            .error(function (data, status, headers, config) {
                console.log('error status: ' + status);
            })
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