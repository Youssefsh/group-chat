/** @jsx React.DOM */

(function() {

  var chatState = {
      participants: [],
      messages: [],
      changed: function() {
      }
  }

  var groupchat = new GroupChatClient({
    'server': window.location.hostname,
    'onConnected': function() {
      chatState.messages.push('Connected...\n');
      chatState.changed();
    },
    'onMessage': function(message) {
      chatState.messages.push(message + '\n');
      chatState.changed();
    },
    'onClose': function() {
      chatState.messages.push('Connection closed...\n');
      chatState.changed();
    },
    'onJoin': function(username) {
      chatState.messages.push(username + ' joined chat\n');
      chatState.participants.push(username);
      chatState.changed();
    },
    'onParticipant': function(username) {
      chatState.participants.push(username);
      chatState.changed();
    },
    'onLeave': function(username) {
      chatState.messages.push(username + ' left chat\n');
      var newparticipants = [];
      for(var i=0; i < chatState.participants.length; i++) {
        var participatingUsername = chatState.participants[i];
        if (participatingUsername !== username) {
          newparticipants.push(participatingUsername);
        }
      }
      chatState.participants = newparticipants;
      chatState.changed();
    }
  });


  var Participant = React.createClass({
    render: function() {
      return (
        <li>{this.props.username}</li>
      );
    }
  });

  var Participants = React.createClass({
    render: function() {
      var participantsList = [];
      for(var i=0; i < this.props.participants.length; i++) {
        participantsList.push(
          <Participant username={this.props.participants[i]} key={this.props.participants[i]} />
        );
      }

      return (
        <div className="participantscontainer">
          <ul className="participants">
            {participantsList}
          </ul>
        </div>
      );
    }
  });

  var MessageBox = React.createClass({
    sendMessage: function(e) {
      if(e.keyCode === 13) {
        //console.log('Send Message: ', $(e.target).val());
        var msg = $(e.target).val();
        groupchat.sendMessage(msg);
        $(e.target).val('');
      }
    },
    render: function() {
      return (
        <div className="messagingwindow">
          <input className="outgoingmessage" onKeyUp={this.sendMessage} />
        </div>
      );
    }
  });

  var Messages = React.createClass({
    render: function() {
      var text = '';
      for(var i=0; i < this.props.messages.length; i++) {
        text = text + this.props.messages[i];
      }

      return (
        <textarea className="incomingmessages" value={text}>
        </textarea>
      );
    }
  });

  var ChatArea = React.createClass({
    getInitialState: function() {
      return chatState;
    },
    updateState: function(chatState) {
      this.setState({
        messages: chatState.messages,
        participants: chatState.participants
      });
    },
    render: function() {
      var that = this;

      chatState.changed = function() {
        that.updateState(chatState);
      }

      return (
       <div className="container">
        <div className="chatarea" >
          <div className="messagewindow">
            <Messages messages={this.state.messages} />
            <Participants participants={this.state.participants} />
          </div>

          <MessageBox />

        </div>
      </div>
      );
    }
  });


  React.renderComponent(<ChatArea />, document.body);
})();