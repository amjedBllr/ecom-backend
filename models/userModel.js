//? users collection model

const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  username: { type: String, required: false },
  pfp: String,
  email: { type: String, required: true },
  hash: { type: String, required: true },
  salt: {type: String , required: true },
  role: { type: String, enum : ['client','seller','admin'],required: true },
  registrationDate: { type: Date, required: true , default:Date.now()},
  lastLoginDate: Date,
  accountStatus: { type: String, enum:['unverified','verified'] , default:'unverified' }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
