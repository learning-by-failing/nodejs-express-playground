require('dotenv').config();

const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const {SHA256} = require('crypto-js');


const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true,
    validate: {
        validator: validator.isEmail,
        message: '{VALUE} is not a valid email'
     }
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    trim: true
  },
  tokens: [
    {
      access: {
        type: String,
        required: true
      },
      token: {
        type: String,
        required: true
      }
    }
  ]
});

UserSchema.statics.findByToken = function(token)  {
  let user = this;
  let decoded;

  try{
    decoded = jwt.verify(token, process.env.SECRET);
  }catch(e){
    return new Promise((resolve, reject) => {
       reject(e);
    });
  }

  return user.findOne({
    "_id": decoded._id,
    "tokens.token": token,
    "tokens.access": 'auth'
  });
}

UserSchema.methods.cryptPassword = function() {
  let user = this;

  return new Promise((resolve, reject) => {
    user.password = SHA256(user.password).toString();
    resolve(user);
  }).catch((e)=>reject(e));
}

UserSchema.methods.toJson = function()  {
  let user = this;
  let userObj = user.toObject();

  return _.pick(userObj, ["_id", "email"]);
}

UserSchema.methods.generateAuthToken = function() {
  let user = this;
  let access = "auth";
  var token = jwt.sign({_id: user._id.toHexString(), access},process.env.SECRET).toString();

  user.tokens = user.tokens.concat([{access, token}]);

  return user.save().then(()=>{
    return token;
  })
}
const User = mongoose.model('User', UserSchema);

module.exports = {User};
