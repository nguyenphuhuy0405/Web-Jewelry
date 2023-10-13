const mongoose = require('mongoose')
const Schema = mongoose.Schema
const AutoIncrement = require('mongoose-sequence')(mongoose)

const CategorySchema = new Schema(
    {
        _id: {
            type: Number
        },
        title: {
            type: String,
            required: true,
            trim: true,
            unique: true
        }
    },
    {
        timestamps: true,
        _id: false
    }
)
//Add plugin
mongoose.set('strictQuery', false)
CategorySchema.plugin(AutoIncrement, { id: 'categoryId' })

module.exports = mongoose.model('Category', CategorySchema)
