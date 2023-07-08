const express = require("express");

const {addProductToCart,getLoggedUserCart,removeSpecificCartItem,clearCart,updateCartItemQuantity} 
= require("../controllers/cartController");

const AuthController=require('../controllers/authUserController')

const router = express.Router();
router
  .route("/")
  .post(
    AuthController.protect,
    AuthController.allowedTo('user'),
    addProductToCart)
.get(getLoggedUserCart)  
.delete(clearCart)

router.route('/:itemId').put(updateCartItemQuantity).delete(removeSpecificCartItem)

module.exports = router;
