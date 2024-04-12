const express = require('express')
const method = require('../controllers/reportController.js')

const router = express.Router()

router.route('/').get(method.getAllReports).post(method.postReport)
router.route('/:id').get(method.getReport).patch(method.patchReport).delete(method.deleteReport)


module.exports=router