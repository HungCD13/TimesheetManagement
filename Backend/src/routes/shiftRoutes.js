const express = require('express');
const router = express.Router();
const { getShifts, createShift, updateShift } = require('../controllers/shiftController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/', protect, getShifts);
router.post('/', protect, authorizeRoles('admin'), createShift);
router.put('/:id', protect, authorizeRoles('admin'), updateShift); // Route mới

module.exports = router;