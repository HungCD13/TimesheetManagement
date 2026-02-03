const Attendance = require('../models/Attendance');
const User = require('../models/User');
const { startOfMonth, endOfMonth, parseISO } = require('date-fns');

const getPayrollReport = async (month) => {
  const dateRef = month ? parseISO(month + '-01') : new Date();
  const start = startOfMonth(dateRef);
  const end = endOfMonth(dateRef);

  const employees = await User.find({ role: 'employee' })
    .select('username hourlyRate');

  const report = [];

  for (const emp of employees) {
    const attendances = await Attendance.find({
      userId: emp._id,
      checkIn: { $gte: start, $lte: end },
      status: { $ne: 'invalid' }
    });

    const totalMinutes = attendances.reduce(
      (sum, a) => sum + (a.workedMinutes || 0),
      0
    );

    const totalOvertime = attendances.reduce(
      (sum, a) => sum + (a.overtimeMinutes || 0),
      0
    );

    const totalSalary = Math.round((totalMinutes / 60) * emp.hourlyRate);

    report.push({
      userId: emp._id,
      username: emp.username,
      hourlyRate: emp.hourlyRate,
      totalShifts: attendances.length,
      totalHours: (totalMinutes / 60).toFixed(1),
      totalOvertimeHours: (totalOvertime / 60).toFixed(1),
      totalSalary
    });
  }

  return { month: month || 'current', data: report };
};

const updateHourlyRate = async (userId, hourlyRate) => {
  const user = await User.findById(userId);
  if (!user) {
    const err = new Error('User not found');
    err.status = 404;
    throw err;
  }

  user.hourlyRate = hourlyRate;
  await user.save();

  return user;
};

module.exports = { getPayrollReport, updateHourlyRate };
