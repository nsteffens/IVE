var app = angular.module("ive_cms");

app.controller("videoDetailController", function ($scope, $videoService, $locationService, $relationshipService, $location, $routeParams, $sce, $filter, leafletData) {

    $scope.subsite = "detail";
    $scope.editMode = false;

    $videoService.retrieve($routeParams.video_id)
        .then(function onSuccess(response) {

            $scope.video = response.data;

            // Style date to 
            $scope.video.recorded = $filter('timestamp')($scope.video.recorded);
            $scope.video.tags = ['tag1,tag2,tag3'];
            // console.log($scope.video);

            var videoExtension = $scope.video.url.split('.')[1];

            // Wenn keine extension in der URL war..
            if (videoExtension == null) {
                videoExtension = 'mp4';
                $scope.video.url += '.mp4';
            }
            console.log(videoExtension);
            console.log($scope.video.url);
            // Init video, TODO: Fill with real video and remove placeholder
            $scope.videoConfig = {
                sources: [
                    { src: $sce.trustAsResourceUrl($scope.video.url), type: "video/" + videoExtension }
                ],
                tracks: [],
                theme: "../bower_components/videogular-themes-default/videogular.css",
                // plugins: {
                //     poster: "/" + $scope.video.url + '_thumbnail.png'
                // }
            }


            // Get relationship to get the fitting location
            $relationshipService.list_by_type('recorded_at').then(function (results) {
                results.data.forEach(function (relation) {
                    if (relation.video_id == $scope.video.video_id) {

                        leafletData.getMap('videoDetailMap').then(function (map) {
                            var popupContent = `Location: ${relation.location_name}`;
                            var videoPositionMarker = new L.Marker(L.latLng(relation.location_lat, relation.location_lng), { clickable: true }).bindPopup(popupContent);
                            videoPositionMarker.addTo(map);
                            map.setView(videoPositionMarker._latlng, 14);
                        });
                    }

                }, this);
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
    $scope.editVideo = function () {

        $scope.editMode = true;
        // Enable input Fields
        var inputFields = angular.element('.col-10 > .form-control').removeAttr('disabled');

    }

    // Function that is triggered when the in editMode accessible button "delete" is clicked
    $scope.saveVideo = function () {
        console.log($scope.video);

        // Validate input

        // Save using $videoService

    }


});