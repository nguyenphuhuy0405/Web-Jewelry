const express = require('express')
const router = express.Router()
const userController = require('../app/controller/UserController')
const { VerifyToken, isAdmin } = require('../app/middlewares/VerifyToken')


router.get('/info', [VerifyToken], userController.info)
router.put('/update', [VerifyToken], userController.update)
router.put('/change-password', [VerifyToken], userController.changePassword)
//Required Role Admin
router.get('/list', [VerifyToken, isAdmin], userController.list)
router.delete('/:id', [VerifyToken, isAdmin], userController.delete)

module.exports = router
