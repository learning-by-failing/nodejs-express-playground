const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
var app = express();
const bodyParser = require('body-parser');
const socketIO = require('socket.io');

hbs.registerPartials(__dirname + '/../views/partials')
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/../public'));
app.use(bodyParser.json());

//middleware to log requests
app.use((req, res, next)=>{
  var now = new Date().toString();
  fs.appendFile('server.log', `${now} ${req.method} ${req.url}\n`, (err) => {
    if(err) {
      console.log(error);
    }
  });
  next();
});

/*app.use((req, res, next)=>{
  res.render('maintenance.hbs');
});*/

hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (message) => {
  return message.toUpperCase();
});

app.get('/',(request, response)=>{
  response.send('Hello express');
});

app.get('/about', (req, res)=>{
  res.render('about.hbs', {
    text: 'troppo il migliore'
  });
});

require('./routes/api')(app);
if(!module.parent){
  app.listen(3000, ()=> {
    console.log('Server is up on port 3000');
  });
}


module.exports.app = app;
