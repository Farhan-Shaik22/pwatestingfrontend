const express = require('express');
const router = express.Router();
const { createTransaction } = require('../controllers/transactionController');

router.post('/createTransaction', createTransaction);

module.exports = router;
