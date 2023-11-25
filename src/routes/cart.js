const express = require('express')
const router = express.Router()
const cartController = require('../app/controller/CartController')
const { VerifyToken, VerifyUserIsAdmin } = require('../app/middlewares/VerifyToken')

router.delete('/', [VerifyToken, VerifyUserIsAdmin], cartController.deleteCart)
router.put('/', [VerifyToken], cartController.updateCart)
router.get('/', [VerifyToken], cartController.getCart)
router.post('/', [VerifyToken], cartController.addToCart)

module.exports = router
