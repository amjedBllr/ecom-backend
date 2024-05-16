const express = require('express');
const method = require('../controllers/authController');
const restrict = require('../middlewares/authorization.js')
const upload = require('../utils/imageFormating.js')

const router = express.Router();

router.post('/register/user',upload.single("pfp"), method.registerUser);
router.post('/register/client', restrict('client') ,method.registerClient);
router.post('/register/seller', restrict('seller') , upload.fields([{ name: 'identityCard' }, { name: 'additionalInformation' }]) , method.registerSeller);
router.get('/userinfo', restrict() ,method.userinfo);

router.post('/verify/:id', method.verifyUser);

router.post('/login', method.loginUser);
router.get('/logout', method.logoutUser);

module.exports = router;
