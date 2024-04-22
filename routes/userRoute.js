const express = require('express')
const method = require('../controllers/userController.js')
const restrict = require('../middlewares/authorization.js')

const router = express.Router()


router.route('/').get(restrict('admin'),method.getAllUsers)
router.route('/:id').all(restrict()).get(method.getUser).patch(method.patchUser).delete(method.deleteUser)


module.exports=router



