const express = require('express')
const router = express.Router()
const userController = require('../app/controller/UserController')
const { VerifyToken, VerifyUserIsAdmin } = require('../app/middlewares/VerifyToken')

router.get('/info', [VerifyToken], userController.info)
router.put('/change-password', [VerifyToken], userController.changePassword)
router.put('/', [VerifyToken], userController.update)

//Required Role Admin
router.put('/:id', [VerifyToken, VerifyUserIsAdmin], userController.updateInfo)
router.delete('/:id', [VerifyToken, VerifyUserIsAdmin], userController.delete)
router.get('/', [VerifyToken, VerifyUserIsAdmin], userController.list)

module.exports = router
