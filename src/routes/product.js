const express = require('express')
const router = express.Router()

const productController = require('../app/controller/ProductController')
const { VerifyToken, VerifyUserIsAdmin } = require('../app/middlewares/VerifyToken')
const { upload } = require('../app/middlewares/HandleUpdateFile')

router.put('/updateImage/:id', productController.updateImage)
router.post('/comment/:id', [VerifyToken], productController.comment)
router.put('/comment/:idComment', [VerifyToken], productController.updateComment)
router.delete('/comment/:idComment', [VerifyToken], productController.deleteComment)
router.put('/:id', [VerifyToken, VerifyUserIsAdmin], productController.update)
router.delete('/:id', [VerifyToken, VerifyUserIsAdmin], productController.delete)
router.post('/', [VerifyToken, VerifyUserIsAdmin], upload.single('images'), productController.create)
router.get('/search', productController.search)
router.get('/:slug', productController.info)
router.get('/', [VerifyToken, VerifyUserIsAdmin], productController.list)

module.exports = router
