const mongoose = require('mongoose');

const shiftChangeRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true }, 
  desiredDate: { type: Date },
  desiredShiftId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shift' }, 
  reason: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } 
}, { timestamps: true });

module.exports = mongoose.model('ShiftChangeRequest', shiftChangeRequestSchema);