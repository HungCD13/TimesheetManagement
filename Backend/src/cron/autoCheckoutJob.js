const cron = require('node-cron');
const AttendanceService = require('../services/attendanceService');

// Chạy mỗi 5 phút
cron.schedule('*/5 * * * *', async () => {
  console.log('Running auto checkout job...');

  try {
    const result = await AttendanceService.autoCheckoutExpired();
    console.log(`Auto checkout: ${result.length} records`);
  } catch (err) {
    console.error('Auto checkout error:', err.message);
  }
});
