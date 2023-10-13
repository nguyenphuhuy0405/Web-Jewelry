const Inventory = require('../models/Inventory')
const Cart = require('../models/Cart')

class CartController {

    //[GET] /api/cart/
    async getCart(req, res, next) {
        const userId = req.user._id
        try {
            //Get cart by user id
            const cart = await Cart.findOne({ userId }).lean()
            //If cart not exist return error message
            if(!cart) return res.status(404).json({
                isSuccess: false,
                message: 'No product in your cart'
            })

            return res.status(200).json({
                isSuccess: true,
                message: 'Get cart success',
                data: cart
            })
        } catch (error) {
            return res.status(400).json({
                isSuccess: false,
                message: 'An error occured! ' + error
            })
        }
    }

    //[POST] /api/cart/
    async addToCart(req, res, next) {
        const userId = req.user._id
        const { productId, quantity } = req.body
        try{
            //Get cart by productId
            const cart = await Cart.findOne({
                userId, 
                products: {
                    $elemMatch: {
                        productId
                    }
                }
             })
             //If productId already exist in cart return error message
            if(cart) return res.status(400).json({
                isSuccess: false,
                message: 'Product already exist in your cart'
            })

            //Find cart by userId and push product (if not exist create new cart)
            await Cart.findOneAndUpdate({
                userId, 
            },{
                $push: {
                    products: {
                        productId,
                        quantity
                    }
                }
            },{
                upsert: true, //create if not exist
                new: false, //return new document
            })

            //Get new cart
            const newCart = await Cart.findOne({ userId })

            return res.status(200).json({
                isSuccess: true,
                message: 'Add to cart success',
                data: newCart
            })
            
        }catch(error){
            return res.status(400).json({
                isSuccess: false,
                message: 'An error occured! ' + error
            })
        }
    }

    //[PUT] /api/cart/
    async updateCart(req, res, next) {
        const userId = req.user._id
        const { productId, quantity } = req.body
        
        try {
            //Get cart by productId
            const cart = await Cart.findOne({ userId })
            
            //Find product in cart and update quantity
            console.log('cart: ', cart.products)
            cart.products.forEach(product => {
                if(product.productId === Number.parseInt(productId)){
                    product.quantity = Number.parseInt(quantity)
                }
            })

            const newCart = await cart.save()
            return res.status(200).json({
                isSuccess: true,
                message: 'Update cart success',
                data: newCart
            })
        } catch (error) {
            return res.status(400).json({
                isSuccess: false,
                message: 'An error occured! ' + error
            })
        }
    }

    //[DELETE] /api/cart/
    async deleteCart(req, res, next) {
        const userId = req.user._id
        const { productId, quantity } = req.body
        try{
            //Find cart by userId and push product (if not exist create new cart)
            await Cart.findOneAndUpdate({
                userId, 
            },{
                $pull: {
                    products: {
                        productId,
                    }
                }
            },{
                upsert: true, //create if not exist
                new: false, //return new document
            })

            //Get new cart
            const newCart = await Cart.findOne({ userId })

            return res.status(200).json({
                isSuccess: true,
                message: 'Delete product in cart success',
                data: newCart
            })
            
        }catch(error){
            return res.status(400).json({
                isSuccess: false,
                message: 'An error occured! ' + error
            })
        }
    }

}

module.exports = new CartController()
