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

/*
*client: getOne (return stuffs brk ... filter al return)
*seller: getOne (return kolch 3lih (lazm hwa b3d , aw ma3ndouch access llo5rin anyway) mn seller table brk)  , patch (kolsh (lazm ykon howa b3d)) , delete (kolsh hwa b3d)
*admin: getALL (return kolch) , getOne(kolch) , patch (anything , anyone) , delete (anything , anyone)
*/

//! return mn seller brk mb3d nchofo kifah ... mb3d blk ndiro fetch wahd khlaf mn 3nd l admin ... hih hkak !!