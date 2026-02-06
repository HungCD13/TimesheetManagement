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
