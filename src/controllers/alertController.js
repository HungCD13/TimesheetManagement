const Assignment = require('../models/Assignment');
const Attendance = require('../models/Attendance');
const Alert = require('../models/Alert');
const { 
  startOfDay, 
  endOfDay, 
  addDays, 
  parse, 
  addMinutes, 
  isBefore, 
  isAfter 
} = require('date-fns');

// @desc    Quét các assignment để tạo cảnh báo vắng mặt
// @route   POST /api/alerts/scan
const scanAssignmentsForAlerts = async (req, res) => {
  try {
    const now = new Date();
    const todayStart = startOfDay(now);
    const todayEnd = endOfDay(now);

    // 1. Lấy tất cả assignment của "hôm nay"
    const assignments = await Assignment.find({
      date: { $gte: todayStart, $lte: todayEnd }
    }).populate('shiftId userId');

    const createdAlerts = [];

    for (const asg of assignments) {
      const shift = asg.shiftId;
      if (!shift) continue;

      // 2. Tính thời điểm bắt đầu ca (Start Time) dựa trên ngày của Assignment
      // Parse giờ "HH:mm" từ Shift vào ngày của Assignment
      let shiftStartDateTime = parse(shift.startTime, 'HH:mm', asg.date);

      // 3. Ngưỡng cảnh báo: Start Time + 30 phút
      const threshold = addMinutes(shiftStartDateTime, 30);

      // Nếu hiện tại chưa vượt qua ngưỡng 30p sau giờ bắt đầu -> Chưa cần check
      if (isBefore(now, threshold)) continue;

      // 4. Kiểm tra xem đã có Attendance record nào chưa
      // Lưu ý: Dùng assignmentId để tìm (theo Schema Attendance cũ)
      const existingAttendance = await Attendance.findOne({ assignmentId: asg._id });

      // Nếu chưa có Attendance -> Tạo Alert
      if (!existingAttendance) {
        // Kiểm tra xem Alert đã được tạo chưa để tránh trùng lặp
        const existingAlert = await Alert.findOne({ 
          assignmentId: asg._id, 
          message: { $regex: 'Vắng mặt' } 
        });

        if (!existingAlert) {
          const message = `Cảnh báo: Nhân viên ${asg.userId?.username || 'Unknown'} chưa check-in ca ${shift.name} (Quá 30p).`;
          
          const alertDoc = await Alert.create({
            assignmentId: asg._id,
            userId: asg.userId?._id,
            message,
            isRead: false
          });
          
          createdAlerts.push(alertDoc);
          
          // Có thể update status assignment thành 'absent' luôn nếu muốn
          asg.status = 'absent';
          await asg.save();
        }
      }
    }

    res.json({ 
      message: 'Scan completed', 
      newAlertsCount: createdAlerts.length, 
      alerts: createdAlerts 
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// @desc    Lấy danh sách cảnh báo
// @route   GET /api/alerts
const getAlerts = async (req, res) => {
  try {
    const query = {};
    // Nếu là employee, chỉ xem alert của chính mình
    if (req.user.role === 'employee') {
      query.userId = req.user._id;
    }
    
    const alerts = await Alert.find(query)
      .populate('assignmentId userId')
      .sort({ createdAt: -1 });
      
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Đánh dấu đã đọc
// @route   POST /api/alerts/:id/read
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const alert = await Alert.findByIdAndUpdate(id, { isRead: true }, { new: true });
    
    if (!alert) return res.status(404).json({ message: 'Alert not found' });
    
    res.json(alert);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { scanAssignmentsForAlerts, getAlerts, markAsRead };