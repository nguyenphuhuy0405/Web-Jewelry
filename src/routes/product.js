const express = require('express')
const router = express.Router()

const productController = require('../app/controller/ProductController')
const { VerifyToken, VerifyUserIsAdmin } = require('../app/middlewares/VerifyToken')
const { upload } = require('../app/middlewares/HandleUpdateFile')

router.post('/comment', [VerifyToken], productController.comment)
router.put('/comment', [VerifyToken], productController.updateComment)
router.delete('/comment', [VerifyToken], productController.deleteComment)

router.put('/:id', [VerifyToken, VerifyUserIsAdmin], upload.array('images', 10), productController.update)
router.delete('/:id', [VerifyToken, VerifyUserIsAdmin], productController.delete)
router.post('/import', [VerifyToken, VerifyUserIsAdmin], upload.single('file'), productController.import)
router.post('/', [VerifyToken, VerifyUserIsAdmin], upload.array('images', 10), productController.create)
router.get('/:slug', productController.info)
router.get('/', productController.list)

module.exports = router
