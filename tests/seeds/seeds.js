const {ObjectID} = require('mongodb');

const {Todo} = require('./../../server/db/mongoose/models/Todo');
const {User} = require('./../../server/db/mongoose/models/User');

const todos = [{
  _id: new ObjectID(),
  text: 'First test todo'
}, {
  _id: new ObjectID(),
  text: 'Second test todo'
}];

const populateTodos = (done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(()=>done());
};

const userId1 = new ObjectID();
const userId2 = new ObjectID();
const users = [
  {
    _id: userId1,
    email: "test1@email.com",
    password: "1232456"

  },
  {
    _id: userId2,
    email: "test2@email.com",
    password: "987654321"
  }
];

const populateUsers = (done) => {
    User.remove({}).then(()=>{
      User.insertMany(users).then((users)=>{
        users.forEach((user)=>{
          user.cryptPassword().then((user)=>{
            return user.generateAuthToken();
          });
        });
    });
  }).then(()=>done());
};

module.exports = {
  todos,
  users,
  populateTodos,
  populateUsers
}
