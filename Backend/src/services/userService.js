const User = require('../models/User');

const getAllEmployees = async () => {
  return User.find({ role: 'employee' }).select('-password');
};

module.exports = { getAllEmployees };
