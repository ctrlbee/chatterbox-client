
var app = {}; 
app.server = "https://api.parse.com/1/classes/chatterbox"; 
app.messages = [];
app.friends = [];
app.currentRoom = ""; 

///APP INIT///
app.init = function(){
    app.fetch();
    app.getUserName(); 
};

////GET MESSAGES////
app.fetch = function(){
  app.clearMessages(); 
  $.ajax({
    url: app.server,
    type: 'GET',
    success: function(data) {
      console.log(data);
      for(var i = 0; i < data.results.length; i++) {
        datum = data.results[i];
        //create the global prop
        if(app.syntaxCheck(datum['username']) && app.syntaxCheck(datum['text']) && app.syntaxCheck(datum['roomname'])) {
          app.messages.push(datum);
        }
      }
      //call add message with global prop
      app.addMessages(app.messages);
      app.addRooms(app.messages); 

      $('.username').on('click', function() {
        app.addFriend(); 
      });
    },
    error: function() {
      console.log('broked');
    }
  });
};

// Add message object to the chat section of the DOM after sytax check
app.addMessages = function (messageList) {
  for(var i = 0; i < messageList.length; i++) {
    app.addMessage(messageList[i]);
  }
};

app.addMessage = function (datum) {
  $message = $('<div class="message"></div>');
  $message.append('<div class="username"><a href="#">'+ datum.username + '</a> says: </div>');
  $message.append('<div class="time">' + datum.createdAt +'</div>')
  $message.append('<div class="text">' + datum.text +'</div>')
  $('#chats').append($message);
};





////POST MESSAGES////
app.handleSubmit = function(){
  var msg = {}; 
  msg.username = app.getUserName(); 
  msg.text = $('#message').val(); 
  msg.roomname = app.currentRoom;
  app.send(msg); 
};

app.send = function(message){
  $.ajax({
    url: app.server, 
    type: "POST", 
    data: JSON.stringify(message),
    contentType: "application/json",
    success: function(){
      console.log('success'); 
    },
    error: function(){
      console.log('error!!'); 
    }
  });
};

app.clearMessages = function () {
  $('#chats').html('');
};



////ROOMS////
//will get populate from fetch or from user
app.addRooms = function(){
  var rooms = {}; //rooms[theroom] = "theroom"
  //create list of rooms (deduped)
  for (var i = 0; i < app.messages.length; i++){
    rooms[app.messages[i].roomname] = true; 
  }
  //append to select html elememt
  for (var key in rooms){
    app.addRoom(key); 
  }
  console.log(rooms); 
};

app.addRoom = function(datum){
  console.log(datum); 
  if(app.syntaxCheck(datum)) {
    $('#roomSelect').append($('<option></option>')
                    .attr('value', datum)
                    .text(datum));
  }
};

app.getMessagesForRoom = function(roomName){
  return _.filter(app.messages, function(el){
    return el['roomname'] === roomName;
  });
};


///FRIENDS////
app.addFriend = function(){
  console.log('friend');
};




///UTILITY////
app.syntaxCheck = function (string) {
  bannedChars = {'<' : true, '>' : true};
  if(!string) {
    return false;
  }
  for(var i = 0; i < string.length; i++) {
    if(string[i] in bannedChars) {
      return false;
    }
  }
  return true;
};

app.getUserName = function(){
  var qs = window.location.search; 
  var indexOfEqual = qs.indexOf("="); 
  var user = qs.slice(indexOfEqual+1); 
  return user; 
}


// YOUR CODE HERE:
$(document).on('ready', function () {
  app.init(); 

  $('.submit').on('click', function(){
    app.handleSubmit();
    app.fetch(); 
    var selectedRoom = $('#roomSelect').val();
    roomMessages = app.getMessagesForRoom(selectedRoom); 
    app.clearMessages();  
    app.addMessages(roomMessages);

  });

  $('#roomSelect').on('change', function(){
    var selectedRoom = $('#roomSelect').val();
    var roomMessages = [];
    if(selectedRoom === 'allRooms') {
      roomMessages = app.messages;
    } else if(selectedRoom === 'newRoom') {
      $('#room').toggle();
    } else {
      roomMessages = app.getMessagesForRoom(selectedRoom); 
      app.currentRoom = selectedRoom; 
    }
    app.clearMessages();  
    app.addMessages(roomMessages); 
  });

  $('.roomSubmit').on('click', function () {
    app.addRoom($('.roomInput').val());
    $('.roomInput').val(''); 
    app.currentRoom = selectedRoom; 
  });

});

// needed these to make test cases pass: 
//onclick="app.handleSubmit()"
//onclick="app.addFriend()"



