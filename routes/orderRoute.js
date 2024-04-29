const express = require('express')
const method = require('../controllers/orderController.js')
const restrict = require('../middlewares/authorization.js')

const router = express.Router()

router.route('/')
    .post(restrict('client'),method.postOrder)
router.route('/:id')
    .get(restrict(),method.getOrder)
    .patch(restrict('seller'),method.patchOrder)


module.exports=router
