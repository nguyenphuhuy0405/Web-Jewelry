const mongoose = require('mongoose')
const Schema = mongoose.Schema
const AutoIncrement = require('mongoose-sequence')(mongoose)

const CommentSchema = new Schema(
    {
        _id: {
            type: Number,
        },
        star: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        userId: {
            type: Number,
            ref: 'User',
        },
        content: {
            type: String,
            required: true,
        },
        isDelete: {
            type: Boolean,
            required: true,
            default: false,
        },
    },
    {
        timestamps: true,
        _id: false,
    },
)
//Add plugin
mongoose.set('strictQuery', false)
CommentSchema.plugin(AutoIncrement, { id: 'CommentId' })

module.exports = mongoose.model('Comment', CommentSchema)
