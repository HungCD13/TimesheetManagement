const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true },
  checkIn: { type: Date },
  checkOut: { type: Date },
  shiftStart: { type: Date },
  shiftEnd: { type: Date },
  autoCheckedOut: { type: Boolean, default: false },

  status: { 
    type: String, 
    enum: ['on_time', 'late', 'early_leave','late_early_leave', 'invalid', 'checked_in'], 
    default: 'checked_in' 
  },
  workedMinutes: { type: Number, default: 0 },
  netWorkedMinutes: { type: Number, default: 0 },
  overtimeMinutes: { type: Number, default: 0 },
  note: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);