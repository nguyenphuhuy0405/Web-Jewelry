const express = require('express')
const router = express.Router()
const brandController = require('../app/controller/BrandController')
const { VerifyToken, VerifyUserIsAdmin } = require('../app/middlewares/VerifyToken')

router.put('/:id', [VerifyToken, VerifyUserIsAdmin], brandController.update)
router.delete('/:id', [VerifyToken, VerifyUserIsAdmin], brandController.delete)
router.post('/', [VerifyToken, VerifyUserIsAdmin], brandController.create)
router.get('/', brandController.list)

module.exports = router
