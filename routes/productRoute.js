const express = require("express");
const {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    uploadProductImage,
    resizeProductImages,
} = require("../controllers/productController");
const {
    createProductValidator,
    getProductValidator,
    updateProductValidator,
    deleteProductValidator,
} = require("../utils/validators/productValidator");
const AuthController = require("../controllers/authUserController");

const router = express.Router();
router
    .route("/")
    .get(getProducts)
    .post(
        AuthController.protect,
        AuthController.allowedTo("admin"),
        uploadProductImage,
        resizeProductImages,
        createProductValidator,
        createProduct
    );

router
    .route("/:id")
    .get(getProductValidator, getProduct)
    .put(
        AuthController.protect,
        AuthController.allowedTo("admin"),
        uploadProductImage,
        resizeProductImages,
        updateProductValidator,
        updateProduct
    )
    .delete(
        AuthController.protect,
        AuthController.allowedTo("admin"),
        deleteProductValidator,
        deleteProduct
    );

module.exports = router;
