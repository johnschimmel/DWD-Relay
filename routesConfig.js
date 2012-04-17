/** routes.js
  */
var main = require("./routes/main");

module.exports = function(app) {
    
    app.get('/', main.chat);
    app.get('/advanced', main.users_w_sound);

}
