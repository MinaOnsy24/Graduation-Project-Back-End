const asyncHandler = require('express-async-handler')
const slugify = require('slugify')
const ApiError = require('../utils/apiError')
const ApiFeatures = require('../utils/apiFeatures')
const reviewModule = require('../models/reviewModule')



// get all reviews - router: GET /api/reciews - public
exports.getReviews = asyncHandler(async (req,res) =>{
  // build query
  const documentsCounts = await reviewModule.countDocuments()
  const apiFeatures = new ApiFeatures(reviewModule.find(), req.query) 
  .paginate(documentsCounts)
  .filter()
  .search('reviews')
  .limitFields()
  .sort()

  // execute query
  const {mongooseQuery,paginationResult} = apiFeatures
  const reviews = await mongooseQuery

  res.status(200).json({results: reviews.length, paginationResult,data:reviews})
})

// get single review - router: GET /api/reciews/:id - public
exports.getReview = asyncHandler(async(req,res,next) =>{
  const { id } = req.params
  const review = await reviewModule.findById(id)
  .populate({path: 'category', select: 'name -_id' })
  if (!review){
    // res.status(404).json({message: `review is not found on ${id}`})
    return next(new ApiError(`review is not found on id: ${id}`, 404))
  }
  res.status(200).json({data: review})
})
// create review - router: POST /api/reciews - private
exports.createReview = asyncHandler(async (req,res) => {
  req.body.slug = slugify(req.body.title)
  const review = await reviewModule.create(req.body)
  res.status(201).json({data: review})
})

// update review - router: PUT /api/reciews/:id - private
exports.updateReview = asyncHandler(async(req,res,next) => {
  const { id } = req.params
  const review = await reviewModule.findByIdAndUpdate(
    {_id:id},
    req.body,
    {new:true})
  if (!review){
    return next(new ApiError(`review is not found on id: ${id}`, 404))
  }
  res.status(200).json({data: review})
})

// delete review - router: DELETE /api/reciews/:id - private
exports.deleteReview = asyncHandler(async(req,res,next) => {
  const { id } = req.params
  const review = await reviewModule.findByIdAndDelete(id)
  if (!review){
    return next(new ApiError(`review is not found on id: ${id}`, 404))
  }
  res.status(204).json({message:"review is removed"})
})