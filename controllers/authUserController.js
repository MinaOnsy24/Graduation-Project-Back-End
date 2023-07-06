// singup & login & forget password & logout
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel2");

// Singup
exports.signup = asyncHandler(async (req, res, next) => {
    // create
    const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
    });
    // generation token
    const token = jwt.sign({ userId: user._id }, process.env.jwt_Key, {
        expiresIn: process.env.jwt_ExpireDate,
    });
    res.status(201).json({ data: user, token });
});

//login
exports.login = asyncHandler(async (req, res, next) => {
    // check user exist , password ic correct
    const user = await User.findOne({ email: req.body.email });
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
        return next(new ApiError("incorrect Email or Password", 401));
    }
    // generation token
    const token = jwt.sign({ userId: user._id }, process.env.jwt_Key, {
        expiresIn: process.env.jwt_ExpireDate,
    });
    res.status(200).json({ data: user, token });
});

exports.protect = asyncHandler(async (req, res, next) => {
    console.log(req.headers);
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
        console.log(token);
    }
    if (!token) {
        return next(new ApiError("you are not login please login"), 401);
    }
});
