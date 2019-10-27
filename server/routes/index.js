'use strict';

const express = require('express');
const router = express.Router();

router.use('/auth', require('../controllers/auth/authController').router);
router.use('/feed', require('../controllers/feed/feedController').router);

module.exports = router;