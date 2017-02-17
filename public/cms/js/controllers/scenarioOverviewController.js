var app = angular.module("ive_cms");

app.controller("scenarioOverviewController", function ($scope, $scenarioService, $location) {

    // $scope.active = "scenarios";
    $scope.subsite = "overview";
    $scope.portraitView = true;


    $scenarioService.list()
        .then(function onSuccess(response) {
            $scope.scenarios = response.data;

            $scope.scenarios.forEach(function (element) {
                element.tags = ['tag1', 'tag2', 'tag3', 'tag4', 'tag5']
            }, this);
            // console.log(response);

            console.log($scope.scenarios);
        })

    /**
     * [redirect description]
     * @param  {[type]} path [description]
     * @return {[type]}      [description]
     */
    $scope.redirect = function (path) {
        $location.url(path);
    };
    
});