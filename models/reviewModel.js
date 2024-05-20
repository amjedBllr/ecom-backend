//? reviews collection model

const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
  productId: { type: String, required: true },
  userId: { type: String, required: true },
  fullname:{ type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  reviewDate: { type: Date, default: Date.now }
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
