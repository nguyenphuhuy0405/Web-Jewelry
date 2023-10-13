const express = require('express')
const router = express.Router()
const blogController = require('../app/controller/BlogController')
const { VerifyToken, isAdmin } = require('../app/middlewares/VerifyToken')

router.post('/like/:id', [VerifyToken], blogController.like)
router.post('/unlike/:id', [VerifyToken], blogController.unlike)
router.delete('/:id', blogController.delete)
router.put('/:id', blogController.update)
router.post('/', blogController.create)
router.get('/:slug', blogController.info)
router.get('/', blogController.list)

module.exports = router
