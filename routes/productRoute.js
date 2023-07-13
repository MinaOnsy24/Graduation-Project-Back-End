const express = require('express')
const { getProducts,getProduct,createProduct,updateProduct,deleteProduct,uploadProductImage,resizeImage ,getProductByCategory } = 
require('../controllers/productController')
const { createProductValidator,getProductValidator,updateProductValidator,deleteProductValidator } =
require('../utils/validators/productValidator')

const reviewRoute = require('./reviewRoute')

const router = express.Router()

    // nested route
// Post /products/id:lgvvfvvfdv/reviews
// Get  /products/id:product/reviews
// Get  /products/id:lgvvfvvfdv/reviews/tbb21534er   ده لو عاوز تقييم معين 
router.use('/:productId/reviews' , reviewRoute)

router.route('/')
.get(getProducts)
.post(uploadProductImage,resizeImage,createProductValidator,createProduct)

router.route("/:id")
.get( getProductValidator,getProduct)
.put(uploadProductImage,resizeImage,updateProductValidator,updateProduct)
.delete(deleteProductValidator,deleteProduct)

router.get("/category/:categoryId",getProductByCategory)

module.exports = router