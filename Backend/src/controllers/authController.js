// const User = require('../models/User');
// const jwt = require('jsonwebtoken');

// // Hàm tạo JWT Token
// const generateToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, {
//     expiresIn: '1d', // Token hết hạn sau 1 ngày
//   });
// };

// // @desc    Đăng ký tài khoản mới
// // @route   POST /api/auth/register
// // @access  Public (Hoặc Admin tuỳ nghiệp vụ)
// const registerUser = async (req, res) => {
//   try {
//     const { username, password, role } = req.body;

//     // Kiểm tra user đã tồn tại chưa
//     const userExists = await User.findOne({ username });
//     if (userExists) {
//       return res.status(400).json({ message: 'User already exists' });
//     }

//     // Tạo user mới
//     const user = await User.create({
//       username,
//       password,
//       role: role || 'employee' // Mặc định là nhân viên nếu không chọn quyền
//     });

//     if (user) {
//       res.status(201).json({
//         _id: user._id,
//         username: user.username,
//         role: user.role,
//         token: generateToken(user._id),
//       });
//     } else {
//       res.status(400).json({ message: 'Invalid user data' });
//     }
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @desc    Đăng nhập & lấy Token
// // @route   POST /api/auth/login
// // @access  Public
// const loginUser = async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     // Tìm user theo username
//     const user = await User.findOne({ username });

//     // Kiểm tra password (dùng hàm matchPassword đã viết trong User Model)
//     if (user && (await user.matchPassword(password))) {
//       res.json({
//         _id: user._id,
//         username: user.username,
//         role: user.role,
//         token: generateToken(user._id),
//       });
//     } else {
//       res.status(401).json({ message: 'Invalid username or password' });
//     }
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @desc    Lấy thông tin user hiện tại
// // @route   GET /api/auth/me
// const getMe = async (req, res) => {
//   // req.user đã có sẵn do middleware protect gán vào
//   res.json({
//     _id: req.user._id,
//     username: req.user.username,
//     role: req.user.role
//   });
// };

// module.exports = { registerUser, loginUser, getMe };

const AuthService = require('../services/authService');

const registerUser = async (req, res) => {
  try {
    const result = await AuthService.registerUser(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const result = await AuthService.loginUser(req.body);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

const getMe = async (req, res) => {
  res.json({
    _id: req.user._id,
    username: req.user.username,
    role: req.user.role
  });
};

module.exports = { registerUser, loginUser, getMe };
