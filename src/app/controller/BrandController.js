const Brand = require('../models/Brand')
class BrandController {
    //[GET] /api/brand/
    async list(req, res, next) {
        try {
            //Get brands
            let brands = await Brand.find({}).lean()

            //If query has _sort
            if (req.query.hasOwnProperty('_sort')) {
                brands = await Brand.find({})
                    .lean()
                    .sort({
                        [req.query.field]: req.query.type
                    }) //sort by field: asc or desc
            }

            return res.status(200).json({
                isSuccess: true,
                message: 'Get list of brands success',
                data: brands
            })
        } catch (err) {
            return res.status(400).json({
                isSuccess: false,
                message: err
            })
        }
    }

    //[POST] /api/brand/
    async create(req, res, next) {
        //Get brand by brandCode
        const isExistBrand = await Brand.findOne({
            brandCode: req.body.brandCode
        }).lean()

        //If brand is exist return error message
        if (isExistBrand) {
            return res.status(400).json({
                isSuccess: false,
                message: 'Brand Code is exist'
            })
        }

        try {
            //Create brand
            const brand = new Brand({
                brandCode: req.body.brandCode,
                brandName: req.body.brandName,
                description: req.body.description
            })
            //Save brand in db
            let newBrand = await brand.save()

            return res.status(200).json({
                isSuccess: true,
                message: 'Create brand success',
                data: newBrand
            })
        } catch (err) {
            return res.status(400).json({
                isSuccess: false,
                message: err
            })
        }
    }

    //[PUT] /api/brand/:id
    async update(req, res, next) {
        try {
            //Get brand by id
            const brand = await Brand.findOne({ _id: req.params.id }).lean()

            //If brand is not exist return error message
            if (!brand) {
                return res.status(404).json({
                    isSuccess: false,
                    message: 'Brand is not exist'
                })
            }

            //Update brand
            await Brand.updateOne(
                {
                    _id: req.params.id
                },
                {
                    brandCode: req.body.brandCode,
                    brandName: req.body.brandName,
                    description: req.body.description
                }
            )

            //Find new brand
            const newBrand = await Brand.findOne({ _id: req.params.id }).lean()

            return res.status(200).json({
                isSuccess: true,
                message: 'Update brand success',
                oldData: brand,
                data: newBrand
            })
        } catch (error) {
            return res.status(400).json({
                isSuccess: false,
                message: 'An error occured! ' + error
            })
        }
    }

    //[DELETE] /api/brand/:id
    async delete(req, res, next) {
        //Get brand by id
        const brand = await Brand.findOne({ _id: req.params.id }).lean()

        //If brand is not exist return error message
        if (!brand) {
            return res.status(404).json({
                isSuccess: false,
                message: 'Brand is not exist'
            })
        }

        try {
            //Delete brand by id
            await Brand.deleteOne({ _id: req.params.id })

            return res.status(200).json({
                isSuccess: true,
                message: 'Delete brand success',
            })
        } catch (error) {
            return res.status(400).json({
                isSuccess: false,
                message: 'An error occured! ' + error
            })
        }
    }
}

module.exports = new BrandController()
