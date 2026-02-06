const express = require('express');
const router = express.Router();
const { getPayrollReport, updateHourlyRate } = require('../controllers/payrollController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/report', protect, authorizeRoles('admin', 'manager'), getPayrollReport);

router.put('/rate/:userId', protect, authorizeRoles('admin'), updateHourlyRate);

module.exports = router;