const express = require('express');
const router = express.Router();
const { createAssignment, getAssignments } = require('../controllers/assignmentController');
const { protect, admin } = require('../middleware/authMiddleware');

// User thường chỉ xem được assignment
router.get('/', protect, getAssignments);

// Chỉ Admin mới được phân ca
router.post('/', protect, admin, createAssignment);

module.exports = router;