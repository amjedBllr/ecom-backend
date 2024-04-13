const express = require('express')
const method = require('../controllers/userController.js')

const router = express.Router()


router.route('/').get(method.getAllUsers)
router.route('/:id').get(method.getUser).patch(method.patchUser).delete(method.deleteUser)


module.exports=router