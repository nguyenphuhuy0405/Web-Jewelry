const Inventory = require('../models/Inventory')

class InventoryController {
    //[GET] /api/inventory/:id
    async info(req, res, next) {
        const id = req.params.id
        try{
            //Get inventory by id
            const inventory = await Inventory.findOne({ _id: id })

            return res.status(200).json({
                isSuccess: true,
                message: 'Get inventory success',
                data: inventory
            })
        }catch(error){
            return res.status(400).json({
                isSuccess: false,
                message: 'An error occured! ' + error
            })
        }
    }

    //[GET] /api/inventory/
    async list(req, res, next) {
        try{
            //Get inventory by id
            const inventories = await Inventory.findOne({})

            return res.status(200).json({
                isSuccess: true,
                message: 'Get list of inventories success',
                data: inventories
            })
        }catch(error){
            return res.status(400).json({
                isSuccess: false,
                message: 'An error occured! ' + error
            })
        }
    }

    //[POST] /api/inventory/
    async create(req, res, next) {
        const { productId, quantity } = req.body
        
        const inventory = await Inventory.findOne({ productId: productId })
        if(inventory) return res.status(400).json({
            isSuccess: false,
            message: 'Inventory of product is exist'
        })

        try{
            //Create inventory
            const newInventory = await Inventory.create({
                productId,
                quantity
            })

            return res.status(200).json({
                isSuccess: true,
                message: 'Create inventory success',
                data: newInventory
            })
        }catch(error){
            return res.status(400).json({
                isSuccess: false,
                message: 'An error occured! ' + error
            })
        }
    }

    //[PUT] /api/inventory/:id
    async increase(req, res, next) {
        const id = req.params.id
        const { quantity } = req.body
        try {
            await Inventory.updateOne({
                _id: id,
            },{
                $inc: {
                    quantity: quantity
                }
            })

            const inventory = await Inventory.findOne({ _id: id })
            return res.status(200).json({
                isSuccess: true,
                message: 'Update inventory success',
                data: inventory
            })
        } catch (error) {
            return res.status(400).json({
                isSuccess: false,
                message: 'An error occured! ' + error
            })
        }
    }


}

module.exports = new InventoryController()
