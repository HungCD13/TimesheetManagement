const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  shiftId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shift', required: true },
  date: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'in_progress', 'completed', 'absent'], 
    default: 'pending' 
  }
}, { timestamps: true });

// Index để tìm nhanh theo ngày và user
assignmentSchema.index({ userId: 1, date: 1 });

module.exports = mongoose.model('Assignment', assignmentSchema);