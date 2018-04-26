const {mongoose} = require('../db/mongoose/mongoose');
const {Todo} = require('../db/mongoose/models/Todo');

module.exports = (app)  => {
  app.get('/api', (req, res)=>{
    res.status(200).send({
      api: true,
      version: 1.0,
      author: "Maurizio Brioschi"
    });
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
}
