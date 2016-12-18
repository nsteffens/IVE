var colors = require('colors');
var async = require('async');
var neo4j = require('neo4j-driver').v1;
var _ = require('underscore');
var moment = require('moment');
var driver = require('../../server.js').driver;
var fs = require("fs");
var query_get_scenario = fs.readFileSync(__dirname + '/../../queries/scenarios/get.cypher', 'utf8').toString();
var io = require("socket.io-client");
var httpPort = require('../../server.js').httpPort;


// SET SCENARIO
exports.request = function(req, res) {
    console.log(colors.yellow("Set scenario: " + req.params.scenario_id));

    // Start session
    var session = driver.session();

    async.waterfall([
        function(callback) { // Find entry by Id
            session
                .run(query_get_scenario, {
                    scenario_id: req.params.scenario_id
                })
                .then(function(result) {
                    // Check if Scenario exists
                    if (result.records.length === 0) {
                        callback(new Error("Scenario with id '" + req.params.scenario_id + "' not found!"), 404);
                    } else {
                        callback(null, result);
                    }
                })
                .catch(function(err) {
                    callback(err, 500);
                });
        },
        function(result, callback){ // Format attributes
            /*var results = [];

            async.forEachOf(result.records, function(record, item, callback) {
                var object = {};

                async.forEachOf(record.keys, function(key, item, callback) {

                    if (typeof(record._fields[item]) === 'object') {
                        if (key === 'id') {
                            object[key] = Number(record._fields[item].low);
                        } else if (record._fields[item] === null) {
                            object[key] = record._fields[item];
                        } else {
                            object[key] = Number(record._fields[item]);
                        }
                    } else {
                        object[key] = record._fields[item];
                    }
                    callback();
                }, function() {
                    results.push(object);
                    callback();
                });

            }, function() {
                // Send Websocket-Message
                var client = io.connect("http://localhost:" + httpPort);
                client.on('connect',function() {
                    client.emit('/set/location', results[0]);
                    client.close();
                    callback(null, 204, null);
                });
            });*/

            // Send Websocket-Message
            var client = io.connect("http://localhost:" + httpPort);
            client.on('connect',function() {
                client.emit('/set/location', {
                    scenario_id: req.params.scenario_id
                });
                client.close();
                callback(null, 204, null);
            });
        }
    ], function(err, code, result){
        // Close session
        session.close();

        // Send response
        if(err){
            console.error(colors.red(JSON.stringify(err)));
            res.status(code).send(err.message);
        } else {
            res.status(code).send(result);
        }
    });

};
