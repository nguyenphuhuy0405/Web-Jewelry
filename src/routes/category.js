const express = require('express')
const router = express.Router()
const categoryController = require('../app/controller/CategoryController')
const { VerifyToken, VerifyUserIsAdmin } = require('../app/middlewares/VerifyToken')

router.put('/:id', [VerifyToken, VerifyUserIsAdmin], categoryController.update)
router.delete('/:id', [VerifyToken, VerifyUserIsAdmin], categoryController.delete)
router.post('/', [VerifyToken, VerifyUserIsAdmin], categoryController.create)
router.get('/', categoryController.list)

module.exports = router
