require('dotenv').config();

const mongoose = require('express/server/db/mongoose/mongoose');
const {Todo} = require('./models/Todo');

//mongoose.Promise = global.Promise;
if(process.env.ENV!=='production') {
  mongoose.connect(`${process.env.DB_HOST}/${process.env.DB_NAME}_${process.env.ENV}`);
}

module.exports = {mongoose};
