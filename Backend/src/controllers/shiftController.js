const Shift = require('../models/Shift');

// ... (Giữ nguyên getShifts, createShift) ...
const getShifts = async (req, res) => {
    /* Code cũ */ 
    const shifts = await Shift.find();
    res.json(shifts);
};
const createShift = async (req, res) => {
    /* Code cũ */
    const { name, startTime, endTime, requiredHeadcount } = req.body;
    const shift = await Shift.create({ name, startTime, endTime, requiredHeadcount });
    res.status(201).json(shift);
};

// @desc    Cập nhật ca làm việc
// @route   PUT /api/shifts/:id
const updateShift = async (req, res) => {
  try {
    const { name, startTime, endTime, requiredHeadcount } = req.body;
    const shift = await Shift.findById(req.params.id);

    if (!shift) {
      return res.status(404).json({ message: 'Shift not found' });
    }

    shift.name = name || shift.name;
    shift.startTime = startTime || shift.startTime;
    shift.endTime = endTime || shift.endTime;
    shift.requiredHeadcount = requiredHeadcount || shift.requiredHeadcount;

    const updatedShift = await shift.save();
    res.json(updatedShift);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getShifts, createShift, updateShift };