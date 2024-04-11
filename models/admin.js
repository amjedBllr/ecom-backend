//? admins collection model
const mongoose = require('mongoose');

const adminSchema = mongoose.Schema({
  userId: { type: String, required: true },
  jobTitle: String,
  contactEmail: String,
  contactPhone: String,
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
