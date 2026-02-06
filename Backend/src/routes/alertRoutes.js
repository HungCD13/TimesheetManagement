const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alertController');

router.get('/late', alertController.getLateAlerts);

module.exports = router;

