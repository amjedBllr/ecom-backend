const express = require('express')
const method = require('../controllers/adminController.js')

const router = express.Router()

router.route('/').get(method.getAllAdmins).post(method.postAdmin)
router.route('/:id').get(method.getAdmin).patch(method.patchAdmin).delete(method.deleteAdmin)


module.exports=router