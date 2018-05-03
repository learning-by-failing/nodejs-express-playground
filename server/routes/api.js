const {ObjectID} = require('mongodb');
const _ = require('lodash');

const {mongoose} = require('../db/mongoose/mongoose');
const {Todo} = require('../db/mongoose/models/Todo');
const {User} = require('../db/mongoose/models/User');
const {authenticate} = require('./../authenticate/authenticate');

module.exports = (app)  => {
  app.get('/api', (req, res)=>{
    res.status(200).send({
      api: true,
      version: 1.0,
      author: "Maurizio Brioschi"
    });
  });

  app.get('/api/todo/:id', (req, res)=>{
    let id = req.params.id;
    if(!ObjectID.isValid(id)) {
      return res.status(404).send();
    }
    Todo.findById(id).then((todo)=>{
      if(!todo) {
        return res.status(404).send();
      }
      return res.status(200).send(todo);
    }).catch((e) => {
      return res.status(400).send(e);
    });
  });

  app.get('/api/user/me', authenticate, (req, res) => {
      return  res.status(200).send(req.user);
  });

  app.post('/api/todo',(req, res) => {
    let newTodo = new Todo({
      text: req.body.text,
      completed: req.body.completed,
      completedAt: req.body.completedAt
    });
    newTodo.save().then((doc)=>{
      res.status(201).send(doc);
    }, (e)=>{
      res.status(400).send(e);
    });
  });

  app.post('/api/user', (req, res)  => {
    let body = _.pick(req.body, ["email", "password"]);
    let user = new User(body);

    user.cryptPassword().then((user)=>{
      return user.generateAuthToken();
    }).then((token)=>{
      return res.header('x-auth', token).status(201).send(user.toJson());
    }, (e)=> res.status(400).send(e));
  });

  app.post('/api/user/login', (req, res)  => {
    var body = _.pick(req.body, ["email", "password"]);

    User.findByCredentials(body.email, body.password).then((user)=>{
      return user.generateAuthToken().then((token)=>{
        return res.header('x-auth', token).status(201).send(user.toJson());
      });
    }).catch((e) => res.status(400).send(e));
  });
}
