const express = require('express')
const router = express.Router()
const cartController = require('../app/controller/CartController')
const { VerifyToken, VerifyUserIsAdmin } = require('../app/middlewares/VerifyToken')

router.get('/', [VerifyToken], cartController.getCart)
router.get('/get-total-quantity', [VerifyToken], cartController.getTotalQuantity)
router.get('/get-total-price', [VerifyToken], cartController.getTotalPrice)
router.put('/', [VerifyToken], cartController.updateCart)
router.delete('/', [VerifyToken], cartController.clearCart)
router.delete('/:productId', [VerifyToken], cartController.removeToCart)
router.post('/:productId', [VerifyToken], cartController.addToCart)

module.exports = router
