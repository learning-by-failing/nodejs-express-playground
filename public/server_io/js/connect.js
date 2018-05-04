let socket = io();

socket.on('connect', function (socket) {
  console.log('conectected to Server');
});
socket.on('disconnect', function (socket) {
  $('#content').html('<h2>I leave, fuck you</h2>');
});

socket.on('newMessage', function (message) {
  let title = message.title;
  let messageContent = message.content;
  let actualContent = $('#content').html();

  let htmlContent = `${actualContent}<h2>${title}</h2>${messageContent}`;
  $('#content').html(htmlContent);
});

//emit an event and get the acknoledge from the server
setTimeout(function(){
  socket.emit('messageFromClientWithAck', {title:"test ack", content: "Snowboard"}, function(ack){
  $('#content').html(ack);
  })
}, 5000);
