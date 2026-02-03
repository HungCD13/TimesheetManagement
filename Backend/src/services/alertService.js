const Attendance = require('../models/Attendance');
const { startOfMonth, endOfMonth, parseISO } = require('date-fns');

const getLateEmployeesInMonth = async (month) => {
  // month: YYYY-MM
  const dateRef = month ? parseISO(month + '-01') : new Date();

  const start = startOfMonth(dateRef);
  const end = endOfMonth(dateRef);

  const records = await Attendance.find({
    status: 'late',
    checkIn: { $gte: start, $lte: end }
  })
    .populate('userId', 'username')
    .populate({
      path: 'assignmentId',
      populate: { path: 'shiftId', select: 'name startTime' }
    })
    .sort({ checkIn: 1 });

  return records.map(r => ({
    userId: r.userId?._id,
    username: r.userId?.username,
    shift: r.assignmentId?.shiftId?.name,
    shiftStart: r.assignmentId?.shiftId?.startTime,
    checkInTime: r.checkIn,
  }));
};

module.exports = {
  getLateEmployeesInMonth
};
