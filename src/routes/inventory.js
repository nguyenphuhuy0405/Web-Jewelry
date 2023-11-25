const express = require('express')
const router = express.Router()
const inventoryController = require('../app/controller/InventoryController')
const { VerifyToken, VerifyUserIsAdmin } = require('../app/middlewares/VerifyToken')

router.put('/:id', [ VerifyToken, VerifyUserIsAdmin ],inventoryController.increase)
router.post('/', [ VerifyToken, VerifyUserIsAdmin ], inventoryController.create)
router.get('/:id', [ VerifyToken, VerifyUserIsAdmin ], inventoryController.info)
router.get('/', [ VerifyToken, VerifyUserIsAdmin ], inventoryController.list)

module.exports = router
