// singup & login & forget password & logout
const crypto = require("crypto");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel2");
const sendEmail = require("../utils/sendEmail");
const { log } = require("console");

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
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
        return next(new ApiError("you are not login please login"), 401);
    }

    const decode = jwt.verify(token, process.env.jwt_Key);

    const currentUser = await User.findById(decode.userId);
    if (!currentUser) {
        return next(new ApiError("invaild user data please try ", 401));
    }
    if (currentUser.passwordChangedAt) {
        const passwordChangedAtTimeStam = parseInt(
            currentUser.passwordChangedAt.getTime() / 1000,
            10
        );
        console.log(passwordChangedAtTimeStam, decode.iat);
        if (passwordChangedAtTimeStam > decode.iat) {
            return next(
                new ApiError(
                    "user recrntly change password please login with new password ",
                    401
                )
            );
        }
    }
    res.user = currentUser;
    next();
});
// user permistions
exports.allowedTo = (...roles) =>
    asyncHandler(async (req, res, next) => {
        if (!roles.includes(res.user.role)) {
            next(new ApiError("you are noy allowed to make this action", 403));
        }
        next();
    });

// forget password

exports.forgetPassword = asyncHandler(async (req, res, next) => {
    //verify user email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new ApiError(`${req.body.email} is invaild `, 404));
    }

    // if user is exist genarate random code 6 degits and save it in database
    const userResetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedResetCode = crypto
        .createHash("sha256")
        .update(userResetCode)
        .digest("hex");
    user.passwordResetCode = hashedResetCode;
    //add expiration date for reset code after 10 mintus
    user.passwordResetCodeExpirse = Date.now() + 10 * 60 * 1000;
    user.passwordResetCodeVerified = false;
    await user.save();
    // send rendom code to user email
    const messageContent = `Hi ${user.name}\nYour reset code password for your account ${user.email} on Amazon is \n ${userResetCode}\n please enter it to reset your password\n thanks for helps us to make your account secure\n Amazon Team`;

    try {
        await sendEmail({
            email: user.email,
            subject: "reset code password message",
            message: messageContent,
        });
    } catch (error) {
        user.passwordResetCode = 'undfiend';
        user.passwordResetCodeExpirse = 'undfiend';
        user.passwordResetCodeVerified = 'undfiend';
        await user.save();
        return next(new ApiError('there are an error in sending email',500))
    }
    res.status(200).json({ status: 'success', message: 'reset code send to email' })
});
