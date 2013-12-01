#!/usr/bin/env node


var express = require('express'),
    handlebars = require('hbs'),
    stylus = require('stylus'),
    GroupChatServer = require('./groupchatserver');
    
var app = express()
//Use stylus middleware to compile styl files
app.use(stylus.middleware(__dirname + '/public'));
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


var groupchatserver = new GroupChatServer({
  address: '0.0.0.0',
  port: 3001
});
groupchatserver.start();

