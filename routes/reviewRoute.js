const express = require('express')
const method = require('../controllers/reviewController.js')

const router = express.Router()

router.route('/').get(method.getAllReviews).post(method.postReview)
router.route('/:id').get(method.getReview).patch(method.patchReview).delete(method.deleteReview)


module.exports=router