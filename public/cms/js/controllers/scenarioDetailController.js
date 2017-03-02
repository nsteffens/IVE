var app = angular.module("ive_cms");

app.controller("scenarioDetailController", function ($scope, $window, config, $authenticationService, $scenarioService, $locationService, $relationshipService, $overlayService, $location, $routeParams, $sce, $filter, leafletData) {

    $scope.subsite = "detail";
    $scope.editMode = false;

    // Input fields
    var name_input = angular.element('#name-input');
    var desc_input = angular.element('#desc-input');
    var tags_input = angular.element('#tags-input');
    var created_input = angular.element('#created-input');

    $authenticationService.authenticate(config.backendLogin)
        .then(function onSuccess(response) {
            $authenticationService.set(response.data);
        })
        .catch(function onError(response) {
            $window.alert(response.data);
        });
    /**
     * 
     *      INIT
     * 
     */

    $scenarioService.retrieve($routeParams.scenario_id)
        .then(function onSuccess(response) {
            $scope.scenario = response.data;
            $scope.scenario.videos = [];

            // Style date 
            $scope.scenario.created = $filter('timestamp')($scope.scenario.created);
            $scope.scenario.tags = ['tag1,tag2,tag3'];

            // Get relationship to get the belonging videos
            $relationshipService.list_by_type('belongs_to', 'video').then(function onSuccess(response) {
                var video_relations = response.data;
                video_relations.forEach(function (relation) {
                    if (relation.scenario_id == $scope.scenario.scenario_id) {
                        $scope.scenario.videos.push(relation);
                    }

                }, this);

                // Get the Location for each video and attach it
                $relationshipService.list_by_type('recorded_at').then(function onSuccess(response) {
                    var video_locations = response.data;

                    var videoMarkers = [];

                    video_locations.forEach(function (relation) {
                        $scope.scenario.videos.forEach(function (video, index) {
                            if (relation.video_id == video.video_id) {
                                $scope.scenario.videos[index].location = relation;
                                $scope.scenario.videos[index].overlays = [];

                                // Create Marker for every video's location
                                if ($scope.scenario.videos[index].location.location_type == 'outdoor') {
                                    var location = new L.latLng($scope.scenario.videos[index].location.location_lat, $scope.scenario.videos[index].location.location_lng);
                                    var popupContent = `Video: ${$scope.scenario.videos[index].video_name} <br> Location: ${$scope.scenario.videos[index].location.location_name}`;
                                    var videoMarker = new L.Marker(location, { clickable: true }).bindPopup(popupContent);
                                    videoMarkers.push(videoMarker);
                                }
                            }
                        })
                    })

                    leafletData.getMap('scenarioDetailMap').then(function (map) {
                        var featureGroup = new L.featureGroup(videoMarkers).addTo(map);
                        map.fitBounds(featureGroup.getBounds(), { animate: false, padding: L.point(50, 50) })
                    });


                    // Get the Overlays for each video and attach them

                    $relationshipService.list_by_type('embedded_in').then(function onSuccess(response) {
                        var overlay_relations = response.data;
                        overlay_relations.forEach(function (relation) {
                            var i = 0;
                            $scope.scenario.videos.forEach(function (video, index) {
                                if (relation.video_id == video.video_id) {
                                    $scope.scenario.videos[index].overlays[i] = relation;
                                    i++;
                                }
                                if (i > 1) {
                                    $scope.scenario.videos[index].multipleOverlays = true
                                }
                            })
                        });
                    })
                })
            })
            /**
             * 
             *  Find Relations between the locations to see triggerable 'options'
             *  Since I can't contact the service yet to indentify them per scenario
             *  this will be added later
             * 
             */

            // $relationshipService.list_by_type('connected_to').then(function onSuccess(response) {
            //     // console.log(response.data);
            //     // console.log($scope.scenario)

            // })

        });

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

    /**
     * [redirect description]
     * @param  {[type]} path [description]
     * @return {[type]}      [description]
     */
    $scope.redirect = function (path) {
        $location.url(path);
    };

    // Function that is triggered, when the edit button has been pressed
    $scope.editScenario = function () {

        if ($scope.editMode) {
            $scope.editMode = false;
            name_input.prop('disabled', true);
            desc_input.prop('disabled', true);
            tags_input.prop('disabled', true);
            created_input.prop('disabled', true);
        } else {
            $scope.editMode = true;
            // Enable input Fields
            angular.element('.col-10 > .form-control').removeAttr('disabled');
        }
    }

    // Function that is triggered when the in editMode accessible button "delete" is clicked
    $scope.saveScenario = function () {
        console.log($scope.scenario);

        // Validate input

        // Save using $videoService

        var isValid = true;

        if ($scope.scenario.name == "") {
            name_input.parent().parent().addClass('has-danger')
            name_input.addClass('form-control-danger');
            isValid = false;
        }

        if ($scope.scenario.description == "") {
            desc_input.parent().parent().addClass('has-danger')
            desc_input.addClass('form-control-danger');
            isValid = false;
        }

        // Needs to be enabled when the tags are ready
        /*
        if ($scope.video.tags != "") {
            // Parse array, grab them by the comma and remove the #
            var tagArray = [];
            $scope.video.tags.split(', ').forEach(function (element) {
                if (element.charAt(0) == "#") {
                    tagArray.push(element.slice(1));
                }
            }, this);
            $scope.video.tags = tagArray;
        }
        */

        if ($scope.scenario.created != "") {
            // Trying to create a new date
            var created_date = new Date(parseInt($scope.scenario.created.split('-')[0]), parseInt($scope.scenario.created.split('-')[1] - 1), parseInt($scope.scenario.created.split('-')[2]));
            // Check if it has been parsed correctly
            if (isNaN(created_date)) {
                created_input.parent().parent().addClass('has-danger')
                created_input.addClass('form-control-danger');
                isValid = false;
                console.log(isNaN(created_date));
            }

            // Catch dates in the future...
            if (created_date > new Date()) {
                created_input.parent().parent().addClass('has-danger')
                created_input.addClass('form-control-danger');
                isValid = false;
            }

        } else {
            created_input.parent().parent().addClass('has-danger')
            created_input.addClass('form-control-danger');
            isValid = false;
        }

        if (isValid) {
            console.log('saving video?')
            $scenarioService.edit($scope.scenario.scenario_id, $scope.scenario).then(function (response) {
                if (response.status == 200) {
                    $scope.redirect('/scenarios');
                }
            });
        }
    }

    $scope.deleteVideo = function (video_id) {
        console.log(video_id);

        if ($window.confirm(`You are going to remove this Video from the Scenario. Are you sure? THIS WILL NOT BE REVERSIBLE!`)) {
            if ($window.confirm('Are you really, really sure?')) { 
                var video_to_delete;

                // Remove Video from the (over)view
                $scope.scenario.videos.forEach(function(video, index){
                    
                    if(video.video_id == video_id){
                        video_to_delete = video;
                        $scope.scenario.videos.splice(index, 1);
                    }
                })

                // Remove belongs_to relation
                // Disabled -- too dangerous ;-)
                // $relationshipService.remove(video_to_delete.relationship_id).then(function(response){

                // })
            }
        }

    }

    $scope.deleteOverlay = function (overlay_id){

    }
    // $scope.deleteVideo = function () {

    //     if ($window.confirm(`You are going to delete the Video. Are you sure? THIS WILL NOT BE REVERSIBLE!`)) {
    //         if ($window.confirm('Are you really, really sure?')) {

    //             $videoService.remove($scope.video.video_id).then(function (response) {
    //                 console.log('Video removed');
    //             });

    //             // Delete relation to the location
    //             $relationshipService.list_by_type('recorded_at').then(function (relations) {

    //                 relations.data.forEach(function (relation) {
    //                     if (relation.video_id == $scope.video_id) {
    //                         $relationshipService.remove(relation.relationship_id).then(function (response) {

    //                             if (response.status == 200) {
    //                                 $scope.redirect('/videos');
    //                             } else {
    //                                 console.log(response);
    //                                 $scope.redirect('/videos');
    //                             }
    //                         })
    //                     }
    //                 }, this);
    //                 // Fallback if there is no relation to be deleted - shouldn't be the case in production though..
    //                 $scope.redirect('/videos');
    //             })

    //         }
    //     }
    // }



});