const Cart = require('../models/Cart')
const Order = require('../models/Order')
const Inventory = require('../models/Inventory')
const moment = require('moment')

class OrderController {
    //[GET] /api/order/:id
    async info(req, res) {
        try {
            const userId = req.user._id
            const orders = await Order.findOne({ userId: userId, _id: req.params.id }).populate('products.productId')
            if (!orders) {
                return res.status(400).json({
                    message: 'Order is not exist',
                })
            }

            return res.status(200).json({
                message: 'Get order success',
                data: orders,
            })
        } catch (error) {
            return res.status(400).json({
                message: 'An error occured! ' + error,
            })
        }
    }

    //[GET] /api/order/my-orders
    async myOrders(req, res) {
        try {
            const userId = req.user._id
            const orders = await Order.find({ userId: userId }).sort({ createdAt: -1 }).populate('products.productId')
            if (!orders) {
                return res.status(400).json({
                    message: 'Order is not exist',
                })
            }

            return res.status(200).json({
                message: 'Get my orders success',
                data: orders,
            })
        } catch (error) {
            return res.status(400).json({
                message: 'An error occured! ' + error,
            })
        }
    }

    //[GET] /api/order/
    async list(req, res) {
        try {
            const orders = await Order.find({}).sort({ createdAt: -1 }).populate('products.productId')

            return res.status(200).json({
                message: 'Get list of orders success',
                data: orders,
            })
        } catch (error) {
            return res.status(400).json({
                message: 'An error occured! ' + error,
            })
        }
    }

    //[GET] /api/order/analyze
    async analyze(req, res) {
        try {
            const day = req.query.day
            const month = req.query.month
            const year = req.query.year
            const isValidDay = day && moment(day, 'YYYY-MM-DD', true).isValid() ? true : false
            const isValidMonth = month && moment(month, 'YYYY-MM', true).isValid() ? true : false
            const isValidYear = year && moment(year, 'YYYY', true).isValid() ? true : false
            let query = {}

            if (!isValidDay && !isValidMonth && !isValidYear) {
                return res.status(400).json({
                    message: 'Invalid day format. Use YYYY-MM-DD for day. Use YYYY-MM for month. Use YYYY for year',
                })
            }

            //Case 1: filter by day || month || year
            if (isValidDay) {
                query = {
                    createdAt: {
                        $gte: moment(day).startOf('day').toDate(),
                        $lte: moment(day).endOf('day').toDate(),
                    },
                }
            } else if (isValidMonth) {
                query = {
                    createdAt: {
                        $gte: moment(month).startOf('month').toDate(),
                        $lte: moment(month).endOf('month').toDate(),
                    },
                }
            } else if (isValidYear) {
                query = {
                    createdAt: {
                        $gte: moment(year).startOf('year').toDate(),
                        $lte: moment(year).endOf('year').toDate(),
                    },
                }
            }

            console.log(query)
            //Get order by query
            const orders = await Order.find(query)

            //Get total sales of orders
            const totalSales = orders.reduce((total, order) => {
                return order?.totalPrice ? total + order.totalPrice : total
            }, 0)

            //Get total order
            const totalOrders = orders.length

            //Get total order finish
            const totalOrderFinish = orders.filter((order) => order.status === 'Đã hoàn thành').length

            //Get total order confirm
            const totalOrderConfirm = orders.filter((order) => order.status === 'Đã giao hàng').length

            //Get total order not confirm
            const totalOrderNotConfirm = orders.filter((order) => order.status === 'Đang xử lý').length

            //Get total order cancel
            const totalOrderCancel = orders.filter((order) => order.status === 'Đã huỷ').length

            return res.status(200).json({
                message: `Get analyze of orders in`,
                data: {
                    totalSales,
                    totalOrders,
                    totalOrderFinish,
                    totalOrderConfirm,
                    totalOrderNotConfirm,
                    totalOrderCancel,
                    orders,
                },
            })
        } catch (error) {
            return res.status(400).json({
                message: 'An error occured! ' + error,
            })
        }
    }

    //[POST] /api/order/
    async order(req, res) {
        const userId = req.user._id
        const { productId, quantity, payment, name, address, phoneNumber, notes } = req.body
        try {
            //Create order
            const order = await Order.create({
                userId,
                payment,
                name,
                address,
                phoneNumber,
                notes,
                products: {
                    productId,
                    quantity,
                },
            })

            //1.Check if there is enough product in inventory?
            const stock = await Inventory.updateOne(
                {
                    productId,
                    quantity: { $gte: quantity },
                },
                {
                    $inc: {
                        quantity: -quantity,
                    },
                    $push: {
                        orders: {
                            orderId: order._id,
                            userId,
                            quantity,
                        },
                    },
                },
            )

            //2. If there is enough product in inventory
            //Enough product in inventory
            if (stock.modifiedCount) {
                //Get order
                const newOrder = await Order.findOne({
                    _id: order._id,
                }).populate('products.productId')

                //Total price = (price * quantity) + shippingPrice
                newOrder.totalPrice =
                    newOrder.products.reduce((total, product) => {
                        return total + product.quantity * product.productId.price
                    }, 0) + newOrder.shippingPrice

                //Save order
                await newOrder.save()

                return res.status(200).json({
                    message: 'Order success',
                    data: newOrder,
                })
            } else {
                //Not enough product in inventory
                //Remove order
                await order.remove()

                return res.status(400).json({
                    message: 'Not enough product in inventory',
                })
            }
        } catch (error) {
            return res.status(400).json({
                message: 'An error occured! ' + error,
            })
        }
    }

    //[POST] /api/order/order-from-cart
    async orderFromCart(req, res) {
        try {
            const userId = req.user._id
            const { cartId, payment, name, address, phoneNumber, notes } = req.body
            let message = ''
            //Create order
            const order = await Order.create({
                userId,
                cartId,
                payment,
                name,
                address,
                phoneNumber,
                notes,
            })
            //Get order populate cartId
            const newOrder = await Order.findOne({
                _id: order._id,
            }).populate('cartId')

            //If cart is empty
            if (newOrder.cartId.products.length === 0) {
                return res.status(400).json({
                    message: 'Cart is empty',
                })
            }

            //1.Check if there is not enough product in inventory?
            let isEnoughProduct = true

            for (const product of newOrder.cartId.products) {
                const stock = await Inventory.findOne({
                    productId: product.productId,
                    quantity: { $gte: product.quantity }, // Less than
                })

                console.log('stock: ', stock)

                // If not enough product in inventory
                if (stock !== null) {
                    isEnoughProduct = false
                    break
                }
            }
            console.log('isEnoughProduct: ', isEnoughProduct)

            //2. If there is not enough product in inventory
            if (isEnoughProduct) {
                //Remove order
                await order.remove()
                return res.status(400).json({
                    message: `Not enough product in inventory`,
                })
            }

            //3. If there is enough product in inventory
            newOrder.cartId.products.forEach(async (product) => {
                await Inventory.updateOne(
                    {
                        productId: product.productId,
                        quantity: { $gte: product.quantity },
                    },
                    {
                        //Decrease quantity in inventory
                        $inc: {
                            quantity: -product.quantity,
                        },
                        //Push orders
                        $push: {
                            orders: {
                                orderId: order._id,
                                userId,
                                quantity: product.quantity,
                            },
                        },
                    },
                )
            })

            //Push products in cart into order
            newOrder.products = newOrder.cartId.products
            await newOrder.save()

            //Remove products in cart when order
            await Cart.updateOne(
                {
                    _id: cartId,
                },
                {
                    $set: {
                        products: [],
                    },
                },
            )

            //Populate  order by productId
            const updateOrder = await newOrder.populate('products.productId')

            //Total price = (price * quantity) + shippingPrice
            updateOrder.totalPrice =
                updateOrder.products.reduce((total, product) => {
                    return total + product.quantity * product.productId.price
                }, 0) + updateOrder.shippingPrice

            //Save order
            await updateOrder.save()

            return res.status(200).json({
                message: 'Order success',
                data: updateOrder,
            })
        } catch (error) {
            return res.status(400).json({
                message: 'An error occured! ' + error,
            })
        }
    }

    //[PUT] /api/order/confirm-order/:id
    async confirmOrder(req, res) {
        const id = req.params.id
        try {
            //Get order by id
            const order = await Order.findOne({ _id: id })

            //Check if order is not processing
            if (order.status !== 'Đang xử lý') {
                return res.status(400).json({
                    message: 'Order is not processing',
                })
            }

            //Change order status when confirm order
            order.status = 'Đã giao hàng'
            //Save order in db
            await order.save()

            return res.status(200).json({
                message: 'Confirm order success',
            })
        } catch (error) {
            return res.status(400).json({
                message: 'An error occured! ' + error,
            })
        }
    }

    //[PUT] /api/order/cancel-order/:id
    async cancelOrder(req, res) {
        const id = req.params.id
        const userId = req.user._id
        const userRole = req.user.role
        console.log(id)
        try {
            //Get order by id
            const order = await Order.findOne({ _id: id })

            //Check if order is not processing
            if (order.status === 'Đã hoàn thành') {
                return res.status(400).json({
                    message: 'Order is finished',
                })
            }

            if (userRole != 'admin' && userId != order.userId) {
                return res.status(400).json({
                    message: 'Order is not belong to user',
                })
            }

            //Change order status when confirm order
            order.status = 'Đã huỷ'
            //Save order in db
            await order.save()

            //For each product in order
            order.products.forEach(async (product) => {
                //Candle orders in inventory
                await Inventory.updateOne(
                    {
                        productId: product.productId,
                    },
                    {
                        //Return quantity in inventory
                        $inc: {
                            quantity: product.quantity,
                        },
                        //Pull orders in inventory
                        $pull: {
                            orders: {
                                orderId: order._id,
                            },
                        },
                    },
                )
            })

            return res.status(200).json({
                message: 'Candle order success',
            })
        } catch (error) {
            return res.status(400).json({
                message: 'An error occured! ' + error,
            })
        }
    }

    //[PUT] /api/order/finish-order/:id
    async finishOrder(req, res) {
        const id = req.params.id
        try {
            const id = req.params.id
            try {
                //Get order by id
                const order = await Order.findOne({ _id: id })

                //Check if order is not processing
                if (order.status !== 'Đã giao hàng') {
                    return res.status(400).json({
                        message: 'Order is not confirm',
                    })
                }

                //Change order status when confirm order
                order.status = 'Đã hoàn thành'
                //Save order in db
                await order.save()

                return res.status(200).json({
                    message: 'Finished order success',
                })
            } catch (error) {
                return res.status(400).json({
                    message: 'An error occured! ' + error,
                })
            }
        } catch (error) {
            return res.status(400).json({
                message: 'An error occured! ' + error,
            })
        }
    }
}

module.exports = new OrderController()
