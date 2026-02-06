const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '1h'
  });
};

const registerUser = async ({ 
  username, 
  password, 
  role, 
  fullname, 
  bank 
}) => {

  const userExists = await User.findOne({ username });
  if (userExists) {
    const err = new Error('User already exists');
    err.status = 400;
    throw err;
  }

  const user = await User.create({
    username,
    password,
    role: role || 'employee',
    fullname,
    bank
  });

  return {
    _id: user._id,
    username: user.username,
    fullname: user.fullname,
    bank: user.bank,
    role: user.role,
    token: generateToken(user._id)
  };
};


const loginUser = async ({ username, password }) => {
  const user = await User.findOne({ username });

  if (!user || !(await user.matchPassword(password))) {
    const err = new Error('Invalid username or password');
    err.status = 401;
    throw err;
  }

  return {
    _id: user._id,
    username: user.username,
    role: user.role,
    token: generateToken(user._id)
  };
};

module.exports = { registerUser, loginUser };
