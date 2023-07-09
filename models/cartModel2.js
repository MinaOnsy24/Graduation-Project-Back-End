const mongoose = require('mongoose')
const cartSchema2 = new mongoose.Schema({
    cartItems: [
        {
            product: {
                type: mongoose.Schema.ObjectId,
                ref: 'product'
            },
            price: Number,
            quantity: {
                type: Number,
                default: 1,
            },
            user: {
                type: mongoose.Schema.ObjectId,
                ref: "user"
            }
        }
    ],
    totalCartPrice: Number,
}, { timestamps: true })

module.exports = mongoose.model('cartModel', cartSchema2);