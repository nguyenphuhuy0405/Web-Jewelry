const siteRoute = require('./site')
const authRoute = require('./auth')
const userRoute = require('./user')
const productRoute = require('./product')
const categoryRoute = require('./category')
const brandRoute = require('./brand')
const blogRoute = require('./blog')
const inventoryRoute = require('./inventory')
const cartRoute = require('./cart')
const orderRoute = require('./order')

function route(app) {
    app.use('/api/order', orderRoute)
    app.use('/api/cart', cartRoute)
    app.use('/api/inventory', inventoryRoute)
    app.use('/api/blog', blogRoute)
    app.use('/api/brand', brandRoute)
    app.use('/api/category', categoryRoute)
    app.use('/api/product', productRoute)
    app.use('/api/auth', authRoute)
    app.use('/api/user', userRoute)
    app.use('/', siteRoute)
}

module.exports = route
