const mongoose = require('mongoose');

const shiftSchema = new mongoose.Schema({
  name: { type: String, required: true },
  startTime: { type: String, required: true }, 
  endTime: { type: String, required: true },   
  requiredHeadcount: { type: Number, default: 1 }
}, { timestamps: true });

module.exports = mongoose.model('Shift', shiftSchema);