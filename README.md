## DWD Relay

### NodeJS, Express and Socket.io on Heroku

### Socket.io is great

[Socket.io](http://socket.io/#home)

Socket.io allows you to run a Websocket server OR long polling server in the case of Heroku. This allows the connection between the server and the clients' browsers to be open and allow 2-way communication for very real/near-real time interaction.

Socket.io provides a Javascript object for client side use and has a Flash fallback option for older browsers. On the server side Socket.io can be programmed to respond to incoming events. It can communicate directly to a specific user's socket or broadcast messages to everyone.

### To run locally

1) Download code

2) Install Node Modules

    npm install

3) Start the server (assumes you have Heroku Toolbelt installed)

    foreman start
    
4) Visit in browser [http://localhost:5000](http://localhost:5000)