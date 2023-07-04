// User (CRUD) & (admin)

const slugify = require('slugify')
const multer = require('multer')
const sharp = require('sharp')
const { v4: uuidv4 } = require('uuid')
const asyncHandler = require('express-async-handler')
const ApiError = require('../utils/apiError')
const User = require('../models/userModel')

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

exports.uploadUserImage = upload.single('profileImg')

exports.resizeImage = asyncHandler(async (req,res,next) =>{
  const filename = `user-${uuidv4()}-${Date.now()}.jpeg`
  if(req.file){
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat('jpeg')
      .jpeg({quality: 90})
      .toFile(`uploads/users/${filename}`);

      req.body.profileImg = filename 
  }
    
  next();
})




// get all users - router: GET /api/user - privet
exports.getUsers = asyncHandler(async (req,res) =>{
  const page = req.query.page * 1 || 1
  const limit = req.query.limit * 1 || 4
  const skip = (page - 1) * limit
  const users = await User.find({}).skip(skip).limit(limit) // 5
  res.status(200).json({results: users.length, data:users})
})

// get single users - router: GET /api/uers/:id - privet
exports.getUser = asyncHandler(async(req,res,next) =>{
  const { id } = req.params
  const user = await User.findById(id)
  if (!user){
    // res.status(404).json({message: `user is not found on ${id}`})
    return next(new ApiError(`user is not found on id: ${id}`, 404))
  }
  res.status(200).json({data: user})
})
// create User - router: POST /api/User - private
exports.createUser = asyncHandler(async (req,res) => {
  const name = req.body.name
  const image = req.body.image
  const user = await User.create({name, slug: slugify(name),image})
  res.status(201).json({data: user})
})

// update User - router: PUT /api/User/:id - private
exports.updateUser = asyncHandler(async(req,res,next) => {
  const { id } = req.params
  const { name } = req.body
  const user = await User.findByIdAndUpdate(
    {_id:id},
    {name, slug: slugify(name)},
    {new:true})
  if (!user){
    return next(new ApiError(`user is not found on id: ${id}`, 404))
  }
  res.status(200).json({data: user})
})

// delete User - router: DELETE /api/User/:id - private
exports.deleteUser = asyncHandler(async(req,res,next) => {
  const { id } = req.params
  const user = await User.findByIdAndDelete(id)
  if (!user){
    return next(new ApiError(`user is not found on id: ${id}`, 404))
  }
  res.status(204).json({message:"uesr is removed"})
})