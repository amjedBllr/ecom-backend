const express = require('express')
const method = require('../controllers/PCController.js')
const restrict = require('../middlewares/authorization.js')

const router = express.Router()

router.route('/')
    .get(method.getAllPCs)
    .post(restrict('admin'),method.postPC)

router.route('/:category')
    .get(method.getPC)
    .patch(restrict('admin'),method.patchPC)
    .delete(restrict('admin'),method.deletePC)


module.exports=router
