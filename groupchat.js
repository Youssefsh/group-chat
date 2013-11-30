var sockjs = require('sockjs');
var http = require('http');

var GroupChat = function(options) {

  var address = options.address;
  var port = options.port;
  //var onConnect = options.onConnect;
  //var onClose = options.onClose;
  //var onMessage = options.onMessage

  var server = http.createServer();
  var chatserver = sockjs.createServer();

  var connections = [];

  var broadcastMessage = function(message) {
    for(var i=0; i < connections.length; i++) {
      connections[i].write(message);
    }
  }

  var privateMessage = function(username, message) {
    for(var i=0; i < connections.length; i++) {
      if(connections[i].username === username) {
        connections[i].write(message);
        break;
      }
    }
  }

  var messageHandler = function(connection) {

    return function(message) {
      if(message.indexOf('/register') === 0) {
        var tokens = message.split(' ');
        var username = tokens[1];
        connection.username = username;
      } else if (message.indexOf('/message') === 0) {
        if(connection.username.length === 0) {
          connection.write('Error: Please register a username.');
        } else {
          var tokens = message.split(' ');
          var username = tokens[1];
          var msg = message.slice(message.indexOf(tokens[2]), message.length);
          privateMessage(username, '(private)' + connection.username + ': ' + msg);
        }
      } else if (message.indexOf('/') !== 0) {
        if(connection.username.length === 0) {
          connection.write('Error: Please register a username.');
        } else {
          broadcastMessage(connection.username + ': ' + message);
        }
      }
    }
  }

  chatserver.on('connection', function(connection) {
    var that = connection;
    connection.username = '';
    connections.push(connection);
    connection.on('data', messageHandler(that));
  });

  chatserver.on('close', function() {
    console.log('Lost connection...');
  });

  chatserver.installHandlers(server, {prefix: '/groupChat'});

  this.start = function() {
    server.listen(port, address);
  }
}

module.exports = GroupChat;

