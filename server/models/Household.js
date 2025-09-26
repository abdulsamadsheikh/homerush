
const mongoose = require('mongoose');

const householdSchema = new mongoose.Schema({
  name: { type: String, required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  inviteCode: { type: String, required: true, unique: true }
});

module.exports = mongoose.model('Household', householdSchema);
