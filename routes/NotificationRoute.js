const express = require('express')
const method = require('../controllers/NotificationController.js')

const router = express.Router()

router.route('/').post(method.postNotification)
router.route('/:id').get(method.getNotification).patch(method.patchNotification).delete(method.deleteNotification)


module.exports=router