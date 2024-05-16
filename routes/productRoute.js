const express = require('express')
const method = require('../controllers/productController.js')
const restrict = require('../middlewares/authorization.js')
const upload = require('../utils/imageFormating.js')

const router = express.Router()

router.route('/')
            .get(method.getManyProducts) //* ( /?name&categroy&type&discount )
            .post(restrict('seller'),upload.array('photos', 3),method.postProduct)

router.route('/:id')
            .get(method.getProduct)
            .patch(restrict('seller'),method.patchProduct)
            .delete(restrict('admin','seller'),method.deleteProduct)

router.route('/:id/reviews')
            .get(method.getProductReviews)

module.exports=router
