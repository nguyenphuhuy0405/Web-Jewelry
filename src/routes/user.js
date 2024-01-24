const express = require('express')
const router = express.Router()
const userController = require('../app/controller/UserController')
const { VerifyToken, VerifyUserIsAdmin } = require('../app/middlewares/VerifyToken')

router.get('/info', [VerifyToken], userController.info)
router.put('/update', [VerifyToken], userController.update)
router.put('/change-password', [VerifyToken], userController.changePassword)
router.put('/update/:id', [VerifyToken], userController.updateInfo)
//Required Role Admin
router.get('/list', [VerifyToken, VerifyUserIsAdmin], userController.list)
router.delete('/:id', [VerifyToken, VerifyUserIsAdmin], userController.delete)

module.exports = router
