const express = require("express");
const { cashOrder } = require("../controllers/orderController");

const AuthController= require("../controllers/authUserController");
const router = express.Router();
router.use(AuthController.protect);
router.route("/:cartId").post(cashOrder);

module.exports=router
