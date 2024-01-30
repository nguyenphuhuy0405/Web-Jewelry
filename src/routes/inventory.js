const express = require('express')
const router = express.Router()
const inventoryController = require('../app/controller/InventoryController')
const { VerifyToken, VerifyUserIsAdmin } = require('../app/middlewares/VerifyToken')

router.delete('/:id', [VerifyToken, VerifyUserIsAdmin], inventoryController.delete)
router.put('/:id', [VerifyToken, VerifyUserIsAdmin], inventoryController.update)
router.post('/', [VerifyToken, VerifyUserIsAdmin], inventoryController.create)
router.get('/:id', inventoryController.info)
router.get('/', [VerifyToken, VerifyUserIsAdmin], inventoryController.list)

module.exports = router
