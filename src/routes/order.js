const express = require('express')
const router = express.Router()
const orderController = require('../app/controller/OrderController')
const { VerifyToken, VerifyUserIsAdmin } = require('../app/middlewares/VerifyToken')

router.put('/confirm-order/:id', [VerifyToken, VerifyUserIsAdmin], orderController.confirmOrder)
router.put('/cancel-order/:id', [VerifyToken, VerifyUserIsAdmin], orderController.cancelOrder)
router.post('/order-from-cart', [VerifyToken], orderController.orderFromCart)
router.post('/', [VerifyToken], orderController.order)
router.get('/:id', [VerifyToken], orderController.info)
router.get('/', [VerifyToken, VerifyUserIsAdmin], orderController.list)

module.exports = router
