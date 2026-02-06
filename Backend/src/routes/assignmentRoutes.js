const express = require('express');
const router = express.Router();
const { createAssignment, getAssignments } = require('../controllers/assignmentController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', protect, getAssignments);
router.post('/', protect, admin, createAssignment);

module.exports = router;