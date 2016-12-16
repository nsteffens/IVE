var colors = require('colors');
var async = require('async');
var neo4j = require('neo4j-driver').v1;
var _ = require('underscore');
var moment = require('moment');
var driver = require('../../server.js').driver;
var fs = require("fs");
var query = fs.readFileSync(__dirname + '/../../queries/scenarios/get.cypher', 'utf8').toString();
var io = require("socket.io-client");
var httpPort = require('../../server.js').httpPort;


// SET SCENARIO
exports.request = function(req, res) {

    var session = driver.session();
    session
        .run(query, {
            scenario_id: req.params.scenario_id
        })
        .then(function(result) {
            session.close();
            var results = [];

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

            }, function(err) {
                if (err) {
                    console.error(colors.red(JSON.stringify(err)));
                    res.status(500).send(err);
                } else {

                    // Check if Scenario exists
                    if (results.length === 0) {
                        console.log(colors.red("Scenario with id '" + req.params.scenario_id + "' not found!"));
                        res.status(404).send("Scenario not found!");
                    } else {

                        // Send Websocket-Message
                        var client = io.connect("http://localhost:" + httpPort);
                        client.on('connect',function() {
                            client.emit('/set/scenario', results[0]);
                            client.close();

                            // Send Result
                            res.status(204).send();
                        });

                    }
                }
            });

        })
        .catch(function(err) {
            console.error(colors.red(JSON.stringify(err)));
            res.status(500).send(err);
        });

};