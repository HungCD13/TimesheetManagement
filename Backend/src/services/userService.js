const User = require('../models/User');

// Lấy danh sách nhân viên
const getAllEmployees = async () => {
  return await User.find({ role: 'employee' }).select('-password');
};

// Cập nhật nhân viên
const updateUser = async (id, data) => {
  const user = await User.findById(id);

  if (!user) {
    throw new Error('User not found');
  }

  // Cập nhật thông tin
  user.username = data.username || user.username;
  user.fullname = data.fullname || user.fullname;
  user.bank = data.bank || user.bank;
  user.role = data.role || user.role;
  user.hourlyRate = data.hourlyRate || user.hourlyRate;

  // Chỉ cập nhật password nếu có (Mongoose pre-save sẽ tự hash)
  if (data.password && data.password.trim() !== '') {
    user.password = data.password;
  }

  const updatedUser = await user.save();

  return {
    _id: updatedUser._id,
    username: updatedUser.username,
    fullname: updatedUser.fullname,
    role: updatedUser.role,
    bank: updatedUser.bank,
    hourlyRate: updatedUser.hourlyRate
  };
};

// Xóa nhân viên
const deleteUser = async (id) => {
  const user = await User.findById(id);
  
  if (!user) {
    throw new Error('User not found');
  }

  await user.deleteOne(); // Hoặc user.remove() tùy phiên bản
  return { message: 'User removed' };
};

module.exports = { getAllEmployees, updateUser, deleteUser };