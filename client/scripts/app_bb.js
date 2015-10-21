
///SINGLE MESSAGE///
var Message = Backbone.Model.extend({

  initialize: function(username, roomname, message, time){
    this.set({'username': username, 'roomname': roomname, 'message': message, 'time': time});
  }

});

var MessageView = Backbone.View.extend({
  initialize: function() {
    this.model.on('change', this.render, this);
  },

  render: function() {
      this.$el = $('<div class="message"></div>'); 
      this.$el.append('<div class="username"><a href="#">'+ this.model.get('username') + '</a> says: </div>');
      this.$el.append('<div class="time">' + this.model.get('time') +'</div>');
      this.$el.append('<div class="text">' + this.model.get('message') +'</div>');
      
      return this.$el;
  }
});

///COLLECTION MODEL///
var Messages = Backbone.Collection.extend({
  model: Message, 
  url: "https://api.parse.com/1/classes/chatterbox",

  initialize: function(){
    this.fetch({
      success: this.fetchSuccess, 
      error: this.fetchError
    });
  }, 

  parse: function(data) {
    var msgs = _(data.results).map(function (datum) {
      return new Message(datum.username, datum.roomname, datum.text, datum.createdAt);
    });
    return msgs;
  },

 fetchSuccess: function (collection, response) {
      //console.log('Collection fetch success', response);
      //console.log(collection);
      //console.log('Collection models: ', this.models);
  },

  fetchError: function (collection, response) {
      throw new Error("Message fetch error");
  }
}); 


///COLLECTION VIEW///
var MessagesView = Backbone.View.extend({
  
  initialize: function(){
    //this.collection = new Messages();
    this.collection.on('change', this.render, this); 
    this.render();
  },

  render: function(){

    console.log(this.collection); 

    this.collection.each(function(msg){
      //var view = new MessageView({model: msg});
      console.log('what you say?')
      //return view.render();
    }); 

   
    $('#chats').append(this.$el[0]);

    return this.$el;
  }
});


$(document).on('ready', function(){
  var msgs = new Messages();
  for(var i = 0; i<msgs.length; i++){
    var singleMsg = new Message({model: msgs.models[i]})
    $('#chats').append(singleMsg.render());
    
  }
  //var msgsView = new MessagesView({collection: msgs}); 

  console.log(msgs); 

});



