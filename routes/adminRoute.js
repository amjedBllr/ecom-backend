const express = require('express')
const method = require('../controllers/adminController.js')

const router = express.Router()


//! the admin route has no actual use ... , for the moment let's don't mess with it

router.route('/').get(method.getAllAdmins).post(method.postAdmin)
router.route('/:id').get(method.getAdmin).patch(method.patchAdmin).delete(method.deleteAdmin)


module.exports=router