// const express = require('express');
// const router = express.Router();
// const { scanAssignmentsForAlerts, getAlerts, markAsRead } = require('../controllers/alertController');
// const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// // Scan Alerts: Chỉ Admin/Manager được chạy thủ công
// router.post('/scan', protect, authorizeRoles('admin', 'manager'), scanAssignmentsForAlerts);

// // Xem alerts: Ai cũng xem được (nhưng Controller đã lọc theo user nếu là employee)
// router.get('/', protect, getAlerts);

// // Đánh dấu đã đọc
// router.post('/:id/read', protect, markAsRead);

// module.exports = router;

const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alertController');

router.get('/late', alertController.getLateAlerts);

module.exports = router;

