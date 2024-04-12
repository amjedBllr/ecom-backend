const express = require('express')
const method = require('../controllers/PCTController.js')

const router = express.Router()

router.route('/').get(method.getAllPCTs).post(method.postPCT)
router.route('/:id').get(method.getPCT).patch(method.patchPCT).delete(method.deletePCT)


module.exports=router