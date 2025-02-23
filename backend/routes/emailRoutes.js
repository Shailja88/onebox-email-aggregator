const express = require('express');
const { getEmails, markInterested } = require('../controllers/emailController');

const router = express.Router();

router.get('/', getEmails);
router.post('/mark-interested', markInterested);

module.exports = router;
