//? questions collection model

const mongoose = require('mongoose');

const questionSchema = mongoose.Schema({
  userId: { type: String, required: true },
  questionDate: { type: Date, default: Date.now },
  questionStatus: { type: String, enum:['pending','Processing','treated'] ,default:'pending' }
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question ;
