const mongoose = require('mongoose')
require('dotenv').config()

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, { useUnifiedTopology: true, useNewUrlParser: true })
        console.log('Connected to MongoDB')
    } catch (error) {
        console.log('Connected failed')
    }
}

module.exports = connectDB
