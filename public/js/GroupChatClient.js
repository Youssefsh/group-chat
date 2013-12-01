(function() {

  var GroupChatClient = function(options) {
    var server = options.server;
    var onConnected = options.onConnected;
    var onMessage = options.onMessage;
    var onJoin = options.onJoin;
    var onLeave = options.onLeave;
    var onClose = options.onClose;

    var chatSocket = new SockJS('http://' + server + ':3001/groupChat');

    chatSocket.onopen = onConnected;
    chatSocket.onclose = onClose;

    //chatSocket.onmessage = onMessage;
    chatSocket.onmessage = function(message) {
      if(message.data.indexOf('message:') === 0) {
        var msg = message.data.slice(9, message.data.length);
        onMessage(msg);
      } else if(message.data.indexOf('join:') === 0) {
        var tokens = message.data.split(' ');
        var username = tokens[1];
        onJoin(username);
      } else if(message.data.indexOf('leave:') === 0) {
        var tokens = message.data.split(' ');
        var username = tokens[1];
        onLeave(username);
      } else if(message.data.indexOf('participant:') === 0) {
        var tokens = message.data.split(' ');
        var username = tokens[1];
        console.log('Participant: ', username);
      }
    }

    this.sendMessage = function(message) {
      chatSocket.send(message);
    }
  }


  window.GroupChatClient = GroupChatClient;

})();
