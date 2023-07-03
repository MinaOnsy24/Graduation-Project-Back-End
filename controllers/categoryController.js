const slugify = require('slugify')
const multer = require('multer')
const sharp = require('sharp')
const { v4: uuidv4 } = require('uuid')
const asyncHandler = require('express-async-handler')
const ApiError = require('../utils/apiError')
const CategoryModel = require('../models/categoryModel')

// // diskStorage engine
// const multerStorage = multer.diskStorage({
//   destination: function(req,file,cb){
//     cb(null, 'uploads/categories')
//   },
//   filename: function(req,file,cb){
//     const ext = file.mimetype.split('/')[1]
//     const filename = `category-${uuidv4()}-${Date.now()}.${ext}`
//     cb(null,filename)
//     console.log(req.file)
//   }
// })
/// memoryStorage
const multerStorage = multer.memoryStorage()
// only Image
const multerFilter = function(req,file,cb){
  if (file.mimetype.startsWith('image')){
    cb(null,true)
  }else{
    cb(new ApiError(`only image allow`,400),false)
  }
}

const upload = multer({storage: multerStorage,fileFilter: multerFilter})

exports.uploadCategoryImage = upload.single('image')

exports.resizeImage = asyncHandler(async (req,res,next) =>{
  const filename = `category-${uuidv4()}-${Date.now()}.jpeg`
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat('jpeg')
      .jpeg({quality: 90})
      .toFile(`uploads/categories/${filename}`);

      req.body.image = filename 
  next();
})




// get all category - router: GET /api/category - public
exports.getCategories = asyncHandler(async (req,res) =>{
  const page = req.query.page * 1 || 1
  const limit = req.query.limit * 1 || 4
  const skip = (page - 1) * limit
  const categories = await CategoryModel.find({}).skip(skip).limit(limit) // 5
  res.status(200).json({results: categories.length, data:categories})
})

// get single category - router: GET /api/category/:id - public
exports.getCategory = asyncHandler(async(req,res,next) =>{
  const { id } = req.params
  const category = await CategoryModel.findById(id)
  if (!category){
    // res.status(404).json({message: `category is not found on ${id}`})
    return next(new ApiError(`category is not found on id: ${id}`, 404))
  }
  res.status(200).json({data: category})
})
// create category - router: POST /api/category - private
exports.createCategory = asyncHandler(async (req,res) => {
  const name = req.body.name
  const image = req.body.image
  const category = await CategoryModel.create({name, slug: slugify(name),image})
  res.status(201).json({data: category})
})

// update category - router: PUT /api/category/:id - private
exports.updateCategory = asyncHandler(async(req,res,next) => {
  const { id } = req.params
  const { name } = req.body
  const category = await CategoryModel.findByIdAndUpdate(
    {_id:id},
    {name, slug: slugify(name)},
    {new:true})
  if (!category){
    return next(new ApiError(`category is not found on id: ${id}`, 404))
  }
  res.status(200).json({data: category})
})

// delete category - router: DELETE /api/category/:id - private
exports.deleteCategory = asyncHandler(async(req,res,next) => {
  const { id } = req.params
  const category = await CategoryModel.findByIdAndDelete(id)
  if (!category){
    return next(new ApiError(`category is not found on id: ${id}`, 404))
  }
  res.status(204).json({message:"category is removed"})
})