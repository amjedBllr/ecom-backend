//? product_categories collection model

const mongoose = require('mongoose');

const productCategorySchema = mongoose.Schema({
  categoryName: { type: String, required: true },
  description: String
});

const ProductCategory = mongoose.model('Product-Category', productCategorySchema);

module.exports = ProductCategory;
