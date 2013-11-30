#!/usr/bin/env node


var express = require('express'),
    handlebars = require('hbs'),
    Groupchat = require('./groupchat');
    
var app = express()
//Configure the static assets folder for Express
app.use(express.static(__dirname + '/public'));
//Configure the views folder for Express
app.set('views', __dirname + '/views');
//Set the file extension that the view engine recognizes as views
app.set('view engine', '.html.handlebars');
//Set the view engine to Handlebars
app.engine('.html.handlebars', handlebars.__express);
//Include the routes file
require('./routes')(app);
app.listen(3000);


var groupchatserver = new Groupchat({
  address: '0.0.0.0',
  port: 3001
});
groupchatserver.start();

