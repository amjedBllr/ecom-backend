//? cart_items collection model

const mongoose = require('mongoose');

const cartItemSchema = mongoose.Schema({
  clientId: { type: String, required: true },
  productId: { type: String, required: true },
  quantity: { type: Number, required: true },
  size: String,
  color: String,
  dimension: String,
  itemStatus: String
});

const CartItem = mongoose.model('Cart-Item', cartItemSchema);

module.exports = CartItem;
