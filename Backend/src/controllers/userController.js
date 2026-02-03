// const User = require('../models/User');


// const getAllEmployees = async (req, res) => {
//   try {
//  //laâyấy uuser employee - ko laâấy password
//     const users = await User.find({ role: 'employee' }).select('-password');
//     res.json(users);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// module.exports = { getAllEmployees };

const UserService = require('../services/userService');

const getAllEmployees = async (req, res) => {
  try {
    const users = await UserService.getAllEmployees();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllEmployees };
