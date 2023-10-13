const mongoose = require('mongoose')
const Schema = mongoose.Schema
const AutoIncrement = require('mongoose-sequence')(mongoose)

const OrderSchema = new Schema(
    {
        _id: {
            type: Number
        },
        cartId: {
            type: Schema.Types.ObjectId,
            ref: 'Cart'
        },
        userId: {
            type: Number,
            ref: 'User'
        },
        status: {
            type: String,
            enum: ['Đang xử lý', 'Đã giao hàng', 'Đã huỷ'],
            default: 'Đang xử lý'
        },
        shipping: {
            type: String,
            default: 'Giao hàng tận nơi',
        },
        shippingPrice: {
            type: Number,
            default: 30000
        },
        payment: {
            type: String,
            default: 'Thanh toán khi nhận hàng',
            enum: ['Thanh toán khi nhận hàng', 'Thanh toán trước']
        },
        products: {
            type: [{
                productId: {
                    type: Number,
                    ref: 'Product'
                },
                quantity: Number
            }]
        },
        totalPrice: {
            type: Number
        }
    },
    {
        timestamps: true,
        _id: false
    }
)

//Add plugin
mongoose.set('strictQuery', false)
OrderSchema.plugin(AutoIncrement, { id: 'orderId' })

module.exports = mongoose.model('Order', OrderSchema)
