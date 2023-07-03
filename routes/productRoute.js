const express = require('express')
const { getProducts,getProduct,createProduct,updateProduct,deleteProduct } = 
require('../controllers/productController')
const { createProductValidator,getProductValidator,updateProductValidator,deleteProductValidator } =
require('../utils/validators/productValidator')

const router = express.Router()
router.route('/')
.get(getProducts)
.post(createProductValidator,createProduct)

router.route("/:id")
.get( getProductValidator,getProduct)
.put(updateProductValidator,updateProduct)
.delete(deleteProductValidator,deleteProduct)


module.exports = router