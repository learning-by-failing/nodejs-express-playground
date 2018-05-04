let socket = io();

socket.on('connect', (socket) => {
  console.log('conectected to Server');
});
socket.on('disconnect', (socket) => {
  console.log('disconnect from Server');
});
