
const express = require('express');
const router = express.Router();

const { getAllEmployees, updateUser, deleteUser } = require('../controllers/userController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
router.get('/', protect, authorizeRoles('admin', 'manager'), getAllEmployees);
router.put('/:id', protect, authorizeRoles('admin'), updateUser);
router.delete('/:id', protect, authorizeRoles('admin'), deleteUser);

module.exports = router;