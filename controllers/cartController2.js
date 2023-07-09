const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const ProductModel = require('../models/productModel')
const cartModel2 = require("../models/cartModel2");


const calcTotalCartPrice = (cart) =>{
    let totalPrice = 0
    cart.cartItems.forEach((item) => {
      totalPrice += item.quantity * item.price
    });
    cart.totalCartPrice = totalPrice
    return totalPrice
}

// @desc    add product to cart
// @route   post /api/cart/
// @access privat /user
exports.addToCart = asyncHandler(async (req, res, next) => {
    const { productId } = req.body
    const product = await ProductModel.findById(productId)
    let cart = await cartModel2.findOne({ user: req.user._id });


    if (!cart) {
        cart = await cartModel2.create({
            user: req.user._id,
            cartItems: [{ product: productId, price: product.price }],
        });
    } else {
        // if product exist in cart, update product quentity
        const productIndex = cart.cartItems.findIndex(
            (item) => item.product.toString() === productId
        );
        if (productIndex > -1) {
            const cartItem = cart.cartItems[productIndex]
            cartItem.quantity += 1;
            cart.cartItems[productIndex] = cartItem
        } else {
            // product not exist on cart push product to cartItem array
            cart.cartItems.push({ product: productId, price: product.price })
        }
    }

    ////// calculate total price
    calcTotalCartPrice(cart)
    await cart.save();

    res.status(200).json({
        status: 'success',
        message: 'Product added to Cart',
        numOfCartItem: cart.cartItems.length,
        data: cart
    })

});