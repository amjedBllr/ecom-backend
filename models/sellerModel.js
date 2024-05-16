//? sellers collection model

const mongoose = require('mongoose');

const sellerSchema = mongoose.Schema({
  userId: { type: String, required: true },
  sellerType: { type : String , enum: ['individual','company'] , required: true},
  businessName: { type: String, required: true },
  businessAddress: { type: String, required: true },
  businessEmail: { type: String, required: true },
  businessPhone: { type: String, required: true },
  creditCardActivity: {type : Boolean , default: false},
  paypalActivity: {type : Boolean , default: false},
  edahabiaActivity: {type : Boolean , default: false},
  creditCardNumber: String,
  paypalNumber: String,
  edahabiaNumber: String,
  commerceRegisterNumber: String,
  identityCard: {type : String , required: true},
  averageRating: Number,
  totalReviews: Number,
  additionalInformation: String,
  sellerStatus : {type: String , enum:['unverified','verified'] , default:'unverified'}
});

const Seller = mongoose.model('Seller', sellerSchema);

module.exports = Seller;
