const mongoose = require('mongoose')
const Schema = mongoose.Schema
const AutoIncrement = require('mongoose-sequence')(mongoose)
const slug = require('mongoose-slug-generator')


const BlogSchema = new Schema(
    {
        _id: {
            type: Number
        },
        title: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true
        },
        image: {
            type: String
        },
        author: {
            type: String,
            default: 'admin'
        },
        slug: {
            type: String,
            slug: 'title',
            unique: true
        },
        numberViews: {
            type: Number,
            default: 0
        },
        liked: {
            type: [{
                type: Number,
                ref: 'User'
            }],
            default: []
        }, 
        isLiked: {
            type: Number,
            default: 0
        },
    },
    {
        timestamps: true,
        _id: false
    }
)

//Add plugin
mongoose.set('strictQuery', false)
mongoose.plugin(slug)
BlogSchema.plugin(AutoIncrement, { id: 'blogId' })

module.exports = mongoose.model('Blog', BlogSchema)
