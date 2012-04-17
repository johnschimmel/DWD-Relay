jQuery(document).ready(function() {
    
    // bind click event to input#chatMsgBtn - triggers sendChatMsg
    jQuery('#chatMsgBtn').on('click', sendChatMsg);
    
    // bind click event to background color button - triggers updateBackgroundcolor
    jQuery('#colorBtn').on('click', updateBackgroundcolor);
    
    // connect to the socket.io server
    socket = io.connect();
    
    // receiving a new chat msg from the server
    socket.on('new chat msg', function(msg){
        
        // for security you would want to strip out any html tags from the 'msg' variable. 
        // we won't do that for this example.
        
        // create new <p> for chat msg
        newChatHTML = "<p class=\"chatMsg\">" + msg + "</p>";
        
        // put new message at the top of div
        jQuery('#chatLog').prepend(newChatHTML);
         
    });
    
    // receiving a new color from the server
    socket.on("background color update", function(color){
        // update the value of the colorTextbox
        jQuery('#currentColor').html(color);
        
        // update the BODY background-color css property
        jQuery('body').css('background-color',color);
        
    })
    
});

var sendChatMsg = function(){
    msg = jQuery('#chatmsg').val();
    
    if (msg != "") {
        
        // send message to socket.io server
        socket.emit('new chat msg', msg);
        
        //clear chat msg textbox 
        jQuery('#chatmsg').val('');
    }
};

var updateBackgroundcolor = function() {
    
    // get the color from the textbox
    newColor = jQuery("#colorTextbox").val();
    
    // send new color to server
    socket.emit('background color set', newColor);
    
    // clear the color textbox
    jQuery("#colorTextbox").val('');
}