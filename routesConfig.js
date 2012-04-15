/** routes.js
  */
var main = require("./routes/main");

module.exports = function(app) {
    
    app.get('/', main.index);

}
