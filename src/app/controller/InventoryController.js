const Inventory = require('../models/Inventory')
const Product = require('../models/Product')

class InventoryController {
    //[GET] /api/inventory/:id
    async info(req, res) {
        try {
            //Get inventory by product id
            const inventory = await Inventory.findOne({ productId: req.params.id })
            if (!inventory) {
                return res.status(400).json({
                    message: 'Inventory of product is not exist',
                })
            }

            return res.status(200).json({
                message: 'Get inventory success',
                data: inventory,
            })
        } catch (error) {
            return res.status(400).json({
                message: 'An error occured! ' + error,
            })
        }
    }

    //[GET] /api/inventory/
    async list(req, res) {
        try {
            //Get inventory by id
            const inventories = await Inventory.find({}).populate('productId')

            return res.status(200).json({
                message: 'Get list of inventories success',
                data: inventories,
            })
        } catch (error) {
            return res.status(400).json({
                message: 'An error occured! ' + error,
            })
        }
    }

    //[POST] /api/inventory/
    async create(req, res) {
        try {
            const { productId, quantity } = req.body
            //Check if product is exist
            const product = await Product.findOne({ _id: productId })
            if (!product)
                return res.status(400).json({
                    message: 'Product is not exist',
                })

            //Check if inventory is exist
            const inventory = await Inventory.findOne({ productId: productId })
            if (inventory)
                return res.status(400).json({
                    message: 'Inventory of product is exist',
                })

            //Create inventory
            const newInventory = await Inventory.create({
                productId,
                quantity,
            })

            return res.status(200).json({
                message: 'Create inventory success',
                data: newInventory,
            })
        } catch (error) {
            return res.status(400).json({
                message: 'An error occured! ' + error,
            })
        }
    }

    //[PUT] /api/inventory/:id
    async update(req, res) {
        try {
            const id = req.params.id
            const { quantity } = req.body

            await Inventory.updateOne(
                {
                    _id: id,
                },
                {
                    quantity: quantity,
                },
            )

            const inventory = await Inventory.findOne({ _id: id })
            return res.status(200).json({
                message: 'Update inventory success',
                data: inventory,
            })
        } catch (error) {
            return res.status(400).json({
                message: 'An error occured! ' + error,
            })
        }
    }

    //[DELETE] /api/inventory/:id
    async delete(req, res) {
        try {
            //Delete user by id
            await Inventory.deleteOne({ _id: req.params.id })

            return res.status(200).json({
                message: 'Delete inventory success',
            })
        } catch (error) {
            return res.status(400).json({
                message: 'An error occured! ' + error,
            })
        }
    }
}

module.exports = new InventoryController()
