//? clients collection model

const mongoose = require('mongoose');

const clientSchema = mongoose.Schema({
  userId: { type: String, required: true },
  fullname: { type : String , required: true},
  gender:{ type: String, enum:['male','female'] },
  phoneNumber: { type : String , required: true},
  birthday: Date,
  shippingAddress: { type : String , required: true},
  secondaryShippingAddress: String,
  creditCardNumber: String,
  paypalNumber: String,
  edahabiaNumber: String,
  loyaltyPoints: Number
});

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;
