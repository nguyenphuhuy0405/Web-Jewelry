const express = require('express')
const router = express.Router()
const cartController = require('../app/controller/CartController')
const { VerifyToken, VerifyUserIsAdmin } = require('../app/middlewares/VerifyToken')

router.get('/', [VerifyToken], cartController.getCart)
router.put('/', [VerifyToken], cartController.updateCart)
router.delete('/clear', [VerifyToken], cartController.clearCart)
router.delete('/:id', [VerifyToken], cartController.removeToCart)
router.post('/', [VerifyToken], cartController.addToCart)

module.exports = router
