const express = require('express');
const method = require('../controllers/authController');
const restrict = require('../middlewares/authorization.js')

const router = express.Router();

router.post('/register/user', method.registerUser);
router.post('/register/client', restrict('client') ,method.registerClient);
router.post('/register/seller', restrict('seller') , method.registerSeller);

router.post('/login', method.loginUser);
router.get('/logout', method.logoutUser);

module.exports = router;
