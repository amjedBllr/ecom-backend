const express = require('express')
const method = require('../controllers/cartItemController.js')
const restrict = require('../middlewares/authorization.js')

const router = express.Router()

router.route('/')
    .post(restrict('client'),method.postCartItem)

router.route('/:id')
    .all(restrict('client'))
    .get(method.getCartItem)
    .patch(method.patchCartItem)
    .delete(method.deleteCartItem)


module.exports=router

/*
?hada ladmin may9drch yoslo khlas , ghir client normalment ... ih ghir client , w restrict('client') ba3d
!getItems : ki yf ... nzidoha 3nd l client route !! (clients/:id/cartItems) ... mnah related bih bark (kima product w seller)
!post : post normal khlas , wl id ykon ta3 l'client id ta3 l client hada makan
!get : 3adi khlas tani , just ykon mol request hwa nefs lclient , balak hta mandirohach
!patch : 3adi khlas tani , just ykon mol request hwa nefs lclient (l product id maytbdlch)
!delete : 3adi khlas tani , just ykon mol request hwa nefs lclient

 */