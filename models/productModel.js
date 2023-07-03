const mongoose = require('mongoose')

// category schema
const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
    trim: true,
    minlength: 3,
    maxlength: 100
  },
  slug: {
    type: String,
    lowercase: true
  },
  describtion: {
    type: String,
    required: true,
    maxlength: 2000
  },
  quantity: {
    type: Number,
    require:true,
    default: 0
  },
  sold: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: true,
    trim: true,
    max: [10000]
  },
  priceAfterDiscount: {
    type: Number
  },
  images: [String],
  category:{
    type: mongoose.Schema.ObjectId,
    ref: 'Category',
    required: true
  },
  ratingAverage: {
    type: Number,
    min: [1],
    max: [5]
  },
  ratingQuntity: {
    type: Number,
    default: 0
  }
}
,{
  timestamps: true
}
)
const ProductModel = mongoose.model('Product',ProductSchema)
module.exports = ProductModel