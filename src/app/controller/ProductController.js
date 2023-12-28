const fs = require('fs')

const Product = require('../models/Product')
const User = require('../models/User')
const Comment = require('../models/Comment')
const convertImage = require('../middlewares/convertImage')

class ProductController {
    // [GET] /api/product/:slug
    async info(req, res, next) {
        //Get product by slug
        const product = await Product.findOne({ slug: req.params.slug }).populate('comments').lean()
        // console.log(product)
        //If product is not exist return error message
        if (!product)
            return res.status(404).json({
                message: 'Product is not exist',
            })

        try {
            return res.status(200).json({
                message: 'Get product info success',
                data: product,
            })
        } catch (error) {
            return res.status(400).json({
                message: 'An error occured! ' + error,
            })
        }
    }

    // [GET] /api/product/
    async list(req, res, next) {
        try {
            //Từ khoá tìm kiếm
            let q = req.query.q
            //Sắp xếp theo
            let sortBy = {}
            //Trang ?
            let page = req.query.page
            //Kích thước của một trang
            let pageSize = req.query.pageSize || 8
            //Bắt đầu từ phân tử bao nhiêu
            let start = 0
            //Số phân tử mỗi trang
            let limit = 0

            //Search(?q)
            if (req.query.hasOwnProperty('q')) {
                q = { slug: { $regex: `${q.toLowerCase()}` } }
            }

            //Sort(?_sort)
            if (req.query.hasOwnProperty('_sort')) {
                sortBy = { [req.query.field]: req.query.type }
            }

            //Pagination(?page)
            if (req.query.hasOwnProperty('page')) {
                page = parseInt(page)
                pageSize = parseInt(pageSize)
                start = (page - 1) * pageSize
                limit = pageSize
            }

            //Get products
            let products = await Product.find(q).sort(sortBy).skip(start).limit(limit).lean()
            let totalProduct = await Product.countDocuments(q).lean()
            let totalPage = Math.ceil(totalProduct / pageSize)

            return res.status(200).json({
                totalPage,
                message: 'Get list of products success',
                data: products,
            })
        } catch (error) {
            return res.status(400).json({
                message: 'An error occured! ' + error,
            })
        }
    }

    // [POST] /api/product/
    async create(req, res, next) {
        const { title, description, price, categoryId, brandId } = req.body
        let images = req.files
        // Get product by title
        const isExistProduct = await Product.findOne({
            title: req.body.title,
        }).lean()

        //If product is exist return error message
        if (isExistProduct)
            return res.status(400).json({
                message: 'Product is exist',
            })
        if (!req.files) {
            return res.status(400).json({
                message: 'Select upload file',
            })
        }
        try {
            for (let i = 0; i < images.length; i++) {
                let image = req.files[i].path
                image = image.split('src\\public')[1]
                console.log(`image${i}:`, image)
                images[i] = image
            }

            //Create product
            const product = await Product.create({
                title,
                description,
                images,
                price,
                categoryId,
                brandId,
            })

            return res.status(200).json({
                message: 'Create product success',
                data: product,
            })
        } catch (error) {
            return res.status(400).json({
                message: 'An error occured! ' + error,
            })
        }
    }

    // [PUT] /api/product/:id
    async update(req, res, next) {
        const { title, description, price, categoryId, brandId } = req.body
        let images = req.files

        //Get product by id
        const product = await Product.findOne({ _id: req.params.id }).lean()

        //If product is not exist return error message
        if (!product)
            return res.status(404).json({
                message: 'Product is not exist',
            })

        try {
            for (let i = 0; i < images.length; i++) {
                let image = req.files[i].path
                image = image.split('src\\public')[1]
                console.log(`image${i}:`, image)
                images[i] = image
            }
            // Update product by id
            await Product.updateOne(
                {
                    _id: req.params.id,
                },
                {
                    title,
                    description,
                    images,
                    price,
                    categoryId,
                    brandId,
                },
            )

            // Find new product by id
            const newProduct = await Product.findOne({
                _id: req.params.id,
            }).lean()

            return res.status(200).json({
                message: 'Update product success',
                oldData: product,
                data: newProduct,
            })
        } catch (error) {
            return res.status(400).json({
                message: 'An error occured! ' + error,
            })
        }
    }

    // [DELETE] /api/product/:id
    async delete(req, res, next) {
        // Get product by id
        const product = await Product.findOne({ _id: req.params.id }).lean()

        //If product is not exist return error message
        if (!product)
            return res.status(404).json({
                message: 'Product is not exist',
            })

        try {
            // Delete product by id
            await Product.deleteOne({ _id: req.params.id })

            return res.status(200).json({
                message: 'Delete product success',
            })
        } catch (error) {
            return res.status(400).json({
                message: 'An error occured! ' + error,
            })
        }
    }

    //[POST] /api/product/comment/:id
    async comment(req, res, next) {
        try {
            const { star, content } = req.body
            //Get user by id
            const user = await User.findOne({ _id: req.user._id }).lean()

            // Create comment
            const comment = await Comment.create({
                star,
                content,
                user: user._id,
            })

            // Push comment id in product
            await Product.updateOne(
                { _id: req.params.id },
                {
                    $push: { comments: comment._id },
                },
            )

            // Get new product by id
            const product = await Product.findOne({
                _id: req.params.id,
            }).lean()

            return res.status(200).json({
                message: 'Comment product success',
                data: product,
            })
        } catch (error) {
            return res.status(400).json({
                message: 'An error occured! ' + error,
            })
        }
    }

    // [PUT] /api/product/comment/:idComment
    async updateComment(req, res, next) {
        const { star, content } = req.body
        //Get comment by idComment
        const comment = await Comment.findOne({
            _id: req.params.idComment,
        })

        //If comment is not exist return error message
        if (!comment)
            return res.status(404).json({
                message: 'Comment is not exist',
            })

        try {
            //Update comment by idComment
            await Comment.updateOne(
                { _id: req.params.idComment },
                {
                    star,
                    content,
                },
            )

            //Get new comment by idComment
            const newComment = await Comment.findOne({
                _id: req.params.idComment,
            }).lean()

            return res.status(200).json({
                message: 'Update comment success',
                oldData: comment,
                data: newComment,
            })
        } catch (error) {
            return res.status(400).json({
                message: 'An error occured! ' + error,
            })
        }
    }

    // [DELETE] /api/product/comment/:idComment
    async deleteComment(req, res, next) {
        // Get comment by idComment
        const comment = await Comment.findOne({ _id: req.params.idComment })

        //If comment is not exist return error message
        if (!comment)
            return res.status(404).json({
                message: 'Comment is not exist',
            })

        try {
            // Delete comment by idComment
            await Comment.deleteOne({ _id: req.params.idComment }).lean()

            return res.status(200).json({
                message: 'Delete comment success',
            })
        } catch (error) {
            return res.status(400).json({
                message: 'An error occured! ' + error,
            })
        }
    }
}

module.exports = new ProductController()
