// base dependencies for app
var express = require('express')
  , ejs = require('ejs')
  , routes = require('./routesConfig')


var app = module.exports = express.createServer();
global.app = app;

var users = [];

// Socket.IO server
var io = require('socket.io').listen(app);

// not using True Websockets, not available on Heroku - will use long polling until then
io.configure(function () { 
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 10); 
});

io.sockets.on('connection', function (socket) {

    socket.on('chat msg', function(msg) {
        io.sockets.emit('new msg', msg);
    });
    
    

    socket.on('set nickname', function(name){
      users.push(name);

      socket.set('nickname', name, function() {
          console.log("user name : " + name);
          socket.emit('all users', users);
      });
  
      //broadcast new user name
      io.sockets.emit('new user', name);

    });
  
  
    socket.on('play sound', function(soundname){
        if (soundname == 'cow') {
            io.sockets.emit('moo');
        }
    });
    
    // receive mouse updates for a 
    socket.on('mouse update', function(data){
        socket.get('nickname', function(err, nickname){

            data['nickname'] = nickname;
            io.sockets.emit('mouse update', data);
        })
    })
    
    socket.on('disconnect', function () {
      socket.get('nickname', function(err, nickname){
          for(i=0;i<users.length;i++){
              if (users[i] == nickname) {
                  users.remove(i);
              }
          };
      
          io.sockets.emit('user disconnected', nickname);
      
      });
    });

});

// Configuration
app.configure(function(){

    //configure template engine
    app.set('views', __dirname + '/views'); //store all templates inside /views
    app.set('view engine', 'ejs'); // ejs is our template engine
    app.set('view options',{layout:true}); // use /views/layout.html to manage your main header/footer wrapping template
    app.register('html',require('ejs')); //use .html files in /views instead .ejs extension
    
    app.use(express.cookieParser());//Cookies must be turned on for Sessions
    app.use(express.bodyParser());
    
    // define the static directory for css, img and js files
    app.use(express.static(__dirname + '/static'));
  
    /**** Turn on some debugging tools ****/
    app.use(express.logger());
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  
});


// Routes - all URLs are defined inside routesConfig.js
// we pass in 'app'
require('./routesConfig')(app);

// Make server turn on and listen at defined PORT (or port 3000 if is not defined)
var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log('Listening on ' + port);

});

// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};
