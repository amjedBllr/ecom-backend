const express = require('express')
const method = require('../controllers/productController.js')

const router = express.Router()

router.route('/').get(method.getAllProducts).post(method.postProduct)
router.route('/:id').get(method.getProduct).patch(method.patchProduct).delete(method.deleteProduct)


module.exports=router