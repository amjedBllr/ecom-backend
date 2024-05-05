const express = require('express')
const method = require('../controllers/NotificationController.js')
const restrict = require('../middlewares/authorization.js')

const router = express.Router()

router.route('/').post(restrict(),method.postNotification).get(restrict('seller','client'),method.getManyNotifications)
router.route('/:id').get(restrict('seller','client'),method.getNotification).delete(restrict('seller','client'),method.deleteNotification)

/*
!post : restrict() 
!get : restrict('seller','client') , w ida howa ba3d
!getMany : restrict('seller','client') , w ida howa ba3d 
!delete : restrict('seller','client')
 */

module.exports=router