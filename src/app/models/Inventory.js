const mongoose = require('mongoose')
const Schema = mongoose.Schema
const AutoIncrement = require('mongoose-sequence')(mongoose)

const InventorySchema = new Schema(
    {
        _id: {
            type: Number,
        },
        productId: {
            type: Number,
            ref: 'Product',
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            default: 0,
        },
        orders: {
            type: [
                {
                    orderId: {
                        type: Number,
                        ref: 'Order',
                        required: true,
                    },
                    userId: {
                        type: Number,
                        ref: 'User',
                        required: true,
                    },
                    quantity: Number,
                },
            ],
            default: [],
        },
    },
    {
        timestamps: true,
        _id: false,
    },
)

//Add plugin
mongoose.set('strictQuery', false)
InventorySchema.plugin(AutoIncrement, { id: 'inventoryId' })

module.exports = mongoose.model('Inventory', InventorySchema)
