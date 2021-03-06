/**
 * Socket Message Handler
 */
var colors = require('colors');
var io = require('./../server.js').io;
io.on('connection', function(socket) {

    // On connection
    console.log(colors.magenta(new Date() + " Socket connected: " +  socket.client.id));

    // On disconnection
    socket.on('disconnect', function() {
        console.log(colors.magenta(new Date() + " Socket disconnected: " +  socket.client.id));
    });

    // Scenario
    socket.on('/set/scenario', function(data) {
        console.log(colors.cyan(new Date() + " /set/scenario: " + JSON.stringify(data)));
        socket.broadcast.emit('/set/scenario', data);
    });

    // Location
    socket.on('/set/location', function(data) {
        console.log(colors.cyan(new Date() + " /set/location: " + JSON.stringify(data)));
        socket.broadcast.emit('/set/location', data);
    });

    // Video
    socket.on('/set/video', function(data) {
        console.log(colors.cyan(new Date() + " /set/video: " + JSON.stringify(data)));
        socket.broadcast.emit('/set/video', data);
    });

    // Show/Hide Overlay
    socket.on('/toggle/overlay', function(data) {
        console.log(colors.cyan(new Date() + " /toggle/overlay: " + JSON.stringify(data)));
        socket.broadcast.emit('/toggle/overlay', data);
    });

});

exports.sockets = io;
