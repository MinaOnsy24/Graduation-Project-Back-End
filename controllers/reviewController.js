const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");

const factory = require("./handlersFactory");
const Review = require('../models/reviewModule')


// @desc    Get list of reviews
// @route   GET /api/reviews
// @access  private
exports.getReviews = factory.getAll(Review);

// @desc    Get specific reviews by id
// @route   GET /api/reviews:id
// @access  private
exports.getReview = factory.getOne(Review);

// @desc    Create reviews
// @route   POST  /api/reviews/:id
// @access  Private
exports.createReview = factory.createOne(Review);

// @desc    Update specific Review
// @route   PUT /api/reviews/:id
// @access  Private
exports.updateReview = asyncHandler(async(req,res,next) => {
  const { id } = req.params
  const review = await Review.findByIdAndUpdate(
    {_id:id},
    req.body,
    {new:true})
  if (!review){
    return next(new ApiError(`review is not found on id: ${id}`, 404))
  }
  res.status(200).json({data: review})
})

// @desc    Delete specific review
// @route   DELETE /api/reviews/:id
// @access  Private
exports.deleteReview = factory.deleteOne(Review);