const {User} = require('./../db/mongoose/models/User');

var authenticate = (req, res, next) => {
  let token = req.header('x-auth');
  User.findByToken(token).then((user)=>{
    if(!user) {
      return Promise.reject();
    }
    req.user = user;
    req.token = token;
    next();
    return res.status(200).send(user);
  }).catch((e) => res.status(401).send(e));
};

module.exports = {authenticate};
