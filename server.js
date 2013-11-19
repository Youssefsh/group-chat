#!/usr/bin/env node

var http = require('http'),
    sockjs = require('sockjs'),
    groupChat = sockjs.createServer(),
    express = require('express'),
    handlebars = require('hbs');
    connections = [];
    
var app = express()

users = [];

//Configure the static assets folder for Express
app.use(express.static(__dirname + '/public'));

//Use Body Parser
app.use(express.bodyParser());

//Configure the views folder for Express
app.set('views', __dirname + '/views');
//Set the file extension that the view engine recognizes as views
app.set('view engine', '.html.handlebars');
//Set the view engine to Handlebars
app.engine('.html.handlebars', handlebars.__express);

//Include the routes file
require('./routes')(app);

app.listen(3000);

groupChat.on('connection', function(conn) {
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
groupChat.installHandlers(server, {prefix:'/groupChat'});
server.listen(3001, '0.0.0.0');
