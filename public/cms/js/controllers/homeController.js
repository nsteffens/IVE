var app = angular.module("ive_cms");

app.controller("homeController", function ($scope, $relationshipService, leafletData) {
    $relationshipService.list_by_type("belongs_to", "location")
        .then(function onSuccess(response) {
            $scope.locations = response.data;


            // Prepared for map manipulation...
            leafletData.getMap().then(function (map) {


            })

            console.log(response);
        })
        .catch(function onError(response) {
            $window.alert(response.data);
        });

    angular.extend($scope, {
        london: {
            lat: 51.505,
            lng: -0.09,
            zoom: 4
        },
        markers: {
            myMarker: {
                lat: 51.505,
                lng: -0.09,
                focus: false,
                icon: {}
            }
        }
    });


});



