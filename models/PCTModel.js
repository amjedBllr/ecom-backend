//? product category types collection model

const mongoose = require('mongoose');

const productCategoryTypeSchema = mongoose.Schema({
  categoryName: { type: String, required: true },
  typeName: { type: String, required: true },
  description: String
});

const productCategoryType= mongoose.model('product-Category-Type', productCategoryTypeSchema);

module.exports = productCategoryType;
