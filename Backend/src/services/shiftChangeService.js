const ShiftChangeRequest = require('../models/ShiftChangeRequest');
const Assignment = require('../models/Assignment');

const createRequest = async (user, data) => {
  const { assignmentId, desiredDate, desiredShiftId, reason } = data;

  const assignment = await Assignment.findOne({
    _id: assignmentId,
    userId: user._id
  });

  if (!assignment) {
    const err = new Error('Assignment not found or not authorized');
    err.status = 404;
    throw err;
  }

  return ShiftChangeRequest.create({
    userId: user._id,
    assignmentId,
    desiredDate,
    desiredShiftId,
    reason
  });
};

const approveRequest = async (user, requestId, status) => {
  const request = await ShiftChangeRequest.findById(requestId);

  if (!request) {
    const err = new Error('Request not found');
    err.status = 404;
    throw err;
  }

  if (request.status !== 'pending') {
    const err = new Error('Request already processed');
    err.status = 400;
    throw err;
  }

  request.status = status;
  request.approvedBy = user._id;
  await request.save();

  if (status === 'approved') {
    const assignment = await Assignment.findById(request.assignmentId);
    if (assignment) {
      if (request.desiredDate) assignment.date = request.desiredDate;
      if (request.desiredShiftId) assignment.shiftId = request.desiredShiftId;
      assignment.status = 'pending';
      await assignment.save();
    }
  }

  return request;
};

const getRequests = async (user) => {
  const query = {};

  if (user.role === 'employee') {
    query.userId = user._id;
  }

  return ShiftChangeRequest.find(query)
    .populate('userId', 'username')
    .populate('assignmentId')
    .populate('desiredShiftId')
    .sort({ createdAt: -1 });
};

module.exports = { createRequest, approveRequest, getRequests };
