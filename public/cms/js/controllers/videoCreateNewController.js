var app = angular.module("ive_cms");

app.controller("videoCreateNewController", function ($scope, $videoService, $location, $locationService, $document, Upload, leafletData) {

    $scope.file_selected = false;

    $scope.newVideo = {
        name: "",
        description: "",
        tags: "",
        recorded: "",
        location: { latitude: 0, longitude: 0 }
    }

    // Input fields
    var name_input = angular.element('#name-input');
    var desc_input = angular.element('#desc-input');
    var tags_input = angular.element('#tags-input');
    var recorded_input = angular.element('#recorded-input');

    // Boolean indicating if the forms are valid
    var isValid = null;

    // Leaflet Map Init

    var locationMarkers = [];
    var featureGroup;
    var location_id;

    $locationService.list().then(function onSuccess(response) {
        console.log(response.data);
        response.data.forEach(function (location) {
            // Exclude indoor locations and those which are wrongly located at 0/0
            if (location.location_type != "indoor" && location.lat != 0 && location.lng != 0) {
                var markerOptions = {
                    clickable: true
                }

                var popupContent = `Location: ${location.name}`;
                var marker = new L.Marker(L.latLng(location.lat, location.lng), markerOptions).bindPopup(popupContent);
                marker.on('click', function (e) {
                    $scope.newVideo.location.latitude = e.latlng.lat;
                    $scope.newVideo.location.longitude = e.latlng.lng;
                })
                locationMarkers.push(marker);
            }
        }, this);

        leafletData.getMap('addNewVideoMap').then(function (map) {

            featureGroup = L.featureGroup(locationMarkers).addTo(map);
            map.fitBounds(featureGroup.getBounds(), { animate: false, padding: L.point(50, 50) });

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
                $scope.newVideo.location.latitude = e.target._latlng.lat;
                $scope.newVideo.location.longitude = e.target._latlng.lng;
            })

            ownMarker.addTo(map);
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

    $scope.submit = function () {

        isValid = true;

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

        // Validate the input for the date and parse it
        if ($scope.newVideo.recorded != "") {

            // Try to create a new date
            var recorded_date = new Date($scope.newVideo.recorded);

            // Check if it has been parsed correctly
            if (isNaN(recorded_date)) {
                recorded_input.parent().parent().addClass('has-danger')
                recorded_input.addClass('form-control-danger');
                isValid = false;
            }

            // Catch dates in the future...
            if (recorded_date > new Date()) {
                recorded_input.parent().parent().addClass('has-danger')
                recorded_input.addClass('form-control-danger');
                isValid = false;
            }

        } else {
            recorded_input.parent().parent().addClass('has-danger')
            recorded_input.addClass('form-control-danger');
            isValid = false;
        }

        // Check if file has been selected
        if (isValid && $scope.uploadingVideo != null) {
            $scope.upload();
        }

        console.log($scope.uploadingVideo);


    }

    $scope.upload_change = function (evt) {
        if (evt.type == "change" || evt.type == "drop") {
            $scope.file_selected = true;
        }

        console.log(evt.type);

        if (evt.type == "cleared") {
            $scope.file_selected = false;
        }
    }

    // Accept Uploaded files and send them to the backend server
    // TODO: Think about how the videos are ordered on the fs --> create location
    // before the upload is initialised
    $scope.upload = function () {
        // Placeholder for testing..
        var location_id = 1;

        $scope.uploadStarted = true;

        console.log("Uploading...");

        // Get location if existing or create a new one...
        $scope.uploadStatus = {
            currentPercentage: 0,
            loaded: 0,
            total: 0
        }

        Upload.upload({
            url: '/cms/videos/upload',
            data: { file: $scope.uploadingVideo, 'location_id': location_id }
        })
            .progress(function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                // console.log(evt);

                $scope.uploadStatus.currentPercentage = progressPercentage;
                $scope.uploadStatus.loaded = evt.loaded;
                $scope.uploadStatus.total = evt.total;

                angular.element('.progress-bar').attr('aria-valuenow', progressPercentage).css('width', progressPercentage + '%');
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