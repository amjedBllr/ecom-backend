//? orders collection model
const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
  cartItemId: { type: String, required: true },
  orderDate: { type: Date, required: Date.now },
  shippingAddress: { type: String, required: true },
  paymentMethod: { type: String, enum:['creditCard','paypal','edahabia'] ,required: true },
  orderStatus: { type: String, enum:['pending','processing','In Transit','shipped','delivered','cancelled','returned','cefunded'] , default:'pending'}
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
