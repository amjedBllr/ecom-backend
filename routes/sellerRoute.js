const express = require('express')
const method = require('../controllers/sellerController.js')
const restrict = require('../middlewares/authorization.js')


const router = express.Router()

router.route('/')
    .get(restrict('admin'),method.getAllSellers)

router.route('/orders')
    .get(restrict('seller'),method.getSellerOrders)

router.route('/:id/confirm') 
    .patch(restrict('admin'),method.confirmSeller)

router.route('/:id')
    .get(restrict(),method.getSeller)
    .patch(restrict('admin','seller'),method.patchSeller)
    .delete(restrict('admin','seller'),method.deleteSeller)

router.route('/:id/products')
    .get(method.getSellerProducts)

module.exports=router

