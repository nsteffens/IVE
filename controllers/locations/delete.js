var colors = require('colors');
var async = require('async');
var neo4j = require('neo4j-driver').v1;
var _ = require('underscore');
var moment = require('moment');
var jwt = require('jsonwebtoken');
var jwtSecret = require('../../server.js').jwtSecret;
var backend_account = require('../../server.js').backend_account;
var server_url = require('../../server.js').server_url;
var driver = require('../../server.js').driver;
var fs = require("fs");
var query_get_location = fs.readFileSync(__dirname + '/../../queries/locations/get.cypher', 'utf8').toString();
var query_delete_location = fs.readFileSync(__dirname + '/../../queries/locations/delete.cypher', 'utf8').toString();


// DELETE
exports.request = function(req, res) {

    // Start session
    var session = driver.session();

    async.waterfall([
        function(callback) { // Authentication
            if(req.headers.authorization){
                var token = req.headers.authorization.substring(7);

                // Verify token
                jwt.verify(token, jwtSecret, function(err, decoded) {
                    if(err){
                        callback(err, 401);
                    } else {
                        // Authorization
                        if(decoded.username === backend_account.username && decoded.iss === server_url){
                            callback(null);
                        } else {
                            callback(new Error("Authentication failed!"), 401);
                        }
                    }
                });
            } else {
                callback(new Error("Authentication failed!"), 401);
            }
        },
        function(callback) { // Find entry by Id
            session
                .run(query_get_location, {
                    location_id: req.params.location_id
                })
                .then(function(result) {
                    // Check if Location exists
                    if (result.records.length===0) {
                        callback(new Error("Location with id '" + req.params.location_id + "' not found!"), 404);
                    } else {
                        callback(null, result);
                    }
                })
                .catch(function(err) {
                    callback(err, 500);
                });
        },
        function(result, callback){ // Delete entry
            session
                .run(query_delete_location, {
                    location_id: req.params.location_id
                })
                .then(function(result) {
                    callback(null, 204, null);
                })
                .catch(function(err) {
                    callback(err, 500);
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
            res.status(code).send();
        }
    });
};
