const mongoose = require('mongoose')
const Schema = mongoose.Schema
const AutoIncrement = require('mongoose-sequence')(mongoose)

const CommentSchema = new Schema(
    {
        _id: {
            type: Number
        },
        star: {
            type: Number,
            required: true
        },
        userId: {
            type: Number,
            ref: 'User'
        },
        content: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true,
        _id: false
    }
)
//Add plugin
mongoose.set('strictQuery', false)
CommentSchema.plugin(AutoIncrement, { id: 'CommentId' })

module.exports = mongoose.model('Comment', CommentSchema)
