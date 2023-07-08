const express = require('express')
const { getProducts,getProduct,createProduct,updateProduct,deleteProduct,uploadProductImage,resizeImage } = 
require('../controllers/productController')
const { createProductValidator,getProductValidator,updateProductValidator,deleteProductValidator } =
require('../utils/validators/productValidator')

const router = express.Router()
router.route('/')
.get(getProducts)
.post(uploadProductImage,resizeImage,createProductValidator,createProduct)

router.route("/:id")
.get( getProductValidator,getProduct)
.put(uploadProductImage,resizeImage,updateProductValidator,updateProduct)
.delete(deleteProductValidator,deleteProduct)


module.exports = router