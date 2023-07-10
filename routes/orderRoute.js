const express = require("express");
const {
    cashOrder,
    findAllOrders,
    speceficOrder,
    filterOrderForLoggedUser,
} = require("../controllers/orderController");

const AuthController = require("../controllers/authUserController");
const router = express.Router();
router.use(AuthController.protect, AuthController.allowedTo("user"));
router.route("/:cartId").post(cashOrder);
router.get(
    "/",
    AuthController.allowedTo("admin"),
    filterOrderForLoggedUser,
    findAllOrders
);
router.get("/:id", AuthController.allowedTo("admin"), speceficOrder);

module.exports = router;
