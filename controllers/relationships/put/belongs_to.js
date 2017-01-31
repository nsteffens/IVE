var colors = require('colors');
var async = require('async');
var neo4j = require('neo4j-driver').v1;
var _ = require('underscore');
var moment = require('moment');
var driver = require('../../../server.js').driver;
var fs = require("fs");
var query_belongs_to_locations = fs.readFileSync(__dirname + '/../../../queries/relationships/get/belongs_to_locations.cypher', 'utf8').toString();
var query_belongs_to_videos = fs.readFileSync(__dirname + '/../../../queries/relationships/get/belongs_to_videos.cypher', 'utf8').toString();
var query_belongs_to_overlays = fs.readFileSync(__dirname + '/../../../queries/relationships/get/belongs_to_overlays.cypher', 'utf8').toString();


// GET BY ID (:belongs_to)
exports.request = function(req, res) {

    // Start session
    var session = driver.session();

    var query;
    switch (req.params.label) {
        case 'locations': {
            query = query_belongs_to_locations;
            break;
        }
        case 'videos': {
            query = query_belongs_to_videos;
            break;
        }
        case 'overlays': {
            query = query_belongs_to_overlays;
            break;
        }
        default:
            query = "";
    }

    async.waterfall([
        function(callback) { // Find entries
            session
                .run(query, {
                    relationship_id: req.params.relationship_id
                })
                .then(function(result) {
                    callback(null, result);
                })
                .catch(function(err) {
                    callback(err, 500);
                });
        },
        function(result, callback){ // Format attributes
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

            }, function() {
                // Check if relationship exists
                if(results.length===0){
                    callback(new Error("Relationship not found"), 404);
                } else {
                    callback(null, 200, results[0]);
                }
            });
        }
    ], function(err, code, result){
        // Close session
        session.close();

        // Send response
        if(err){
            if(!err.message){
                err.message = JSON.stringify(err);
            }
            console.error(colors.red(err.message));
            res.status(code).send(err.message);
        } else {
            res.status(code).send(result);
        }
    });

};
