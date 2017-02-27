var app = angular.module("ive_cms");

app.controller("scenarioCreateNewController", function ($scope, config, $authenticationService, $locationService, $relationshipService, $scenarioService, $videoService, $overlayService, $location, $document, leafletData, Upload, $sce) {

    $scope.currentState = {
        general: true,          // General Information Input Screen
        addVideo: false,        // Screen where a new video is created
        scenarioVideoOverview: false,  // Overview over the scenario's videos
        // addExistingVideo: false,
        createOverlay: false,       // Overlay creation
        placeOverlay: false         // Overlay placement
    };

    $scope.currentState.general = true;

    $scope.subsite = "create-new";

    $scope.newScenario = {
        name: "",
        description: "",
        tags: ""
        // created: null,
    }

    // Authenticate with the backend to get permissions to create content
    $authenticationService.authenticate(config.backendLogin)
        .then(function onSuccess(response) {
            $authenticationService.set(response.data);
        })
        .catch(function onError(response) {
            $window.alert(response.data);
        });

    /**
     * [redirect description]
     * @param  {[type]} path [description]
     * @return {[type]}      [description]
     */
    $scope.redirect = function (path) {
        $location.url(path);
    };

    // Method to sumbit the general Scenario information, send it to the
    // server and handle the created object
    $scope.submitGeneral = function () {
        if ($scope.validateScenario()) {


            // Send Scenario to Service 
            // Include Tags here when implemented
            $scenarioService.create($scope.newScenario)
                .then(function (response) {
                    $scope.newScenario = response.data;
                    $scope.currentState.general = false;
                    $scope.currentState.scenarioVideoOverview = true;
                    angular.element('#step2').addClass('active');

                    console.log(response);
                    console.log($scope.newScenario);
                })
        }

        // FOR TESTING, REMOVE AFTERWARDS + enable validation function again:
        $scope.currentState.general = false;
        $scope.currentState.scenarioVideoOverview = true;
        angular.element('#step2').addClass('active');
        // FOR TESTING, REMOVE AFTERWARDS^^^^


    }


    // Function that triggers the addtion of a Video to the Scenario
    // Starts with a new Video Creation
    $scope.addVideo = function () {

        $scope.currentState.addVideo = true;
        $scope.currentState.scenarioVideoOverview = false;

        // indicates inside the scenarioVideoOverview state if you want to add a new or an existing vid
        $scope.existingVideo = false;
        $scope.existingLocation = true;

        $scope.newVideo = {
            name: "",
            description: "",
            tags: [],
            recorded: null,
            location: {}
        }

        $scope.featureGroup;

        // $scope.uploadingVideo = null;
        $scope.file_selected = false;

        $scope.setupAddNewVideoMap();


    }


    // onAddVideo Pressed
    $scope.submitVideo = function () {
        console.log($scope.currentState);

        // if ($scope.validateVideo()) {
        if (true) {
            if ($scope.existingVideo) {
                // Existing video

                console.log('existingVideo');
                console.log($scope.newVideo);


                //add video to scenario array + create relation here

                return;
            }
            // Now the case of a new video

            if ($scope.existingLocation) {
                console.log('new Video with existing loc');
                console.log($scope.newVideo);
                // No new location needs to be created

                // Create relations + continue to upload

            } else {

                console.log('new video with new loc');
                console.log($scope.newVideo);
                // Create location here
            }


            // Upload video here
            console.log('Lets go and upload something...');
            $scope.uploadStarted = false;   // set to true when the upload started...





            // console.log($scope.newVideo);
        }

    }







    // Function to cancel an action and be redirected back to the last page
    $scope.cancel = function (origin) {
        switch (origin) {
            case 'scenarioVideoOverview':
                $scope.currentState.addVideo = false;
                $scope.currentState.general = true;
                return;
            case 'createOverlay':
                $scope.currentState.createOverlay = false;
                $scope.currentState.addVideo = true;
            case 'addVideo':
                // $scope.existingVideo = false;
                $scope.currentState.scenarioVideoOverview = true;
                $scope.currentState.addVideo = false;
        }
    }

    $scope.createOverlay = function () {

        $scope.currentState.addVideo = false;
        $scope.currentState.createOverlay = true;
        angular.element('#step3').addClass('active');

        // Init video playback

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

    /**
     *  
     *  Type Switching Functions
     * 
     */

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
            $scope.setupAddNewVideoMap()

        } else {
            $scope.existingVideo = true;
            $scope.setupAddExistingVideoMap();
        }
    }

    // Function to detect when file is selected at the new video upload process
    $scope.upload_change = function (evt) {
        if (evt.type == "change" || evt.type == "drop") {
            $scope.file_selected = true;
        }

        if (evt.type == "cleared") {
            $scope.file_selected = false;
        }
    }

    /**
     * 
     *  Validation Functions
     * 
     */

    $scope.validateScenario = function () {
        var name_input = angular.element('#name-input');
        var desc_input = angular.element('#desc-input');
        var tags_input = angular.element('#tags-input');
        // var created_input = angular.element('#created-input');

        var isValid = true;

        if ($scope.newScenario.name == "") {
            name_input.parent().parent().addClass('has-danger')
            name_input.addClass('form-control-danger');
            isValid = false;
        }

        if ($scope.newScenario.description == "") {
            desc_input.parent().parent().addClass('has-danger')
            desc_input.addClass('form-control-danger');
            isValid = false;
        }

        // Put tags in array
        if ($scope.newScenario.tags != "") {
            // Parse array, grab them by the comma and remove the #
            var tagArray = [];
            $scope.newScenario.tags.split(', ').forEach(function (element) {
                if (element.charAt(0) == "#") {
                    tagArray.push(element.slice(1));
                }
            }, this);
            $scope.newScenario.tags_parsed = tagArray;
        }
        /**
         * 
         * Old Stuff, created date will be generated on the server...
         * 
         */

        // Validate the input for the date and parse it
        // if ($scope.newScenario.created != "") {

        //     // Try to create a new date
        //     var created_date = new Date($scope.newScenario.created);

        //     // Check if it has been parsed correctly
        //     if (isNaN(created_date)) {
        //         created_input.parent().parent().addClass('has-danger')
        //         created_input.addClass('form-control-danger');
        //         isValid = false;
        //     }

        //     // Catch dates in the future...
        //     if (created_date > new Date()) {
        //         created_input.parent().parent().addClass('has-danger')
        //         created_input.addClass('form-control-danger');
        //         isValid = false;
        //     }

        // } else {
        //     created_input.parent().parent().addClass('has-danger')
        //     created_input.addClass('form-control-danger');
        //     isValid = false;
        // }


        /**
         * 
         * Enable this below again, after testing is done..
         * 
         */


        // if (isValid) {
        //     return true;
        // } else return false;


        // For testing:
        return false;

    }

    $scope.validateVideo = function () {

        var name_input = angular.element('#video_name-input');
        var desc_input = angular.element('#video_desc-input');
        var tags_input = angular.element('#video_tags-input');
        var recorded_input = angular.element('#video_recorded-input');

        var isValid = true;

        if ($scope.newVideo.name == "") {
            name_input.parent().parent().addClass('has-danger')
            name_input.addClass('form-control-danger');
            isValid = false;
        }

        if ($scope.newVideo.description == "") {
            desc_input.parent().parent().addClass('has-danger')
            desc_input.addClass('form-control-danger');
            isValid = false;
        }

        // Put tags in array
        if ($scope.newVideo.tags != "") {
            // Parse array, grab them by the comma and remove the #
            var tagArray = [];
            $scope.newVideo.tags.split(', ').forEach(function (element) {
                if (element.charAt(0) == "#") {
                    tagArray.push(element.slice(1));
                }
            }, this);
            $scope.newVideo.tags_parsed = tagArray;
        }


        if ($scope.newVideo.recorded != null) {

            // Try to create a new date
            var created_date = new Date($scope.newVideo.recorded);

            // Check if it has been parsed correctly
            if (isNaN(created_date)) {
                recorded_input.parent().parent().addClass('has-danger')
                recorded_input.addClass('form-control-danger');
                isValid = false;
            }

            // Catch dates in the future...
            if (created_date > new Date()) {
                recorded_input.parent().parent().addClass('has-danger')
                recorded_input.addClass('form-control-danger');
                isValid = false;
            }

        } else {
            recorded_input.parent().parent().addClass('has-danger')
            recorded_input.addClass('form-control-danger');
            isValid = false;
        }

        // TODO: Check Location;


        if (isValid) {
            return true;
        } else {
            return false;
        }

    }

    /**
     * 
     *  Map Settings & setUp functions
     * 
     */

    angular.extend($scope, {
        defaults: {
            tileLayer: "http://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png",
            tileLayerOptions: {
                opacity: 0.9,
                detectRetina: true,
                reuseTiles: true
            },
            scrollWheelZoom: false
        }
    });

    $scope.setupAddNewVideoMap = function () {

        var locationMarkers = [];
        // Get all locations and create markers for them;
        $locationService.list().then(function onSuccess(response) {
            response.data.forEach(function (location) {
                // Exclude indoor locations and those which are wrongly located at 0/0
                if (location.location_type != "indoor" && location.lat != 0 && location.lng != 0) {

                    // locations.push(location);
                    var markerOptions = {
                        clickable: true
                    }

                    var popupContent = `Location: ${location.name}`;
                    var marker = new L.Marker(L.latLng(location.lat, location.lng), markerOptions).bindPopup(popupContent);
                    marker.on('click', function (e) {
                        $scope.newVideo.location.lat = e.latlng.lat;
                        $scope.newVideo.location.lng = e.latlng.lng;
                        // $scope.newVideo.location.l_id = location.l_id;
                        $scope.newVideo.location.name = location.name;

                        // location_id = location.location_id;
                        $scope.newVideo.location.location_id = location.location_id;
                        // $scope.newLocation = location;
                        // $scope.createLocation = false;
                        $scope.existingLocation = true;
                        // console.log($scope.newVideo);

                    })
                    locationMarkers.push(marker);
                }
            }, this);

            leafletData.getMap('addNewVideoMap').then(function (map) {

                $scope.featureGroup = L.featureGroup(locationMarkers).addTo(map);
                map.fitBounds($scope.featureGroup.getBounds(), { animate: false, padding: L.point(50, 50) });

                // Add colored marker to the center
                var myIcon = new L.Icon({
                    iconUrl: 'images/customMarker.png',
                    iconRetinaUrl: 'images/customMarker@2x.png',
                    iconSize: [25, 41],
                    iconAnchor: [12, 41]
                })

                var ownMarkerOptions = {
                    icon: myIcon,
                    draggable: true,
                    riseOnHover: true
                }

                var ownMarker = new L.Marker(map.getCenter(), ownMarkerOptions);

                ownMarker.on('dragend', function (e) {
                    //Clear to have a clean new location
                    $scope.newVideo.location = {};

                    $scope.newVideo.location.lat = e.target._latlng.lat;
                    $scope.newVideo.location.lng = e.target._latlng.lng;
                    $scope.existingLocation = false;
                })

                var popupContent = 'Drag this marker to select a new Location!';
                ownMarker.addTo(map);
            })
        });
    }

    $scope.setupAddExistingVideoMap = function () {

        var videoMarkers = [];

        $videoService.list().then(function (videos) {
            console.log(videos);
            // Get recorded_At relations
            $relationshipService.list_by_type('recorded_at').then(function (relations) {
                console.log(relations);


                // create markers from recorded at relation when video.video_id relation.video_id matches
                videos.data.forEach(function (video, video_index) {

                    relations.data.forEach(function (relation) {

                        if (video.video_id == relation.video_id) {

                            var myIcon = new L.Icon({
                                iconUrl: 'images/customMarker.png',
                                iconRetinaUrl: 'images/customMarker@2x.png',
                                iconSize: [25, 41],
                                iconAnchor: [12, 41]
                            })


                            var popupContent = `Video: ${relation.video_name} <br> Description: ${relation.video_description} `;
                            var marker = new L.Marker(L.latLng(relation.location_lat, relation.location_lng), { clickable: true, icon: myIcon }).bindPopup(popupContent);

                            marker.on('click', function (e) {
                                // Select existing video
                                console.log('Clicked Video!');
                                console.log(video.name);

                            })

                            videoMarkers.push(marker);

                            console.log(videos.data.length);
                            if (video_index == videos.data.length - 1) {
                                leafletData.getMap('addExistingVideoMap').then(function (map) {

                                    console.log(videoMarkers);
                                    $scope.featureGroup = new L.featureGroup(videoMarkers).addTo(map);

                                    console.log($scope.featureGroup);

                                    map.fitBounds($scope.featureGroup.getBounds(), { animate: false, padding: L.point(50, 50) });

                                })
                            }
                        }

                    }, this);


                }, this);



            })



        })





    }

    /**
     * 
     *  Debug and testing methods
     * 
     */

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
    //$scope.videoDebug();







});


