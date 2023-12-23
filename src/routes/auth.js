const express = require('express')
const router = express.Router()
const authController = require('../app/controller/AuthController')

router.post('/password-reset', authController.passwordResetLink)
router.post('/password-reset/:token', authController.passwordReset)
router.post('/register', authController.register)
router.post('/login', authController.login)
router.get('/logout', authController.logout)
router.get('/refresh', authController.refreshToken)

module.exports = router
