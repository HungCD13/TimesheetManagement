const express = require('express');
const router = express.Router();
const { getShifts, createShift, updateShift, deleteShift } = require('../controllers/shiftController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/', protect, getShifts);
router.post('/', protect, authorizeRoles('admin'), createShift);
router.put('/:id', protect, authorizeRoles('admin'), updateShift); // Route mới
router.delete('/:id', protect, authorizeRoles('admin'), deleteShift);

module.exports = router;