#!/usr/bin/env node

var http = require('http'),
    sockjs = require('sockjs'),
    warble = sockjs.createServer(),
    express = require('express'),
    connections = [];
    
var app = express()

app.use(express.static(__dirname + '/public'));

app.listen(3000);

warble.on('connection', function(conn) {
  console.log('Got connection');
  connections.push(conn);
  conn.on('data', function(message) {
    console.log('Got data: ' + message);
    // write the message to all connected clients
    for (var i=0; i<connections.length; i++) {
      connections[i].write(message);
    }
  });
  conn.on('close', function() {
    connections.splice(connections.indexOf(conn), 1); // remove the connection
    console.log('Lost connection');
  });
});

var server = http.createServer();
warble.installHandlers(server, {prefix:'/warble'});
server.listen(5555, '0.0.0.0');
