const mongoose = require('mongoose');

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

module.exports = {Todo};
