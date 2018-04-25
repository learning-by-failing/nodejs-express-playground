const mongoose = require('mongoose');
const {Todo} = require('./models/Todo');

//mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/todo');

module.exports = {mongoose};
