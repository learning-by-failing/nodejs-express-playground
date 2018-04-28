require('dotenv').config();
const {MongoClient,ObjectID} = require('mongodb');

MongoClient.connect(`${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`, (err, db) => {
  if(err){
    return console.log('Unable to connect to MongoDb server');
  }
  console.log('Connected to MongoDb server');
  db.collection('todos').insertOne({name: "Wake up"},  (err, result)=>{
    if(err) {
      return console.log('Unable to insert');
    }
    console.log(JSON.stringify(result, undefined, 2));
  });

  db.close();
});
