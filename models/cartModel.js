const mongoose = require('mongoose')

const cartSchema = mongoose.Schema({
  cartItems:[
    {
        product: {
          type: mongoose.SchemaTypes.ObjectId,
          ref: 'Product'
        },
        // price: Number,
        quantity: {
          type: Number,
          default: 1,
        },
    }
  ],
  totalCartPrice:Number,
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'user2',
  }
},
  {timestamps:true}
);
module.exports = mongoose.model('Cart',cartSchema)
