const express = require('express')
const method = require('../controllers/sellerController.js')
const restrict = require('../middlewares/authorization.js')

const router = express.Router()

router.route('/')
    .get(restrict('admin'),method.getAllSellers)

router.route('/:id')
    .get(restrict(),method.getSeller)
    .patch(restrict('admin','seller'),method.patchSeller)
    .delete(restrict('admin','seller'),method.deleteSeller)


module.exports=router




//! balak nzido :id/products route ... 9al /sellers/12341234/products w tkon  restrict()
//! blak tani lladmin ki yhab ydelete user nzido nb3to mltm b3d request bl axios bach nahiw luser mn l sellers tani , mm for client