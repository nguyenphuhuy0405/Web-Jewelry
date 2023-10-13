const express = require('express')
const router = express.Router()
const brandController = require('../app/controller/BrandController')
const { VerifyToken, isAdmin } = require('../app/middlewares/VerifyToken')

router.put('/:id', [VerifyToken, isAdmin] ,brandController.update)
router.delete('/:id', [VerifyToken, isAdmin] ,brandController.delete)
router.post('/', [VerifyToken, isAdmin] ,brandController.create)
router.get('/', brandController.list)

module.exports = router
