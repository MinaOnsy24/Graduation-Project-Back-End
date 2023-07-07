const express = require("express");
const {
    getUserValidator,
    updateUserValidator,
    deleteUserValidator,
    createUserValidator,
    changePasswordValidator,
} = require("../utils/validators/user2Validator");

const {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    uploadUserImage,
    resizeImage,
    changePassword,
} = require("../controllers/userController2");

const router = express.Router();
const AuthController = require("../controllers/authUserController");

router.put("/changePassword/:id", changePasswordValidator, changePassword);

router
    .route("/")
    .get(AuthController.protect, AuthController.allowedTo("admin"), getUsers)
    .post(
        AuthController.protect,
        AuthController.allowedTo("admin"),
        uploadUserImage,
        resizeImage,
        createUserValidator,
        createUser
    );
router
    .route("/:id")
    .get(
        AuthController.protect,
        AuthController.allowedTo("admin"),
        getUserValidator,
        getUser
    )
    .put(
        AuthController.protect,
        AuthController.allowedTo("admin"),
        uploadUserImage,
        resizeImage,
        updateUserValidator,
        updateUser
    )
    .delete(
        AuthController.protect,
        AuthController.allowedTo("admin"),
        deleteUserValidator,
        deleteUser
    );

module.exports = router;
