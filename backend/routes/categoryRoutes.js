const express = require('express');
const router = express.Router();
const { getCategoryWiseTransactions } = require('../controllers/categoryController');

router.get('/userTransactions/:userId/categories', getCategoryWiseTransactions);

module.exports = router;
