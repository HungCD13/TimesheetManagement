const Attendance = require('../models/Attendance');
const Assignment = require('../models/Assignment');

const {
  parse,
  addDays,
  subMinutes,
  addMinutes,
  isBefore,
  isAfter,
  differenceInMinutes,
  startOfDay,
  endOfDay
} = require('date-fns');

/**
 * HELPER: Tính thời gian thực tế của ca làm
 * Hỗ trợ ca qua đêm
 */
const getShiftTimings = (shift, assignmentDate) => {
  let start = parse(shift.startTime, 'HH:mm', assignmentDate);
  let end = parse(shift.endTime, 'HH:mm', assignmentDate);

  if (isBefore(end, start)) {
    end = addDays(end, 1);
  }

  return { start, end };
};

const autoCheckoutExpired = async () => {
  const now = new Date();

  // 1. Lấy tất cả attendance chưa checkout
  const attendances = await Attendance.find({
    checkOut: null,
    status: { $ne: 'invalid' }
  }).populate({
    path: 'assignmentId',
    populate: { path: 'shiftId' }
  });

  const updatedList = [];

  for (const att of attendances) {
    const assignment = att.assignmentId;
    if (!assignment) continue;

    const { end: shiftEnd } = getShiftTimings(
      assignment.shiftId,
      assignment.date
    );

    // Hết ca + 1h
    const autoCheckoutTime = addHours(shiftEnd, 1);

    if (isBefore(autoCheckoutTime, now)) {
      const workedMinutes = differenceInMinutes(
        autoCheckoutTime,
        att.checkIn
      );

      const shiftDuration = differenceInMinutes(
        shiftEnd,
        getShiftTimings(assignment.shiftId, assignment.date).start
      );

      let overtimeMinutes = 0;
      if (workedMinutes > shiftDuration) {
        overtimeMinutes = workedMinutes - shiftDuration;
      }

      att.checkOut = autoCheckoutTime;
      att.workedMinutes = workedMinutes;
      att.overtimeMinutes = overtimeMinutes;

      if (att.status === 'on_time') {
        att.status = 'auto_checked_out';
      }

      await att.save();

      assignment.status = 'completed';
      await assignment.save();

      updatedList.push(att);
    }
  }

  return updatedList;
};

const checkIn = async (user, assignmentId) => {
  const now = new Date();

  const assignment = await Assignment.findOne({
    _id: assignmentId,
    userId: user._id
  }).populate('shiftId');

  if (!assignment) {
    const err = new Error('Assignment not found');
    err.status = 404;
    throw err;
  }

  const existed = await Attendance.findOne({ assignmentId });
  if (existed) {
    const err = new Error('Already checked in');
    err.status = 400;
    throw err;
  }

  const { start: shiftStart } = getShiftTimings(
    assignment.shiftId,
    assignment.date
  );

  const allowedStart = subMinutes(shiftStart, 15);
  const allowedEnd = addMinutes(shiftStart, 30);

  let status = 'checked_in';
  let note = null;

  if (isBefore(now, allowedStart)) {
    const err = new Error('Too early to check in');
    err.status = 400;
    throw err;
  }

  if (isAfter(now, allowedEnd)) {
    status = 'invalid';
    note = 'Check-in time window expired (Late > 30m)';
  } else if (isAfter(now, shiftStart)) {
    status = 'late';
  } else {
    status = 'on_time';
  }

  const attendance = await Attendance.create({
    userId: user._id,
    assignmentId,
    checkIn: now,
    status,
    note
  });

  assignment.status = 'in_progress';
  await assignment.save();

  return {
    message:
      status === 'invalid'
        ? 'Checked in but INVALID (Late)'
        : 'Check-in successful',
    data: attendance
  };
};

const checkOut = async (user, assignmentId) => {
  const now = new Date();

  const attendance = await Attendance.findOne({
    assignmentId,
    userId: user._id
  });

  if (!attendance) {
    const err = new Error('Attendance record not found (Must check-in first)');
    err.status = 404;
    throw err;
  }

  if (attendance.checkOut) {
    const err = new Error('Already checked out');
    err.status = 400;
    throw err;
  }

  const assignment = await Assignment.findById(assignmentId)
    .populate('shiftId');

  const { start, end } = getShiftTimings(
    assignment.shiftId,
    assignment.date
  );
// Chặn quên checkout
const maxCheckOutTime = addMinutes(end, 240);
if( isAfter(now, maxCheckOutTime)) {
  const err = new Error('Check-out time window expired, please submit a manual request');
  err.status = 400;
  throw err;
}
// Tính toán thời gian thực tế
  const workedMinutes = differenceInMinutes(now, attendance.checkIn);
  const shiftDuration = differenceInMinutes(end, start);
  const breakTime = shiftDuration >= 300 ? 60 : 0;
  let netWorkedMinutes = workedMinutes - breakTime;
  if (netWorkedMinutes < 0) netWorkedMinutes = 0;
// Tính overTime 
  let overtimeMinutes = 0;
  if (isAfter(now, end)) {
    overtimeMinutes = differenceInMinutes(now, end);
    if (overtimeMinutes < 30) overtimeMinutes = 0;
  }
// Xử lí trạng thái
let status = attendance.status;
let note = attendance.note || '';
const allowedCheckOutStart = subMinutes(end, 15);
if( isBefore(now, allowedCheckOutStart)) {
  if (status == 'late') {
    status = 'late_early_leave';
    note += ' | Left early';
  }else if (status == 'on_time') {
    status = 'early_leave';
}
}

  attendance.checkOut = now;
  attendance.workedMinutes = workedMinutes;
  attendance.netWorkedMinutes = netWorkedMinutes;
  attendance.overtimeMinutes = overtimeMinutes;
  attendance.status = status;

  if (attendance.status === 'on_time' && isBefore(now, end)) {
    attendance.status = 'early_leave';
  }

  await attendance.save();

  assignment.status = 'completed';
  await assignment.save();

  return {
    message: 'Check-out successful',
    workedMinutes,
    overtimeMinutes,
    status: attendance.status
  };
};

const getMyAttendance = async (user) => {
  return Attendance.find({ userId: user._id })
    .populate({
      path: 'assignmentId',
      populate: {
        path: 'shiftId',
        select: 'name startTime endTime'
      }
    })
    .sort({ createdAt: -1 });
};

const getAllAttendance = async ({ user_id, from, to }) => {
  const query = {};

  if (user_id) {
    query.userId = user_id;
  }

  if (from || to) {
    query.checkIn = {};
    if (from) query.checkIn.$gte = startOfDay(new Date(from));
    if (to) query.checkIn.$lte = endOfDay(new Date(to));
  }

  return Attendance.find(query)
    .populate('userId', 'username')
    .populate({
      path: 'assignmentId',
      populate: { path: 'shiftId', select: 'name' }
    })
    .sort({ checkIn: -1 });
};

module.exports = {
  autoCheckoutExpired,
  checkIn,
  checkOut,
  getMyAttendance,
  getAllAttendance
};

