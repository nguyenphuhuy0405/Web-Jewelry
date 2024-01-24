const mongoose = require('mongoose')
const Schema = mongoose.Schema
const AutoIncrement = require('mongoose-sequence')(mongoose)
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
require('dotenv').config()

const UserSchema = new Schema(
    {
        _id: {
            type: Number,
        },
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        phoneNumber: {
            type: String,
            required: true,
            unique: true,
        },
        role: {
            type: String,
            trim: true,
            default: 'user',
        },
        refreshToken: {
            type: String,
        },
        passwordResetToken: {
            type: String,
            default: undefined,
        },
        passwordResetExpires: {
            type: Date,
            default: undefined,
        },
    },
    {
        timestamps: true, // add createdAt and updatedAt
        _id: false,
    },
)

//Add plugin
mongoose.set('strictQuery', false)
UserSchema.plugin(AutoIncrement, { id: 'userId' })

//Middleware
//Encrypting Passwords before Saving
UserSchema.pre('save', async function (next) {
    // If password is modified
    if (this.isModified('password')) {
        //Hash password
        const salt = bcrypt.genSaltSync(10)
        this.password = await bcrypt.hash(this.password, salt)
    }
    next()
})

//Methods
//Compare password in database
UserSchema.methods = {
    comparePassword: async function (password) {
        return await bcrypt.compare(password, this.password)
    },
    createPasswordResetToken: function () {
        const resetToken = crypto.randomBytes(32).toString('hex')
        this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
        this.passwordResetExpires = Date.now() + 15 * 60 * 1000 //15 minutes
        return resetToken
    },
}

module.exports = mongoose.model('User', UserSchema)
