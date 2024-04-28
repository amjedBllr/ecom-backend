const express = require('express')
const method = require('../controllers/productController.js')

const router = express.Router()

router.route('/').get(method.getAllProducts).post(method.postProduct)
router.route('/:id').get(method.getProduct).patch(method.patchProduct).delete(method.deleteProduct)


module.exports=router


/*
!GetAll : (no restrict... mm no authentication) , bsah takhdm bl queris , therefore we gon have to specifiy the possible queries , mm f design
                                                    ?hadi hya lkhdma mllkhr
!GetOne : (no restrict) , bsah mad every information possible 3la lproduct w relations ta3u (seller_id , seller_name.....)
!delete : (restrict(seller,admin)) , admin 3adi , seller ghir ida seller-id = userid 
!patch , post : (restrict(seller))+ seller_id = userid

?? ha abda trigl , ki nkhlsoh nzido wahd wla zoug w njarbo jtfarjo vedio ta3 30min fl files system hadak ... gg
 */