const ShiftChangeRequest = require('../models/ShiftChangeRequest');
const Assignment = require('../models/Assignment');

// @desc    Tạo yêu cầu đổi ca
// @route   POST /api/shift_changes
const createRequest = async (req, res) => {
  try {
    const { assignmentId, desiredDate, desiredShiftId, reason } = req.body;

    // Validate: Assignment có thuộc về user này không
    const assignment = await Assignment.findOne({ _id: assignmentId, userId: req.user._id });
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found or not authorized' });
    }

    const request = await ShiftChangeRequest.create({
      userId: req.user._id,
      assignmentId,
      desiredDate,
      desiredShiftId,
      reason
    });

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Duyệt yêu cầu đổi ca (Manager/Admin)
// @route   PUT /api/shift_changes/:id/approve
const approveRequest = async (req, res) => {
  try {
    const { status } = req.body; // 'approved' hoặc 'rejected'
    const request = await ShiftChangeRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Request already processed' });
    }

    request.status = status;
    request.approvedBy = req.user._id;
    await request.save();

    // Logic: Nếu Approved -> Cập nhật lại Assignment cũ
    if (status === 'approved') {
        const assignment = await Assignment.findById(request.assignmentId);
        if (assignment) {
            // Cập nhật sang ngày/ca mới nếu có
            if (request.desiredDate) assignment.date = request.desiredDate;
            if (request.desiredShiftId) assignment.shiftId = request.desiredShiftId;
            // Reset status assignment về pending để check-in lại
            assignment.status = 'pending'; 
            await assignment.save();
        }
    }

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Lấy danh sách yêu cầu
// @route   GET /api/shift_changes
const getRequests = async (req, res) => {
  try {
    const query = {};
    // Employee chỉ xem được của mình
    if (req.user.role === 'employee') {
      query.userId = req.user._id;
    }

    const requests = await ShiftChangeRequest.find(query)
      .populate('userId', 'username')
      .populate('assignmentId')
      .populate('desiredShiftId')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createRequest, approveRequest, getRequests };