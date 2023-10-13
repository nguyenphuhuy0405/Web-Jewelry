const express = require('express')
const router = express.Router()
const orderController = require('../app/controller/OrderController')
const { VerifyToken, isAdmin } = require('../app/middlewares/VerifyToken')

router.put('/confirm-order/:id', [ VerifyToken, isAdmin ], orderController.confirmOrder)
router.put('/candle-order/:id', [ VerifyToken, isAdmin ], orderController.candleOrder)
router.post('/order-from-cart', [ VerifyToken ], orderController.orderFromCart)
router.post('/', [ VerifyToken ], orderController.order)
router.get('/', [ VerifyToken, isAdmin ], orderController.list)


module.exports = router
