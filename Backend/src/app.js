const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect Database
connectDB();

require('./cron/autoCheckoutJob');


const app = express();

// Middleware
app.use(express.json()); // Parse JSON body
app.use(cors());

// Routes Imports
const attendanceRoutes = require('./routes/attendanceRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');
const authRoutes = require('./routes/authRoutes');
const shiftRoutes = require('./routes/shiftRoutes');
const alertRoutes = require('./routes/alertRoutes');
const shiftChangeRoutes = require('./routes/shiftChangeRoutes'); 
const userRoutes = require('./routes/userRoutes');
const payrollRoutes = require('./routes/payrollRoutes');


// (Giả sử bạn đã tạo các file route còn lại tương tự)
// const authRoutes = require('./src/routes/authRoutes');
// const shiftRoutes = require('./src/routes/shiftRoutes');

// Mount Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/shifts', shiftRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/shifts', shiftRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/shift_changes', shiftChangeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/payroll', payrollRoutes);



// Cronjob giả lập cho Alerts Logic (Yêu cầu 2d)
// Trong thực tế nên dùng thư viện 'node-cron'
const checkAbsentEmployees = () => {
    // Logic: Quét Assignment có date = hôm nay.
    // Nếu (CurrentTime > ShiftStartTime + 30m) AND (Attendance record chưa tồn tại)
    // -> Tạo Alert "Vắng mặt"
    console.log("Running background job: Checking absent employees...");
};
setInterval(checkAbsentEmployees, 60 * 60 * 1000); // Chạy mỗi tiếng 1 lần

// Root route
app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.MONGO_URI}`);
});