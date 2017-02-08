var app = angular.module("ive_cms", [

    // App Settings
    "config",

    // External Modules
    "ngRoute",
    "ngSanitize",
    // "pascalprecht.translate",
    "angular-momentjs",

    // Own Modules

    "routes",
    // "languages",
    // "filters",

    // Services

    // "authenticationService",
    // "scenarioService",
    // "locationService",
    // "videoService",
    // "relationshipService"
]);

/**
 * Log Provider
 * turn on/off debug logging
 */
app.config(function($logProvider, config) {
    $logProvider.debugEnabled(config.debugMode);
});


/**
 * Start application
 */
app.run(function(/*$translate,*/ config) {

    // Use Translator and set Language
    //$translate.use(config.appLanguage);

});