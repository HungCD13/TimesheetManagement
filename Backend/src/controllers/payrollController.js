// const Attendance = require('../models/Attendance');
// const User = require('../models/User');
// const { startOfMonth, endOfMonth, parseISO } = require('date-fns');

// // @desc    Lấy báo cáo lương của tất cả nhân viên trong tháng
// // @route   GET /api/payroll/report?month=YYYY-MM
// const getPayrollReport = async (req, res) => {
//   try {
//     const { month } = req.query; // Format: 2023-10
    
//     // Xác định đầu tháng và cuối tháng
//     const dateRef = month ? parseISO(month + '-01') : new Date();
//     const start = startOfMonth(dateRef);
//     const end = endOfMonth(dateRef);

//     // 1. Lấy tất cả nhân viên
//     const employees = await User.find({ role: 'employee' }).select('username hourlyRate');

//     const report = [];

//     // 2. Tính lương cho từng người
//     for (const emp of employees) {
//       // Lấy tất cả attendance của nhân viên này trong tháng
//       const attendances = await Attendance.find({
//         userId: emp._id,
//         checkIn: { $gte: start, $lte: end },
//         status: { $ne: 'invalid' } // Không tính các ca bị lỗi
//       });

//       // Tổng số phút làm việc
//       const totalMinutes = attendances.reduce((acc, curr) => acc + (curr.workedMinutes || 0), 0);
      
//       // Tổng số phút tăng ca
//       const totalOvertime = attendances.reduce((acc, curr) => acc + (curr.overtimeMinutes || 0), 0);

//       // Tính tiền: (Phút / 60) * Rate
//       // Có thể nhân hệ số 1.5 cho overtime nếu muốn (Ở đây tính bằng giá thường cho đơn giản)
//       const totalSalary = Math.round((totalMinutes / 60) * emp.hourlyRate);

//       report.push({
//         userId: emp._id,
//         username: emp.username,
//         hourlyRate: emp.hourlyRate,
//         totalShifts: attendances.length,
//         totalHours: (totalMinutes / 60).toFixed(1),
//         totalOvertimeHours: (totalOvertime / 60).toFixed(1),
//         totalSalary: totalSalary
//       });
//     }

//     res.json({ month: month || 'current', data: report });

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @desc    Cập nhật lương cơ bản cho nhân viên
// // @route   PUT /api/payroll/rate/:userId
// const updateHourlyRate = async (req, res) => {
//   try {
//     const { hourlyRate } = req.body;
//     const user = await User.findById(req.params.userId);

//     if (!user) return res.status(404).json({ message: 'User not found' });

//     user.hourlyRate = hourlyRate;
//     await user.save();

//     res.json({ message: 'Updated successfully', user });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// module.exports = { getPayrollReport, updateHourlyRate };

const PayrollService = require('../services/payrollService');

// @desc    Lấy báo cáo lương theo tháng
// @route   GET /api/payroll/report?month=YYYY-MM
const getPayrollReport = async (req, res) => {
  try {
    const report = await PayrollService.getPayrollReport(req.query.month);
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cập nhật lương theo giờ
// @route   PUT /api/payroll/rate/:userId
const updateHourlyRate = async (req, res) => {
  try {
    const user = await PayrollService.updateHourlyRate(
      req.params.userId,
      req.body.hourlyRate
    );
    res.json({ message: 'Updated successfully', user });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

module.exports = { getPayrollReport, updateHourlyRate };
