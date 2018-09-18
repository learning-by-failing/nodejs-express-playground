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

  socket.emit('newMessage', {
    title: "welcome",
    content: "You are an asshole"
  })
  //emit the event only to the client that has emit the event
  socket.on('clientReply', (message)=>{
    socket.emit('newMessage', message);
  });
  //broadcast the event to all the client connected except the one emitting the event
  socket.on('clientBroadcast', (message)=>{
    socket.broadcast.emit('newMessage', message);
  });
  //emit the event to everybody connected
  socket.on('toAllClient', (message)=>{
    io.emit('newMessage', message);
  });

  socket.on('messageFromClientWithAck', (message, callback)=>{
    console.log(message.title);
    console.log(message.content);
    callback("Heavy metal");
  });
});

server.listen(port, ()=>{
  console.log(`Server is up on port ${port}`);
});
