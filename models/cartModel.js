const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({
  cartItems:[
    {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: 'Product'
        },
        quantity: {
          type: Number,
          default: 1,
        },
        price:Number
    }
  ],
  totalCartPrice:Number,
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'user2',
  }
},
  {timestamps:true}
);
module.exports = mongoose.model('Cart',cartSchema)
