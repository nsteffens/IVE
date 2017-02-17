var app = angular.module("ive_cms");

app.controller("scenarioCreateNewController", function ($scope, $scenarioService, $videoService, $location, $document, Upload) {

    $scope.currentState = {
        general: true,
        addVideo: false,
        addNewVideo: false,
        addExistingVideo: false
    };

    $scope.currentState.general = true;

    $scope.subsite = "create-new";

    $scope.newScenario = {
        name: "",
        description: "",
        tags: "",
        created: null,
        videos: []
    }


    /**
     * [redirect description]
     * @param  {[type]} path [description]
     * @return {[type]}      [description]
     */
    $scope.redirect = function (path) {
        $location.url(path);
    };

    $scope.submitGeneral = function () {

        // validate form input
        // format tags to array
        console.log($scope.newScenario);

        $scope.currentState.general = false;
        $scope.currentState.addVideo = true;

        angular.element('#step2').addClass('active');
    }

    $scope.addVideo = function () {

        $scope.currentState.addVideo = false;
        $scope.currentState.addNewVideo = true;

        $scope.existingVideo = false;

        $scope.newVideo = {
            name: "",
            description: "",
            tags: [],
            recorded: null,
            location: { latitude: 0, longitude: 0 }
        }


    }

    // Small function to switch the variable
    $scope.switchVideoType = function () {
        if ($scope.existingVideo) {
            $scope.existingVideo = false;
        } else {
            $scope.existingVideo = true;
        }
    }

    $scope.videoDebug = function () {

        $videoService.list()
            .then(function onSuccess(response) {
                // $scope.scenarios = response.data;

                // Just add 3 videos to the new scenario to see styling
                $scope.newScenario.videos.push(response.data[0]);
                $scope.newScenario.videos.push(response.data[1]);
                $scope.newScenario.videos.push(response.data[2]);

                // add scenario_position value
                var i = 1;
                $scope.newScenario.videos.forEach(function (element) {
                    element.scenario_position = i.toString();
                    i++;
                }, this);

                console.log($scope.newScenario.videos);
            })

    }
    $scope.videoDebug();


});