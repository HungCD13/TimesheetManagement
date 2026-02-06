// const express = require('express');
// const router = express.Router();
// const { getAllEmployees } = require('../controllers/userController');
// const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// router.get('/', protect, authorizeRoles('admin', 'manager'), getAllEmployees);

// //suưửa xoa nhan vien
// router.put('/:id', protect, authorizeRoles('admin'), updateUser);
// router.delete('/:id', protect, authorizeRoles('admin'), deleteUser);

// module.exports = router;

const express = require('express');
const router = express.Router();
// Import đủ 3 hàm từ controller
const { getAllEmployees, updateUser, deleteUser } = require('../controllers/userController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Get All (Admin, Manager)
router.get('/', protect, authorizeRoles('admin', 'manager'), getAllEmployees);

// Update (Admin only)
router.put('/:id', protect, authorizeRoles('admin'), updateUser);

// Delete (Admin only)
router.delete('/:id', protect, authorizeRoles('admin'), deleteUser);

module.exports = router;