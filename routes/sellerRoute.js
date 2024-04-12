const express = require('express')
const method = require('../controllers/sellerController.js')

const router = express.Router()

router.route('/').get(method.getAllSellers).post(method.postSeller)
router.route('/:id').get(method.getSeller).patch(method.patchSeller).delete(method.deleteSeller)


module.exports=router