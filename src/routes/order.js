const express = require('express')
const router = express.Router()
const orderController = require('../app/controller/OrderController')
const { VerifyToken, VerifyUserIsAdmin } = require('../app/middlewares/VerifyToken')

router.put('/confirm-order/:id', [VerifyToken, VerifyUserIsAdmin], orderController.confirmOrder)
router.put('/cancel-order/:id', [VerifyToken], orderController.cancelOrder)
router.put('/finish-order/:id', [VerifyToken], orderController.finishOrder)
router.post('/order-from-cart', [VerifyToken], orderController.orderFromCart)
router.post('/', [VerifyToken], orderController.order)
router.get('/analyze', [VerifyToken, VerifyUserIsAdmin], orderController.analyze)
router.get('/my-order', [VerifyToken], orderController.myOrders)
router.get('/:id', [VerifyToken], orderController.info)
router.get('/', [VerifyToken, VerifyUserIsAdmin], orderController.list)

module.exports = router
