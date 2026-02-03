const Shift = require('../models/Shift');

const getShifts = async () => {
  return Shift.find();
};

const createShift = async ({ name, startTime, endTime, requiredHeadcount }) => {
  return Shift.create({ name, startTime, endTime, requiredHeadcount });
};

const updateShift = async (id, data) => {
  const shift = await Shift.findById(id);

  if (!shift) {
    const err = new Error('Shift not found');
    err.status = 404;
    throw err;
  }

  shift.name = data.name || shift.name;
  shift.startTime = data.startTime || shift.startTime;
  shift.endTime = data.endTime || shift.endTime;
  shift.requiredHeadcount =
    data.requiredHeadcount || shift.requiredHeadcount;

  return shift.save();
};

const deleteShift = async (id) => {
  const shift = await Shift.findByIdAndDelete(id);

  if (!shift) {
    const err = new Error('Shift not found');
    err.status = 404;
    throw err;
  }

  return shift;
};

module.exports = { getShifts, createShift, updateShift, deleteShift };
