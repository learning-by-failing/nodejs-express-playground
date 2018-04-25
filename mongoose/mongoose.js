const mongoose = require('mongoose');

//mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/todo');

const Todo = mongoose.model('todo', {
  text: {
    type: String,
    require: true,
    minlegth: 1,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: null,
  }
});

let newTodo = new Todo({
  text: "  Snowboarding   ",
  completed: false
});

newTodo.save().then((doc)=>{
  console.log('Saved', doc)
}, (e)=>{
  console.log('Unable to save todo');
});
