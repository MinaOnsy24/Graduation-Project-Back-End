const express = require("express");
const { addToCart } = require("../controllers/cartController2");

const AuthController = require("../controllers/authUserController");

const router = express.Router();

router
    .route("/")
    .post(
        AuthController.protect,
        AuthController.allowedTo('user'),
        addToCart
    );


    module.exports=router
