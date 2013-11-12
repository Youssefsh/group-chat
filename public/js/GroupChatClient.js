(function() {
  // Initialize the socket & handlers
  var connectToServer = function() {
    var groupChatSocket = new SockJS('http://localhost:3001/groupChat');

    groupChatSocket.onopen = function() {
      clearInterval(connectRetry);
      $('.connect-status')
        .removeClass('disconnected')
        .addClass('connected')
        .text('Connected');
    };

    groupChatSocket.onmessage = function(e) {
      $('#warble-msg').text(e.data);
    };

    groupChatSocket.onclose = function() {
      clearInterval(connectRetry);
      connectRetry = setInterval(connectToServer, 3001);
      $('.connect-status')
        .removeClass('connected')
        .addClass('disconnected')
        .text('Disconnected');
    };

    // Connect the text field to the socket
    $('.msg-sender').off('input').on('input', function() {
      groupChatSocket.send($('.msg-sender input').val()); 
    });
  };

  var connectRetry = setInterval(connectToServer, 3001);
})();
