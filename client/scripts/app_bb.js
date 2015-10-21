
///SINGLE MESSAGE///
var Message = Backbone.Model.extend({

  initialize: function(username, roomname, message, time){
    this.set({'username': username, 'roomname': roomname, 'message': message, 'time': time});
  }

});

var MessageView = Backbone.View.extend({
  initialize: function() {
    this.model.on('change', this.render, this);
    this.render();
  },

  render: function() {
      this.$el = $('<div class="message"></div>'); 
      this.$el.append('<div class="username"><a href="#">'+ this.model.get('username') + '</a></div>');
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

 fetchSuccess: function (collection, response) {
      console.log('Collection fetch success', response);
      //console.log('Collection models: ', collection.models);

       for(var i = 0; i<collection.models.length; i++){
        var singleMsgView = new MessageView({model: collection.models[i]})
        $('#chats').append(singleMsgView.render());
      }
  },

  fetchError: function (collection, response) {
      throw new Error("Message fetch error");
  },   

  parse: function(data) {
    var msgs = data.results.map(function (datum) {
      return new Message(datum.username, datum.roomname, datum.text, datum.createdAt);
    });
    return msgs;
  }

}); 


///COLLECTION VIEW///
var MessagesView = Backbone.View.extend({
  
  initialize: function(){
    this.collection = new Messages();
    console.log(this.collection.models);
    this.collection.on('change', this.render, this); 
    this.render();
  },

  render: function(){

    this.$el.append(this.collection.map(function(msg){
      var view = new MessageView({model: msg});
      return view.render();
    })); 
   
    $('#chats').append(this.$el);

    return this.$el;
  }
});


$(document).on('ready', function(){
  var msgs = new Messages();
  
  // console.log(msgs.models);
  //  for(var i = 0; i<msgs.length; i++){
  //   console.log('loop');
  //   var singleMsg = new Message({model: msgs.models[i]})
  //   console.log(singleMsg.render());
  //   $('#chats').append(singleMsg.render());
  // }
});



