const express = require('express')
const router = express.Router()
const orderController = require('../app/controller/OrderController')
const { VerifyToken, VerifyUserIsAdmin } = require('../app/middlewares/VerifyToken')

router.put('/confirm-order/:id', [VerifyToken, VerifyUserIsAdmin], orderController.confirmOrder)
router.put('/candle-order/:id', [VerifyToken, VerifyUserIsAdmin], orderController.candleOrder)
router.post('/order-from-cart', [VerifyToken], orderController.orderFromCart)
router.post('/', [VerifyToken], orderController.order)
router.get('/', [VerifyToken, VerifyUserIsAdmin], orderController.list)

module.exports = router
