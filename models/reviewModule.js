const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({

    title: {
        type: String
    },
    ratings: {
        type: Number,
        min: [1 , "Min Ratings Value is 1.0"],
        max: [5 , "Min Ratings Value is 5.0"],
        required: [true ,'Review rating is required']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true ,'Review Must bblong User']
    },
    product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: [true ,'Review Must bblong Product']
    }
},{ timestamps: true })

module.exports = mongoose.model('Review', reviewSchema)