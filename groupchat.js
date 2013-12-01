var sockjs = require('sockjs');
var http = require('http');

var GroupChat = function(options) {

  var address = options.address;
  var port = options.port;
  var server = http.createServer();
  var chatserver = sockjs.createServer();
  var connections = [];

  var sendParticipants = function(connection) {
    for(var i=0; i < connections.length; i++) {
      if(connections[i].username.length > 0)
        console.log('Send Participants: ', connections[i].username);
        connection.write('participant: ' + connections[i].username);
    }
  }

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

  var removeConnection = function(connection) {
    var newconnections = [];
    for(var i=0; i < connections.length; i++) {
      if(connections[i] !== connection)
        newconnections.push(connections[i]);
    }
    connections = newconnections;
  }

  var messageHandler = function(connection) {
    return function(message) {
      if(message.indexOf('/register') === 0) {
        var tokens = message.split(' ');
        var username = tokens[1];
        connection.username = username;
        broadcastMessage('join: ' + username);
      } else if (message.indexOf('/message') === 0) {
        if(connection.username.length === 0) {
          connection.write('Error: Please register a username.');
        } else {
          var tokens = message.split(' ');
          var username = tokens[1];
          var msg = message.slice(message.indexOf(tokens[2]), message.length);
          privateMessage(username, 'message: ' +  '(private)' + connection.username + ': ' + msg);
        }
      } else if (message.indexOf('/') !== 0) {
        if(connection.username.length === 0) {
          connection.write('Error: Please register a username.');
        } else {
          broadcastMessage('message: ' + connection.username + ': ' + message);
        }
      }
    }
  }

  chatserver.on('connection', function(connection) {
    var that = connection;
    connection.username = '';
    sendParticipants(connection);
    connections.push(connection);
    connection.on('data', messageHandler(that));
    connection.on('close', function() {
      broadcastMessage('leave: ' + connection.username);
      removeConnection(connection);
    });
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

