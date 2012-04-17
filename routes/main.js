module.exports = {
    
    chat : function(request, response) {
        
        response.render("chat.html");
        
    },
    
    users_w_sound : function(request, response) {
        
        response.render("users_w_sound.html");
        
    }
    
};