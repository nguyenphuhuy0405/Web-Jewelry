const express = require('express')
const router = express.Router()
const inventoryController = require('../app/controller/InventoryController')
const { VerifyToken, isAdmin } = require('../app/middlewares/VerifyToken')

router.put('/:id', [ VerifyToken, isAdmin ],inventoryController.increase)
router.post('/', [ VerifyToken, isAdmin ], inventoryController.create)
router.get('/:id', [ VerifyToken, isAdmin ], inventoryController.info)
router.get('/', [ VerifyToken, isAdmin ], inventoryController.list)

module.exports = router
