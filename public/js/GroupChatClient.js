(function() {

  var GroupChatClient = function(options) {
    var server = options.server;
    var onConnected = options.onConnected;
    var onMessage = options.onMessage;
    var onClose = options.onClose;

    var chatSocket = new SockJS('http://' + server + ':3001/groupChat');

    chatSocket.onopen = onConnected;
    chatSocket.onmessage = onMessage;
    chatSocket.onclose = onClose;

    this.sendMessage = function(message) {
      chatSocket.send(message);
    }
  }


  window.GroupChatClient = GroupChatClient;

})();
