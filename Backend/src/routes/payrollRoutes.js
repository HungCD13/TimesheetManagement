const express = require('express');
const router = express.Router();
const { getPayrollReport, updateHourlyRate } = require('../controllers/payrollController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Xem báo cáo lương (Admin/Manager)
router.get('/report', protect, authorizeRoles('admin', 'manager'), getPayrollReport);

// Cập nhật mức lương (Admin only)
router.put('/rate/:userId', protect, authorizeRoles('admin'), updateHourlyRate);

module.exports = router;