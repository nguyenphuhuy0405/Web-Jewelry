const express = require('express')
const router = express.Router()
const productController = require('../app/controller/ProductController')
const { VerifyToken, isAdmin } = require('../app/middlewares/VerifyToken')

router.put('/updateImage/:id', productController.updateImage)
router.post('/comment/:id', [VerifyToken], productController.comment)
router.put(
    '/comment/:idComment',
    [VerifyToken],
    productController.updateComment
)
router.delete(
    '/comment/:idComment',
    [VerifyToken],
    productController.deleteComment
)
router.put('/:id', [VerifyToken, isAdmin] ,productController.update)
router.delete('/:id', [VerifyToken, isAdmin] ,productController.delete)
router.post('/', [VerifyToken, isAdmin] ,productController.create)
router.get('/:slug', productController.info)
router.get('/', [VerifyToken, isAdmin],productController.list)


module.exports = router
