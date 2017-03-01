var app = angular.module("ive_cms");

app.controller("scenarioOverviewController", function ($scope, $window, $scenarioService, $relationshipService, $location, $authenticationService, config) {

    // $scope.active = "scenarios";
    $scope.subsite = "overview";
    $scope.portraitView = true;

    $authenticationService.authenticate(config.backendLogin)
        .then(function onSuccess(response) {
            $authenticationService.set(response.data);
        })
        .catch(function onError(response) {
            $window.alert(response.data);
        });

    $scenarioService.list()
        .then(function onSuccess(response) {
            $scope.scenarios = response.data;

            $scope.scenarios.forEach(function (element) {
                element.tags = ['tag1', 'tag2', 'tag3', 'tag4', 'tag5']
            }, this);

            // console.log($scope.scenarios);
        })

    /**
     * [redirect description]
     * @param  {[type]} path [description]
     * @return {[type]}      [description]
     */
    $scope.redirect = function (path) {
        $location.url(path);
    };

    $scope.deleteScenario = function (scenario_id) {
        console.log(scenario_id);
        if ($window.confirm(`You are going to delete the Scenario. Are you sure? THIS WILL NOT BE REVERSIBLE!`)) {
            if ($window.confirm('Are you really, really sure?')) {

                // First delete any relationships the scenario has
                // Since the API doesn't give a way to display all belongs_to relations we need to
                // do it individually for every 'label' (overlay, loc, vid) of belongs_to relation
                $relationshipService.list_by_type('belongs_to', 'video').then(function (response) {
                    var relations = response.data;
                    relations.forEach(function (relation) {
                        if (relation.scenario_id == scenario_id) {
                            $relationshipService.remove(relation.relation_id);
                        }
                    }, this);
                })

                $relationshipService.list_by_type('belongs_to', 'location').then(function (response) {
                    var relations = response.data;
                    relations.forEach(function (relation) {
                        if (relation.scenario_id == scenario_id) {
                            $relationshipService.remove(relation.relation_id);
                        }
                    }, this);
                })


                $relationshipService.list_by_type('belongs_to', 'overlay').then(function (response) {
                    var relations = response.data;
                    relations.forEach(function (relation) {
                        if (relation.scenario_id == scenario_id) {
                            $relationshipService.remove(relation.relation_id);
                        }
                    }, this);
                })


                // Then remove the scenario
                $scenarioService.remove(scenario_id).then(function (response) {
                    console.log(response);
                    // .. and remove it from the list that is displayed in the view
                    $scope.scenarios.forEach(function (scenario, index) {
                        if (scenario.scenario_id == scenario_id) {
                            $scope.scenarios.splice(index, 1);
                        }
                    }, this);

                })


            }
        }
    }



});