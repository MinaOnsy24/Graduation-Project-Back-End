const slugify = require('slugify')
const asyncHandler = require('express-async-handler')
const ApiError = require('../utils/apiError')

const ProductModel = require('../models/productModel')

// get all products - router: GET /api/product - public
exports.getProducts = asyncHandler(async (req,res) =>{
  const page = req.query.page * 1 || 1
  const limit = req.query.limit * 1 || 4
  const skip = (page - 1) * limit
  const products = await ProductModel.find({}).skip(skip).limit(limit) //5
  .populate({path: 'category', select: 'name -_id'})
  res.status(200).json({results: products.length, data:products})
})

// get single product - router: GET /api/product/:id - public
exports.getProduct = asyncHandler(async(req,res,next) =>{
  const { id } = req.params
  const product = await ProductModel.findById(id)
  .populate({path: 'category', select: 'name -_id' })
  if (!product){
    // res.status(404).json({message: `product is not found on ${id}`})
    return next(new ApiError(`category is not found on id: ${id}`, 404))
  }
  res.status(200).json({data: product})
})
// create product - router: POST /api/product - private
exports.createProduct = asyncHandler(async (req,res) => {
  req.body.slug = slugify(req.body.title)
  const product = await ProductModel.create(req.body)
  res.status(201).json({data: product})
})

// update product - router: PUT /api/product/:id - private
exports.updateProduct = asyncHandler(async(req,res,next) => {
  const { id } = req.params
  const product = await ProductModel.findByIdAndUpdate(
    {_id:id},
    req.body,
    {new:true})
  if (!product){
    return next(new ApiError(`product is not found on id: ${id}`, 404))
  }
  res.status(200).json({data: product})
})

// delete product - router: DELETE /api/product/:id - private
exports.deleteProduct = asyncHandler(async(req,res,next) => {
  const { id } = req.params
  const product = await ProductModel.findByIdAndDelete(id)
  if (!product){
    return next(new ApiError(`product is not found on id: ${id}`, 404))
  }
  res.status(204).json({message:"product is removed"})
})