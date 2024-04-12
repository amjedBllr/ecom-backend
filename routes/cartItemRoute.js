const express = require('express')
const method = require('../controllers/cartItemController.js')

const router = express.Router()

router.route('/').get(method.getCartItems).post(method.postCartItem)
router.route('/:id').get(method.getCartItem).patch(method.patchCartItem).delete(method.deleteCartItem)


module.exports=router