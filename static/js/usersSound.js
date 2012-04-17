var socket;
var users = []; // array will hold all users names
var nickname = null;

var mouseX, mouseY;

jQuery(document).ready(function(){
    
    //button event to set nickname
    jQuery("#nicknameBtn").on("click", setNickname)
    
    // connect to the socket.io server
    socket = io.connect();
    
    // whenever a new user message is received
    socket.on('new user', function(name){
        
        if (jQuery.inArray(name, users) == -1) {
            users.push(name); //add user to users array

            console.log('new user: ' + name);
        
            // refresh the user list
            refreshUserList();
        }
        
    });
    
    // receive list of all users
    socket.on('all users', function(userArray){

        console.log("receiving all users");
        console.dir(userArray);

        users = userArray;
        
        // refresh the user list
        refreshUserList();
    });
    
    // when user disconnects - remove user from users array
    socket.on('user disconnected', function(name){
        
        console.log("user disconnected" + name);
        
        //user position in array
        userPosition = jQuery.inArray(name, users);
        if (userPosition >= 0) {
            users.remove(userPosition);
        }
        
        refreshUserList();
    });
    
    
    // clickable cow
    jQuery("img#cow").on('click', function(){
        socket.emit('play sound', 'cow');
    })
    
    // moo the cow
    socket.on('moo', function(){
        // use jQuery selector to find #mooCow, pull first item out of array
        // alternative way to write document.getElementById('audioCowMoo').play()
        jQuery("#audioCowMoo")[0].play();
        console.log("playing sound : cow");
        
    })
    
    
    //track mouse 
    jQuery(document).mousemove(function(e){
        mouseX = e.pageX;
        mouseY = e.pageY;
        jQuery('li#'+nickname).css('position','absolute').css('left',mouseX).css('top', mouseY);
    });
    
    // send mouse positions every half second
    setInterval(function(){
        
        // if nickname is set, emit the new position
        if (nickname) {
            //send out mouse x and y
            socket.emit("mouse update", { x:mouseX,  y:mouseY } );
        }
    },500);
    
    // receive new mouse positions for other users
    socket.on('mouse update', function(data){
        
        if (data.nickname == nickname) {
            // skip it, it is you! you position is updated above in the .mousemove function
            
        } else {
            //console.log("new mouse position for " + data.nickname + ". " + data.x + ", "+data.y);
            jQuery('li#'+data.nickname).css('position','absolute').css('left', data.x).css('top',data.y);
        }
        
    })

    
    
});


var setNickname = function() {

    //get the nickname
    nickname = jQuery("#nickname").val();
    
    if (nickname == "") {
        alert("you need to enter a username");

    } else {
        
        // send the new nickname to the server
        socket.emit("set nickname", nickname);
    
        //disable the nickname button and textfield
        jQuery("#nicknameBtn,#nickname").attr('disabled','disabled');
    }
};


var refreshUserList = function() {
    
    // update user count
    jQuery("#userCount").html(users.length);
    
    // create new user list HTML
    userListHTML = "";
    for(i=0; i<users.length; i++) {
        userListHTML += "<li id=\"" + users[i] + "\">" + users[i] + "</li>";
    }
    
    // insert new userListHTML into ul#userList
    jQuery("ul#userList").html(userListHTML);
    
}



// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};