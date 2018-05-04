const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname,'./../public/server_io');
const port= 4000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('a new client connected');
  socket.on('disconnect', (socket) => {
    console.log('a user disconnect from Server');
  });
});

server.listen(port, ()=>{
  console.log(`Server is up on port ${port}`);
});
