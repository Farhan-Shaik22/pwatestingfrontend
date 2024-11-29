const express = require('express');
const router = express.Router();
const { createCoupon } = require('../controllers/couponController');

router.post('/createCoupon', createCoupon);

module.exports = router;
