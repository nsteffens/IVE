var app = angular.module("ive_cms");

app.controller("scenarioDetailController", function ($scope, $rootScope, $window, $document, config, $authenticationService, $scenarioService, $locationService, $relationshipService, $overlayService, $location, $routeParams, $sce, $filter, leafletData) {

    $scope.subsite = "detail";
    $scope.editMode = false;

    // Input fields
    var name_input = angular.element('#name-input');
    var desc_input = angular.element('#desc-input');
    var tags_input = angular.element('#tags-input');
    var created_input = angular.element('#created-input');

    $rootScope.currentCategory = "Scenarios";
    $rootScope.redirectBreadcrumb = function () {
        $location.url('/scenarios');
    }
    $rootScope.currentSite = null;

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

            $rootScope.currentSite = "Scenario: '" + $scope.scenario.name + "'";

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
                $relationshipService.list_by_type('recorded_at').then(function onSuccess(response_rec) {
                    var video_locations = response_rec.data;

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
                                    var videoMarker = new L.Marker(location, {
                                        clickable: true
                                    }).bindPopup(popupContent);
                                    videoMarkers.push(videoMarker);
                                }
                            }
                        })
                    })

                    leafletData.getMap('scenarioDetailMap').then(function (map) {
                        var featureGroup = new L.featureGroup(videoMarkers).addTo(map);
                        map.fitBounds(featureGroup.getBounds(), {
                            animate: false,
                            padding: L.point(50, 50)
                        })
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
        // Validate input
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
            $scenarioService.edit($scope.scenario.scenario_id, $scope.scenario).then(function (response) {
                if (response.status == 200) {
                    $scope.redirect('/scenarios');
                }
            });
        }
    }

    $scope.deleteVideo = function (video_id) {
        if ($window.confirm(`You are going to remove this Video from the Scenario. Are you sure? THIS WILL NOT BE REVERSIBLE!`)) {
            if ($window.confirm('Are you really, really sure?')) {
                var video_to_delete;

                // Remove Video from the (over)view
                $scope.scenario.videos.forEach(function (video, index) {

                    if (video.video_id == video_id) {
                        video_to_delete = video;
                        $scope.scenario.videos.splice(index, 1);
                    }
                })

                // Remove belongs_to relation
                // Disabled -- too dangerous for now ;-)
                $relationshipService.remove(video_to_delete.relationship_id).then(function onSuccess(response){

                })
            }
        }

    }

    $scope.deleteOverlay = function (video_id, overlay_id) {

        if ($window.confirm(`You are going to remove this Overlay from the Video. Are you sure? THIS WILL NOT BE REVERSIBLE!`)) {
            if ($window.confirm('Are you really, really sure?')) {
                $scope.scenario.videos.forEach(function (video, index) {
                    if (video.video_id == video_id) {
                        $scope.scenario.videos[index].overlays.forEach(function (overlay, overlayIndex) {
                            if (overlay.overlay_id == overlay_id) {
                                $scope.scenario.videos[index].overlays.splice(overlayIndex, 1);

                                $relationshipService.remove(overlay.relationship_id).then(function onSuccess(response) {
                                })
                            }
                        })
                    }
                })

            }
        }

    }

    $scope.repositionOverlay = function (overlay) {
        $scope.repositionOverlayState = true;
        $scope.positioningOverlay = overlay;

        var videoExtension = $scope.positioningOverlay.video_url.split('.')[1];

        // Wenn keine extension in der URL war..
        if (videoExtension == null) {
            videoExtension = 'mp4';
            $scope.positioningOverlay.video_url += '.mp4';
        }

        $scope.videoConfig = {
            sources: [{
                src: $sce.trustAsResourceUrl($scope.positioningOverlay.video_url),
                type: "video/" + videoExtension
            }],
            tracks: [],
            theme: "../bower_components/videogular-themes-default/videogular.css",
        }
    }

    $scope.saveOverlayPosition = function () {
        // This will be implemented when the positioning is done correctly..

        console.log('Overlay Saving Simulation...');
        $scope.redirect('/scenarios/' + $scope.scenario.scenario_id);
        $scope.repositionOverlayState = false;
    }

});

// Directive to handle the overlay positioning mockup
app.directive('ngDraggable', function ($document) {
    return {
        restrict: 'A',
        scope: {
            dragOptions: '=ngDraggable'
        },
        link: function (scope, elem, attr) {
            var startX, startY, x = 0,
                y = 0,
                start, stop, drag, container;

            var width = elem[0].offsetWidth,
                height = elem[0].offsetHeight;

            // Obtain drag options
            if (scope.dragOptions) {
                start = scope.dragOptions.start;
                drag = scope.dragOptions.drag;
                stop = scope.dragOptions.stop;
                var id = scope.dragOptions.container;
                if (id) {
                    container = document.getElementById(id).getBoundingClientRect();
                }
            }

            // Bind mousedown event
            elem.on('mousedown', function (e) {
                e.preventDefault();
                startX = e.clientX - elem[0].offsetLeft;
                startY = e.clientY - elem[0].offsetTop;
                $document.on('mousemove', mousemove);
                $document.on('mouseup', mouseup);
                if (start) start(e);
            });

            // Handle drag event
            function mousemove(e) {
                y = e.clientY - startY;
                x = e.clientX - startX;
                setPosition();
                if (drag) drag(e);
            }

            // Unbind drag events
            function mouseup(e) {
                $document.unbind('mousemove', mousemove);
                $document.unbind('mouseup', mouseup);
                if (stop) stop(e);
            }

            // Move element, within container if provided
            function setPosition() {
                if (container) {
                    if (x < container.left) {
                        x = container.left;
                    } else if (x > container.right - width) {
                        x = container.right - width;
                    }
                    if (y < container.top) {
                        y = container.top;
                    } else if (y > container.bottom - height) {
                        y = container.bottom - height;
                    }
                }

                elem.css({
                    top: y + 'px',
                    left: x + 'px'
                });
            }
        }
    }

})