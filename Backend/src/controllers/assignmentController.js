// const Assignment = require('../models/Assignment');
// const Shift = require('../models/Shift');
// const { parseISO, startOfDay } = require('date-fns');

// // @desc    Gán ca làm việc cho nhân viên
// // @route   POST /api/assignments
// // @access  Admin/Manager
// const createAssignment = async (req, res) => {
//   try {
//     const { userId, shiftId, date } = req.body;

//     // Chuẩn hóa ngày về đầu ngày (00:00:00) để dễ query
//     const assignmentDate = startOfDay(new Date(date));

//     // Kiểm tra trùng lặp: Nhân viên đã có ca trong ngày này chưa?
//     const existingAssignment = await Assignment.findOne({
//       userId,
//       date: assignmentDate
//     });

//     if (existingAssignment) {
//       return res.status(400).json({ message: 'User already has an assignment on this date' });
//     }

//     const assignment = await Assignment.create({
//       userId,
//       shiftId,
//       date: assignmentDate
//     });

//     res.status(201).json(assignment);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @desc    Lấy danh sách phân công theo ngày
// // @route   GET /api/assignments?date=YYYY-MM-DD
// // @access  Private
// const getAssignments = async (req, res) => {
//   try {
//     const { date } = req.query;
//     let query = {};

//     if (date) {
//       const queryDate = startOfDay(new Date(date));
//       query.date = queryDate;
//     }

//     // Nếu không phải admin/manager, chỉ xem được của mình
//     if (req.user.role === 'employee') {
//       query.userId = req.user._id;
//     }

//     const assignments = await Assignment.find(query)
//       .populate('userId', 'username')
//       .populate('shiftId', 'name startTime endTime');

//     res.json(assignments);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// module.exports = { createAssignment, getAssignments };


const AssignmentService = require('../services/assignmentService');

// @route POST /api/assignments
const createAssignment = async (req, res) => {
  try {
    const assignment = await AssignmentService.createAssignment(req.body);
    res.status(201).json(assignment);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

// @route GET /api/assignments?date=YYYY-MM-DD
const getAssignments = async (req, res) => {
  try {
    const assignments = await AssignmentService.getAssignments(
      req.user,
      req.query.date
    );
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createAssignment, getAssignments };
