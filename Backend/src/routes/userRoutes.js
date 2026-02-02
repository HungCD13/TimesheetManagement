const express = require('express');
const router = express.Router();
const { getAllEmployees } = require('../controllers/userController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/', protect, authorizeRoles('admin', 'manager'), getAllEmployees);

module.exports = router;