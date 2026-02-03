const Assignment = require('../models/Assignment');
const { startOfDay } = require('date-fns');

const createAssignment = async ({ userId, shiftId, date }) => {
  const assignmentDate = startOfDay(new Date(date));

  const existing = await Assignment.findOne({
    userId,
    date: assignmentDate
  });

  if (existing) {
    const err = new Error('User already has an assignment on this date');
    err.status = 400;
    throw err;
  }

  return Assignment.create({
    userId,
    shiftId,
    date: assignmentDate
  });
};

const getAssignments = async (user, date) => {
  const query = {};

  if (date) {
    query.date = startOfDay(new Date(date));
  }

  if (user.role === 'employee') {
    query.userId = user._id;
  }

  return Assignment.find(query)
    .populate('userId', 'username')
    .populate('shiftId', 'name startTime endTime');
};

module.exports = { createAssignment, getAssignments };
