const User = require('../models/User');


const getAllEmployees = async (req, res) => {
  try {
 //laâyấy uuser employee - ko laâấy password
    const users = await User.find({ role: 'employee' }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllEmployees };