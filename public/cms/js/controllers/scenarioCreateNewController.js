var app = angular.module("ive_cms");

app.controller("scenarioCreateNewController", function ($scope, $scenarioService, $videoService, $location, $document, Upload, $sce) {

    $scope.currentState = {
        general: true,
        addVideo: false,
        addNewVideo: false,
        addExistingVideo: false,
        createOverlay: false,
        placeOverlay: false
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
        // console.log($scope.newScenario);

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


    // Function to cancel an action and be redirected back to the last page
    $scope.cancel = function (origin){

        switch (origin) {
            case 'AddVideo':
                $scope.currentState.addVideo = false;
                $scope.currentState.general = true;
                return;
            case 'createOverlay':
                $scope.currentState.createOverlay = false;
                $scope.currentState.addVideo = true;    
        }

    }

    $scope.createOverlay = function () {

        $scope.currentState.addVideo = false;
        $scope.currentState.createOverlay = true;
        angular.element('#step3').addClass('active');

        // Init video playback

        $scope.videoConfig = {
            sources: [
                {src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.mp4"), type: "video/mp4"}
            ],
            tracks: [],
            theme: "../bower_components/videogular-themes-default/videogular.css",
            // plugins: {
            //     poster: "http://www.videogular.com/assets/images/videogular.png"
            // }
        }

        // Variable to indicate wether to add an existing or a new overlay
        $scope.existingOverlay = false;

        var newOverlay = {
            name: "",
            description: "",
            tags: [],
            url: ""
        }

        console.log($scope.newScenario.videos);

    }

    $scope.placeOverlay = function () {

        $scope.currentState.createOverlay = false;
        $scope.currentState.placeOverlay = true;

    }

    // Small function to switch the variable
    $scope.switchOverlayType = function () {
        if ($scope.existingOverlay) {
            $scope.existingOverlay = false;
        } else {
            $scope.existingOverlay = true;
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

                // console.log($scope.newScenario.videos);
            })

    }
    $scope.videoDebug();




});