const mongoose = require('mongoose')
const Schema = mongoose.Schema
const AutoIncrement = require('mongoose-sequence')(mongoose)

const BrandSchema = new Schema(
    {
        _id: {
            type: Number
        },
        brandCode: {
            type: String,
            required: true,
            unique: true
        },
        brandName: {
            type: String
        },
        description: {
            type: String
        }
    },
    {
        timestamps: true,
        _id: false
    }
)
//Add plugin
mongoose.set('strictQuery', false)
BrandSchema.plugin(AutoIncrement, { id: 'brandId' })

module.exports = mongoose.model('Brand', BrandSchema)
