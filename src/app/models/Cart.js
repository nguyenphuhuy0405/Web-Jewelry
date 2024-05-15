const mongoose = require('mongoose')
const Schema = mongoose.Schema
const AutoIncrement = require('mongoose-sequence')(mongoose)

const CartSchema = new Schema(
    {
        // _id: {
        //     type: Number
        // },
        userId: {
            type: Number,
            ref: 'User',
            required: true,
        },
        active: {
            type: Boolean,
            default: true,
        },
        modifiedOn: {
            type: Date,
            default: Date.now,
        },
        products: {
            type: [
                {
                    productId: {
                        type: Number,
                        ref: 'Product',
                        required: true,
                    },
                    quantity: {
                        type: Number,
                        required: true,
                        default: 1,
                    },
                },
            ],
        },
        // totalQuantity: {
        //     type: Number,
        //     default: 0,
        // },
        // totalPrice: {
        //     type: Number,
        //     default: 0,
        // },
    },
    {
        timestamps: true,
        // _id: false
    },
)

//Add plugin
// mongoose.set('strictQuery', false)
// CartSchema.plugin(AutoIncrement, { id: 'cartId' })

module.exports = mongoose.model('Cart', CartSchema)
