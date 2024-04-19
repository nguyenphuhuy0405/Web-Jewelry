const { required } = require('joi')
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const slug = require('mongoose-slug-generator')
const AutoIncrement = require('mongoose-sequence')(mongoose)

const ProductSchema = new Schema(
    {
        _id: {
            type: Number,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        slug: {
            type: String,
            slug: 'title',
            unique: true,
        },
        description: {
            type: String,
        },
        price: {
            type: Number,
            required: true,
        },
        images: {
            type: Array,
            default: [],
        },
        categoryId: {
            type: Number,
            required: true,
            ref: 'Category',
        },
        brandId: {
            type: Number,
            ref: 'Brand',
        },
        variations: {
            type: [
                {
                    color: String,
                    size: String,
                    material: String,
                    stock: Number,
                },
            ],
            required: true,
        },
        attributes: {
            type: [
                {
                    name: {
                        type: String,
                        required: true,
                    },
                    value: {
                        type: String,
                        required: true,
                    },
                    units: {
                        type: String,
                    },
                },
            ],
            default: [],
        },
        totalRatings: {
            type: Number,
        },
        comments: {
            type: [
                {
                    type: Number,
                    ref: 'Comment',
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

//Middleware
//Count total quantity before Saving
ProductSchema.pre('save', async function (next) {
    // if sizes is modified
    if (this.isModified('sizes')) {
        //Count total quantity
        const totalQuantity = this.sizes.reduce((acc, size) => {
            return acc + size.quantity
        }, 0)
        this.totalQuantity = totalQuantity
    }

    next()
})

//Add plugin
mongoose.set('strictQuery', false)
mongoose.plugin(slug)
ProductSchema.plugin(AutoIncrement, { id: 'productId' })

module.exports = mongoose.model('Product', ProductSchema)
