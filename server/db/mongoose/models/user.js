require('dotenv').config();

const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const {SHA256} = require('crypto-js');
var bcrypt = require('bcryptjs');
const saltRounds = 10;

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

UserSchema.statics.findByCredentials = function(email, password)  {
  var User = this;
  return User.findOne({"email": email}).then((user) => {
    if(!user){
      return Promise.reject();
    }

    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        if(res) {
          resolve(user);
        }else{
          reject();
        }
      });
    });
  });
}

UserSchema.methods.cryptPassword = function() {
  let user = this;
  return new Promise((resolve, reject)=>{
    bcrypt.genSalt(saltRounds, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
          if(!err){
            user.password = hash;
            resolve(user);
          }
          reject(err);
        });
      });
  });
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
