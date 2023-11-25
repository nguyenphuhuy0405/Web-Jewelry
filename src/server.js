const express = require('express')
const app = express()
const port = process.env.PORT || 3000

const path = require('path')
const morgan = require('morgan')
const connectDB = require('./config/db/connectDB')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
require('dotenv').config()
const multer = require('multer')

const route = require('./routes/route')

//Static file
app.use(express.static(path.join(__dirname, '/public')))

//Cookie-parser
app.use(cookieParser())

// HTTP logger
// app.use(morgan('combined'))

// For parsing application/json
// app.use(express.json())
// Parse application/json
app.use(bodyParser.json())

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

//Connect to db
connectDB()

// Route init
route(app)

app.listen(port || 3000, () => {
    console.log(`Example app listening on port ${port}`)
})
