//? products collection model

const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  sellerId: { type: String, required: true },
  productName: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  photos: {type : [String] , required: true},
  onDiscount: { type: Boolean, default: false },
  discountedPrice: Number,
  quantityAvailable: Number,
  availabilityStatus: {type : String , enum:['available','unavailable'] , default:'unavailable'},
  categoryId: { type: String, required: true },
  categoryTypeId: { type: String, required: true },
  creationDate: { type: Date, default: Date.now },
  sizes: [String],
  colors: [String],
  weight: Number,
  dimensions: String,
  material: String,
  brand: String
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
