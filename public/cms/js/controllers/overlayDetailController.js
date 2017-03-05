var app = angular.module("ive_cms");


app.controller("overlayDetailController", function ($scope, $routeParams, $window, config, $overlayService, $location, $authenticationService, $relationshipService) {

    $scope.subsite = "detail";

    $authenticationService.authenticate(config.backendLogin)
        .then(function onSuccess(response) {
            $authenticationService.set(response.data);
        })
        .catch(function onError(response) {
            $window.alert(response.data);
        });

        console.log($routeParams.overlay_id);

});