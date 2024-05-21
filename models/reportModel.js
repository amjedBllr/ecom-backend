//? reports collection model

const mongoose = require('mongoose');

const reportSchema = mongoose.Schema({
  userId: { type: String, required: true },
  reportType: { type: String, required: true },
  reportDescription: { type: String, required: true },
  reportedEntityId: String,
  reportDate: { type: Date, default: Date.now },
  reportStatus: { type: String, enum:['pending','Processing','treated'] ,default:'pending' }
});

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
