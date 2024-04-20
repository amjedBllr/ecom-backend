//? notifications collection model

const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema({
  userId: { type: String, required: true },
  content: {type : String },
  notificationDate: { type: Date, default: Date.now },
  checked: { type: Boolean , default : false }
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification ;
