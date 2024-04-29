const express = require('express')
const method = require('../controllers/productController.js')
const restrict = require('../middlewares/authorization.js')

const router = express.Router()

router.route('/')
            .get(method.getManyProducts) //* ( /?name&categroy&type&discount )
            .post(restrict('seller'),method.postProduct)

router.route('/:id')
            .get(method.getProduct)
            .patch(restrict('seller'),method.patchProduct)
            .delete(restrict('admin','seller'),method.deleteProduct)


module.exports=router
