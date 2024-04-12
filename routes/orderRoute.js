const express = require('express')
const method = require('../controllers/orderController.js')

const router = express.Router()

router.route('/').get(method.getAllOrders).post(method.postOrder)
router.route('/:id').get(method.getOrder).patch(method.patchOrder).delete(method.deleteOrder)


module.exports=router