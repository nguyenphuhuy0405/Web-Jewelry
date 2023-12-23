const express = require('express')
const app = express()

const path = require('path')
const morgan = require('morgan')
const connectDB = require('./config/db/connectDB')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
require('dotenv').config()
const cors = require('cors')

const route = require('./routes/route')

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200,
}

//Static file
app.use(express.static(path.join(__dirname, '/public')))

//Cookie-parser
app.use(cookieParser())

//CORS
app.use(cors(corsOptions))

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

app.listen(process.env.PORT || 5000, () => {
    console.log(`Example app listening on port ${process.env.PORT || 5000}`)
})
