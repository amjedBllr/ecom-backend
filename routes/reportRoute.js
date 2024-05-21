const express = require('express')
const method = require('../controllers/reportController.js')
const restrict = require('../middlewares/authorization.js')

const router = express.Router()

router.route('/').all(restrict()).get(method.getAllReports).post(method.postOneReport)
router.route('/:id').all(restrict()).get(method.getOneReport).delete(method.OneReport)


module.exports=router