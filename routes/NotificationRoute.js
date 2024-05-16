const express = require('express')
const method = require('../controllers/notificationController.js')
const restrict = require('../middlewares/authorization.js')

const router = express.Router()

router.route('/').get(restrict('seller','client'),method.getManyNotifications)
router.route('/:id').get(restrict('seller','client'),method.getNotification).delete(restrict('seller','client'),method.deleteNotification)


module.exports=router