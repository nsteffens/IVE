var app = angular.module("ive_cms");

app.controller("scenarioCreateNewController", function ($scope, $scenarioService, $location) {


    // $scope.subsite = "create-new";

    console.log("inside angular");


    /**
     * [redirect description]
     * @param  {[type]} path [description]
     * @return {[type]}      [description]
     */
    $scope.redirect = function (path) {
        $location.url(path);
    };



});