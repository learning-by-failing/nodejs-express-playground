const db = require('./db.js');

module.exports.logUser = (user) => {
  db.saveUser(user);
};
