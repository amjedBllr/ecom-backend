//? users collection model

const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  username: { type: String, required: false },
  pfp: String,
  email: { type: String, required: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum : ['client','seller'],required: true },
  registrationDate: { type: Date, required: true },
  lastLoginDate: Date,
  accountStatus: { type: String, required: false }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
