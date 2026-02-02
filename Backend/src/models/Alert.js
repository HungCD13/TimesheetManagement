const mongoose = require('mongoose');

const AlertSchema = new mongoose.Schema({
  assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false } // Đổi read -> isRead cho chuẩn boolean
}, { timestamps: true });

module.exports = mongoose.model('Alert', AlertSchema);