
var app = {}; 
app.server = "https://api.parse.com/1/classes/chatterbox"; 

app.init = function(){
    app.fetch();
}

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
        app.addMessage(datum);
      }
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
app.addMessage = function (datum) {
  if(app.syntaxCheck(datum['username']) && app.syntaxCheck(datum['text']) && app.syntaxCheck(datum['roomname'])) {
    $message = $('<div class="message"></div>');
    $message.append('<div class="username"><a href="#">'+ datum.username + '</a> says: </div>');
    $message.append('<div class="time">' + datum.createdAt +'</div>')
    $message.append('<div class="text">' + datum.text +'</div>')
    $('#chats').append($message);
  }
};





////POST MESSAGES////
app.handleSubmit = function(){
  var msg = {}; 
  msg.username = "sammy"; 
  msg.text = $('#message').val(); 
  msg.roomname = "champaign room"; 
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
}



////ROOMS////
//will get populate from fetch or from user
app.addRoom = function(datum){
  if(app.syntaxCheck(datum)) {
    $('#roomSelect').append($('<option></option>'))
                    .attr('value', datum['roomname'])
                    .text(datum['roomname']);
  }
}

app.getRooms = function(){

}




///FRIENDS////
app.addFriend = function(){
  console.log('friend');
}




///SYNTAX CHECK UTILITY////
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
}

// YOUR CODE HERE:
$(document).on('ready', function () {
  app.init(); 

  $('.submit').on('click', function(){
    app.handleSubmit(); 
  })

});

// needed these to make test cases pass: 
//onclick="app.handleSubmit()"
//onclick="app.addFriend()"



