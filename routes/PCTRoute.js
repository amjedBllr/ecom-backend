const express = require('express')
const method = require('../controllers/PCTController.js')
const restrict = require('../middlewares/authorization.js') 

const router = express.Router()

router.route('/')
    .get(method.getAllPCTs)
    .post(restrict('admin'),method.postPCT)

router.route('/:type')
    .get(method.getPCT)
    .patch(restrict('admin'),method.patchPCT)
    .delete(restrict('admin'),method.deletePCT)


module.exports=router