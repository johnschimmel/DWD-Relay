module.exports.configureSocketIOEvents = function(io) {
    
    io.sockets.on('connection', function (socket) {
    
        // New Chat Message received from Client
        socket.on('new chat msg', function(msg) {
        
            //broadcast new chat message to everyone
            io.sockets.emit('new chat msg', msg);
        });
    
        // New Background color received from client
        socket.on('background color set', function(color) {
        
            //broadcast new color to everyone
            io.sockets.emit('background color update', color);
        
        })
    
    
        // Socket.io events for /advanced 
    
        // client has set username
        socket.on('set nickname', function(name){
        
          users.push(name); // put nickname in users array

          // set the nickname for this specific user
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
    
        // when Socket.io learns that a user has disconnected
        // loop through users array and remove them
        // then broadcast to all clients that this nickname has disconnected. 
    
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

};