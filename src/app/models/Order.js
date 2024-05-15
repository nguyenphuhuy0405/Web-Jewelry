const mongoose = require('mongoose')
const Schema = mongoose.Schema
const AutoIncrement = require('mongoose-sequence')(mongoose)

const OrderSchema = new Schema(
    {
        _id: {
            type: Number,
        },
        cartId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Cart',
        },
        userId: {
            type: Number,
            required: true,
            ref: 'User',
        },
        name: {
            type: String,
        },
        address: {
            type: String,
            required: true,
        },
        phoneNumber: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['Đang xử lý', 'Đã giao hàng', 'Đã huỷ', 'Đã hoàn thành'],
            required: true,
            default: 'Đang xử lý',
        },
        shipping: {
            type: String,
            default: 'Giao hàng tận nơi',
        },
        shippingPrice: {
            type: Number,
            default: 0,
        },
        payment: {
            type: String,
            enum: ['Thanh toán khi nhận hàng', 'Thanh toán trước'],
            default: 'Thanh toán khi nhận hàng',
        },
        products: {
            type: [
                {
                    productId: {
                        type: Number,
                        ref: 'Product',
                    },
                    quantity: Number,
                },
            ],
            required: true,
        },
        totalPrice: {
            type: Number,
            required: true,
        },
        notes: {
            type: String,
            default: '',
        },
    },
    {
        timestamps: true,
        _id: false,
    },
)

//Add plugin
mongoose.set('strictQuery', false)
OrderSchema.plugin(AutoIncrement, { id: 'orderId' })

module.exports = mongoose.model('Order', OrderSchema)
