const express = require('express')


const { getCategories,getCategory,createCategory,updateCategory,deleteCategory, uploadCategoryImage, resizeImage } = 
require('../controllers/categoryController')
const { getCategoryValidator,createCategoryValidator,updateCategoryValidator,deleteCategoryValidator } = 
require('../utils/validators/categoryValidator')


const router = express.Router()
router.route('/')
.get(getCategories)
.post(uploadCategoryImage,
    resizeImage,
    createCategoryValidator,
    createCategory)

router.route("/:id")
.get( getCategoryValidator,getCategory)
.put(uploadCategoryImage,resizeImage,updateCategoryValidator,updateCategory)
.delete(deleteCategoryValidator,deleteCategory)


module.exports = router