// base dependencies for app
var express = require('express')
  , ejs = require('ejs')
  , routes = require('./routesConfig')


var app = module.exports = express.createServer();
global.app = app;

var users = []; // this array will keep track of users on the /advanced demo

// Socket.IO server
var io = require('socket.io').listen(app);

// not using True Websockets, not available on Heroku - will use long polling until then
io.configure(function () { 
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 10); // long polling connection for 10 seconds
});

require('./socketIOEvents').configureSocketIOEvents(io);

// end socket.io configuration


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
