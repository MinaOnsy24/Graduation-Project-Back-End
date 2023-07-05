const express = require('express');
const {
    getUserValidator,
    updateUserValidator,
    deleteUserValidator,
    createUserValidator,
    changePasswordValidator
} = require('../utils/validators/user2Validator')

const {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    uploadUserImage,
    resizeImage,
    changePassword,
    
} = require('../controllers/userController2');

const router = express.Router();
router.put('/changePassword/:id',changePasswordValidator,changePassword);

router
    .route('/')
    .get(getUsers).post(uploadUserImage,resizeImage,createUserValidator,createUser)
router
    .route('/:id')
    .get( getUserValidator,getUser)
    .put(uploadUserImage, resizeImage,updateUserValidator ,updateUser)
    .delete(deleteUserValidator,deleteUser);

module.exports = router;