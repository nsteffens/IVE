var app = angular.module("routes", []);

/**
 * Routing for the CMS
 */

app.config(function ($routeProvider, $locationProvider, config) {

    $routeProvider
        .when("/", {
            templateUrl: "js/templates/home.html",
            controller: "homeController"
        })
        // .when("/scenarios", {
        //     templateUrl: "js/templates/scenariosOverview.html",
        //     controller: "scenarioOverviewController"
        // })

        // Redirect to home page
        .otherwise({
            redirectTo: "/"
        });

        $locationProvider.html5Mode(config.html5Mode);
})


/**
 * [checkAuthentication description]
 * @param  {[type]} $q                     [description]
 * @param  {[type]} $location              [description]
 * @param  {[type]} $authenticationService [description]
 * @return {[type]}                        [description]
 */
var checkAuthentication = function ($q, $location, $authenticationService) {
	if ($authenticationService.authenticated()) {
		return true;
	} else {
		// Redirect
		$location.url("/");
	}
};