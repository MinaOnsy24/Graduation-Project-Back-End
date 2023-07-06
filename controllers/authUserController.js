// singup & login & forget password & logout
const asyncHandler = require("express-async-handler");
const ApiError = require('../utils/apiError');
const jwt = require('jsonwebtoken')
const User = require('../models/userModel2');

exports.signup = asyncHandler(async (req, res, next) => {
    const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        confirmPassword:req.body.confirmPassword
    });
    const token = jwt.sign({ userId: user._id },process.env.jwt_Key,{
        expiresIn:process.env.jwt_ExpireDate,
    });
    res.status(201).json({data: user,token})


});