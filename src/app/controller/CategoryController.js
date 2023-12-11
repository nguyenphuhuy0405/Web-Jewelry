const Category = require('../models/Category')
class CategoryController {
    //[GET] /api/category/
    async list(req, res) {
        try {
            //Get categories
            let categories = await Category.find({}).lean()

            return res.status(200).json({
                message: 'Get category list success',
                data: categories,
            })
        } catch (error) {
            return res.status(400).json({
                message: 'An error occured! ' + error,
            })
        }
    }

    // [POST] /api/category/
    async create(req, res) {
        const { title } = req.body
        //Get category by title
        const isExistCategory = await Category.findOne({
            title: req.body.title,
        }).lean()

        //If category is exist return error message
        if (isExistCategory)
            return res.status(400).json({
                message: 'Category is exist',
            })

        try {
            //Create category
            const category = await Category.create({
                title,
            })

            return res.status(200).json({
                message: 'Create category success',
                data: category,
            })
        } catch (error) {
            return res.status(400).json({
                message: 'An error occured! ' + error,
            })
        }
    }

    //[PUT] /api/category/:id
    async update(req, res) {
        const { title } = req.body
        //Get category by id
        const category = await Category.findOne({ _id: req.params.id }).lean()

        //If category is not exist return error message
        if (!category)
            return res.status(404).json({
                message: 'Category is not exist',
            })

        try {
            //Update category by id
            await Category.updateOne(
                {
                    _id: req.params.id,
                },
                {
                    title,
                },
            )

            //Get new category by id
            const newCategory = await Category.findOne({
                _id: req.params.id,
            }).lean()

            return res.status(200).json({
                message: 'Update category success',
                oldData: category,
                data: newCategory,
            })
        } catch (error) {
            return res.status(400).json({
                message: 'An error occured! ' + error,
            })
        }
    }

    //[DELETE] /api/category/:id
    async delete(req, res) {
        //Get category by id
        const category = await Category.findOne({ _id: req.params.id }).lean()

        //If category is not exist return error message
        if (!category)
            return res.status(404).json({
                message: 'Category is not exist',
            })

        try {
            //Delete category by id
            await Category.deleteOne({ _id: req.params.id })

            return res.status(200).json({
                message: 'Delete category success',
            })
        } catch (error) {
            return res.status(400).json({
                message: 'An error occured! ' + error,
            })
        }
    }
}

module.exports = new CategoryController()
