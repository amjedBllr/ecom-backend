const express = require('express');
const method = require('../controllers/authController');

const router = express.Router();

router.post('/register', method.registerUser);
router.post('/login', method.loginUser);
router.get('/logout', method.logoutUser);

module.exports = router;
