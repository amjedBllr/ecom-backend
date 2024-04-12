const express = require('express')
const method = require('../controllers/clientController.js')

const router = express.Router()

router.route('/').get(method.getAllClients).post(method.postClient)
router.route('/:id').get(method.getClient).patch(method.patchClient).delete(method.deleteClient)


module.exports=router