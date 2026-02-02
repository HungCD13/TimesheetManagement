const Attendance = require('../models/Attendance');
const Assignment = require('../models/Assignment');
const Shift = require('../models/Shift');
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

// --- HELPER: Logic tính toán thời gian thực của ca làm việc ---
const getShiftTimings = (shift, assignmentDate) => {
  // Parse giờ từ string "HH:mm" kết hợp với ngày phân công
  let start = parse(shift.startTime, 'HH:mm', assignmentDate);
  let end = parse(shift.endTime, 'HH:mm', assignmentDate);

  // LOGIC CA QUA ĐÊM (Overnight Shift):
  // Nếu giờ kết thúc nhỏ hơn giờ bắt đầu (ví dụ 06:00 < 22:00),
  // tức là ca làm việc kéo dài sang ngày hôm sau.
  if (isBefore(end, start)) {
    end = addDays(end, 1);
  }

  return { start, end };
};

// @desc    Check-in
// @route   POST /api/attendance/checkin
const checkIn = async (req, res) => {
  try {
    const { assignmentId } = req.body;
    const now = new Date(); // Thời điểm quét thẻ thực tế

    // 1. Tìm Assignment & Populate thông tin Shift
    const assignment = await Assignment.findOne({ 
      _id: assignmentId, 
      userId: req.user._id 
    }).populate('shiftId');

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Kiểm tra xem đã checkin chưa
    const existingAttendance = await Attendance.findOne({ assignmentId });
    if (existingAttendance) {
      return res.status(400).json({ message: 'Already checked in' });
    }

    // 2. Tính toán khung giờ cho phép Check-in
    const { start: shiftStart } = getShiftTimings(assignment.shiftId, assignment.date);
    
    // Quy tắc: [Start - 15p, Start + 30p]
    const allowedStart = subMinutes(shiftStart, 15);
    const allowedEnd = addMinutes(shiftStart, 30);

    let status = 'checked_in';
    let errorMessage = null;

    // 3. Validate thời gian
    if (isBefore(now, allowedStart)) {
      return res.status(400).json({ message: 'Too early to check in' });
    } 
    
    if (isAfter(now, allowedEnd)) {
      status = 'invalid'; 
      errorMessage = 'Check-in time window expired (Late > 30m)';
    } else if (isAfter(now, shiftStart)) {
      status = 'late';
    } else {
      status = 'on_time';
    }

    // 4. Lưu Attendance
    const attendance = await Attendance.create({
      userId: req.user._id,
      assignmentId,
      checkIn: now,
      status: status,
      note: errorMessage
    });

    // Update status assignment
    assignment.status = 'in_progress';
    await assignment.save();

    res.status(201).json({
      message: status === 'invalid' ? 'Checked in but INVALID (Late)' : 'Check-in successful',
      data: attendance
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Check-out
// @route   POST /api/attendance/checkout
const checkOut = async (req, res) => {
  try {
    const { assignmentId } = req.body;
    const now = new Date();

    const attendance = await Attendance.findOne({ 
      assignmentId, 
      userId: req.user._id 
    });

    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found (Must check-in first)' });
    }
    
    if (attendance.checkOut) {
      return res.status(400).json({ message: 'Already checked out' });
    }

    const assignment = await Assignment.findById(assignmentId).populate('shiftId');
    const { start: shiftStart, end: shiftEnd } = getShiftTimings(assignment.shiftId, assignment.date);

    const workedMinutes = differenceInMinutes(now, attendance.checkIn);
    const shiftDuration = differenceInMinutes(shiftEnd, shiftStart);

    let overtimeMinutes = 0;
    if (workedMinutes > shiftDuration) {
      overtimeMinutes = workedMinutes - shiftDuration;
    }

    attendance.checkOut = now;
    attendance.workedMinutes = workedMinutes;
    attendance.overtimeMinutes = overtimeMinutes;
    
    // Nếu lúc checkin đã late/invalid thì giữ nguyên, nếu checkin on_time mà về sớm thì...
    if (attendance.status === 'on_time' && isBefore(now, shiftEnd)) {
        attendance.status = 'early_leave'; 
    }

    await attendance.save();

    assignment.status = 'completed';
    await assignment.save();

    res.json({
      message: 'Check-out successful',
      workedMinutes,
      overtimeMinutes,
      status: attendance.status
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Xem lịch sử chấm công cá nhân
const getMyAttendance = async (req, res) => {
  try {
    const history = await Attendance.find({ userId: req.user._id })
      .populate({
        path: 'assignmentId',
        populate: { path: 'shiftId', select: 'name startTime endTime' }
      })
      .sort({ createdAt: -1 });
    
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Lấy danh sách chấm công (Admin Filter)
// @route   GET /api/attendance
// Params: user_id, from (YYYY-MM-DD), to (YYYY-MM-DD)
const getAllAttendance = async (req, res) => {
  try {
    const { user_id, from, to } = req.query;
    let query = {};

    // Filter theo User
    if (user_id) {
      query.userId = user_id;
    }

    // Filter theo Date Range (dựa vào checkIn time)
    if (from || to) {
      query.checkIn = {};
      if (from) query.checkIn.$gte = startOfDay(new Date(from));
      if (to) query.checkIn.$lte = endOfDay(new Date(to));
    }

    const attendanceList = await Attendance.find(query)
      .populate('userId', 'username')
      .populate({
        path: 'assignmentId',
        populate: { path: 'shiftId', select: 'name' }
      })
      .sort({ checkIn: -1 });

    res.json(attendanceList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
  checkIn, 
  checkOut, 
  getMyAttendance, 
  getAllAttendance 
};