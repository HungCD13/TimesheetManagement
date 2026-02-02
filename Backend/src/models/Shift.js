const mongoose = require('mongoose');

const shiftSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Ví dụ: "Ca Sáng", "Ca Đêm"
  startTime: { type: String, required: true }, // Format: "HH:mm" (22:00)
  endTime: { type: String, required: true },   // Format: "HH:mm" (06:00)
  requiredHeadcount: { type: Number, default: 1 }
}, { timestamps: true });

module.exports = mongoose.model('Shift', shiftSchema);