const express = require('express')
const method = require('../controllers/PCController.js')

const router = express.Router()

router.route('/').get(method.getAllPCs).post(method.postPC)
router.route('/:id').get(method.getPC).patch(method.patchPC).delete(method.deletePC)


module.exports=router