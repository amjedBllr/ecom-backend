const express = require('express')
const method = require('../controllers/reviewController.js')
const restrict = require('../middlewares/authorization.js')

const router = express.Router()

router.route('/').post(restrict('client'),method.postReview)
router.route('/:id').delete(restrict('client'),method.deleteReview)


module.exports=router
