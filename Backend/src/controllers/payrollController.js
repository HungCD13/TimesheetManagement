const PayrollService = require('../services/payrollService');

const getPayrollReport = async (req, res) => {
  try {
    const report = await PayrollService.getPayrollReport(req.query.month);
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateHourlyRate = async (req, res) => {
  try {
    const user = await PayrollService.updateHourlyRate(
      req.params.userId,
      req.body.hourlyRate
    );
    res.json({ message: 'Cập nhật lương thành công', user });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

module.exports = { getPayrollReport, updateHourlyRate };
