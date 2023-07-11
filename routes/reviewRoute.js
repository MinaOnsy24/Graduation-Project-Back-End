const express = require('express')
const {getReviews, createReview, getReview, updateReview,deleteReview } = 
require('../controllers/reviewController')
const authUserController = require('../controllers/authUserController')
// const { createProductValidator,getProductValidator,updateProductValidator,deleteProductValidator } =
// require('../utils/validators/productValidator')

const router = express.Router()
router.route('/')
.get(getReviews)
.post(
    authUserController.protect,
    authUserController.allowedTo('user'),
    createReview)

router.route("/:id")
.get(getReview)
.put(
    authUserController.protect,
    authUserController.allowedTo('user'),
    updateReview)
.delete(
    authUserController.protect,
    authUserController.allowedTo('user','admin'),
    deleteReview)


module.exports = router