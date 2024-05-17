//? orders collection model
const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
  clientId: { type: String, required: true },
  productId: { type: String, required: true },
  sellerId: { type: String, required: true },
  orderDate: { type: Date, default: Date.now },
  shippingAddress: { type: String, required: true },
  paymentMethod: { type: String, enum:['creditCard','paypal','edahabia','cod'] ,required: true },
  orderStatus: { type: String, enum:['pending','processing','In Transit','shipped','delivered','cancelled','returned','refunded'] , default:'pending'},
  quantity: { type: Number, required: true },
  size: String,
  color: String,
  dimension: String,
  totalPrice:{ type: Number, required: true }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
