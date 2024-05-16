const Inventory = require('../models/Inventory')
const Cart = require('../models/Cart')

class CartController {
    //[GET] /api/cart/
    async getCart(req, res) {
        const userId = req.user._id
        try {
            if (!userId)
                return res.status(404).json({
                    message: 'User not found',
                })
            //Get cart by user id
            const cart = await Cart.findOne({ userId }).populate('products.productId')

            //If cart not exist return error message
            if (!cart)
                return res.status(404).json({
                    message: 'No product in your cart',
                })

            //Calculate total price
            let totalPrice = 0
            cart.products.forEach((product) => {
                totalPrice += product.quantity * product.productId.price
            })

            return res.status(200).json({
                message: 'Get cart success',
                data: cart,
                totalPrice: totalPrice,
            })
        } catch (error) {
            return res.status(400).json({
                message: 'An error occured! ' + error,
            })
        }
    }

    //[POST] /api/cart/
    async addToCart(req, res) {
        const userId = req.user._id
        const { productId, quantity = '1' } = req.body
        try {
            //Get cart by productId
            const cart = await Cart.findOne({
                userId,
            })

            //Get product in cart
            const product = cart?.products.find((product) => {
                if (product.productId === Number.parseInt(productId)) {
                    return product
                } else {
                    return null
                }
            })

            //If product already exist in cart increase quantity
            if (product) {
                //Increase quantity
                product.quantity += Number.parseInt(quantity)

                //Save cart
                await cart.save()
            } else {
                //Find cart by userId and push product (if not exist create new cart)
                await Cart.findOneAndUpdate(
                    {
                        userId,
                    },
                    {
                        $push: {
                            products: {
                                productId,
                                quantity: quantity,
                            },
                        },
                    },
                    {
                        upsert: true, //create if not exist
                        new: false, //return new document
                    },
                )
            }
            //Get new cart
            const newCart = await Cart.findOne({ userId })

            return res.status(200).json({
                message: 'Add to cart success',
                data: newCart,
            })
        } catch (error) {
            return res.status(400).json({
                message: 'An error occured! ' + error,
            })
        }
    }

    //[PUT] /api/cart/
    async updateCart(req, res) {
        try {
            const userId = req.user._id
            const { productId, quantity } = req.body
            //Get cart by productId
            const cart = await Cart.findOne({ userId })

            //Find product in cart and update quantity
            console.log('cart: ', cart.products)
            cart.products.forEach((product) => {
                if (product.productId === Number.parseInt(productId)) {
                    product.quantity = Number.parseInt(quantity)
                }
            })

            const newCart = await cart.save()
            return res.status(200).json({
                message: 'Update cart success',
                data: newCart,
            })
        } catch (error) {
            return res.status(400).json({
                message: 'An error occured! ' + error,
            })
        }
    }

    //[DELETE] /api/cart/:id
    async removeToCart(req, res) {
        const userId = req.user._id
        const productId = req.params.id
        try {
            //Find cart by userId and push product (if not exist create new cart)
            await Cart.findOneAndUpdate(
                {
                    userId,
                },
                {
                    $pull: {
                        products: {
                            productId,
                        },
                    },
                },
                {
                    upsert: true, //create if not exist
                    new: false, //return new document
                },
            )

            //Get new cart
            const newCart = await Cart.findOne({ userId })

            return res.status(200).json({
                message: 'Delete product in cart success',
                data: newCart,
            })
        } catch (error) {
            return res.status(400).json({
                message: 'An error occured! ' + error,
            })
        }
    }

    //[DELETE] /api/cart/
    async clearCart(req, res) {
        const userId = req.user._id
        try {
            //Get cart by productId
            const cart = await Cart.findOne({ userId })
            //Clear cart
            cart.products = []
            //Save cart
            await cart.save()

            return res.status(200).json({
                message: 'Clear cart success',
                data: cart,
            })
        } catch (error) {
            return res.status(400).json({
                message: 'An error occured! ' + error,
            })
        }
    }
}

module.exports = new CartController()
