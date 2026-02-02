const express = require('express');
const router = express.Router();
const { createRequest, approveRequest, getRequests } = require('../controllers/shiftChangeController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/', protect, createRequest);
router.get('/', protect, getRequests);
router.put('/:id/approve', protect, authorizeRoles('admin', 'manager'), approveRequest);

module.exports = router;