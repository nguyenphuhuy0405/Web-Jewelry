const Cart = require('../models/Cart')
const Order = require('../models/Order')
const Inventory = require('../models/Inventory')

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

            //1.Check if there is enough product in inventory?
            let isEnoughProduct
            newOrder.cartId.products.forEach(async function (product) {
                isEnoughProduct = true
                const stock = await Inventory.findOne({
                    productId: product.productId,
                    quantity: { $gte: product.quantity },
                })

                //If enough product in inventory
                if (stock == null) {
                    message += `Not enough productId ${product.productId} in inventory \n`
                    isEnoughProduct = false
                }

                console.log('isEnoughProduct: ', isEnoughProduct)
            })

            //2. If there is enough product in inventory
            if (isEnoughProduct) {
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
            } else {
                //If not enough product in inventory
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
}

module.exports = new OrderController()
