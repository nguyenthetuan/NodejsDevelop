const mongoose = require('mongoose');

const frendSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: String, required: true },
  address: { type: String, required: true },
});

module.exports = mongoose.model('frends', frendSchema);
