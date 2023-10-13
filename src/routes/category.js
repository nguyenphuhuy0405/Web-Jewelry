const express = require('express')
const router = express.Router()
const categoryController = require('../app/controller/CategoryController')
const { VerifyToken, isAdmin } = require('../app/middlewares/VerifyToken')

router.put('/:id', [VerifyToken, isAdmin] ,categoryController.update)
router.delete('/:id', [VerifyToken, isAdmin] ,categoryController.delete)
router.post('/', [VerifyToken, isAdmin] ,categoryController.create)
router.get('/', categoryController.list)

module.exports = router
