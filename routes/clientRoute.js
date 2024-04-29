const express = require('express')
const method = require('../controllers/clientController.js')
const restrict = require('../middlewares/authorization.js')

const router = express.Router()

router.route('/')
    .get(restrict('admin'),method.getAllClients)

router.route('/orders')
    .get(restrict('client'),method.getClientOrders)

router.route('/cart-items')
    .get(restrict('client'),method.getClientItems)

router.route('/:id')
    .get(restrict(),method.getClient)
    .patch(restrict('admin','client'),method.patchClient)
    .delete(restrict('admin','client'),method.deleteClient)



module.exports=router
