const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const ApiError = require("../utils/apiError");
const bcrypt = require("bcryptjs");

const factory = require("./handlersFactory");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const user = require("../models/userModel2");

// Upload single image
exports.uploadUserImage = uploadSingleImage("profileImage");

// Image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
    const filename = `user profileImage-${uuidv4()}-${Date.now()}.jpeg`;
    if (req.file) {
        await sharp(req.file.buffer)
            .resize(600, 600)
            .toFormat("jpeg")
            .jpeg({ quality: 95 })
            .toFile(`uploads/users2/${filename}`);

        // Save image into our db
        req.body.profileImage = filename;
    }

    next();
});

// @desc    Get list of users
// @route   GET /api/v1/users
// @access  private
exports.getUsers = factory.getAll(user);

// @desc    Get specific user by id
// @route   GET /api/v1/users:id
// @access  private
exports.getUser = factory.getOne(user);

// @desc    Create user
// @route   POST  /api/v1/users/:id
// @access  Private
exports.createUser = factory.createOne(user);

// @desc    Update specific user
// @route   PUT /api/v1/users/:id
// @access  Private
exports.updateUser = asyncHandler(async (req, res, next) => {
    const document = await user.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            slug: req.body.slug,
            email: req.body.email,
            phone: req.body.phone,
            profileImage: req.body.profileImage,
            role: req.body.role,
        },
        {
            new: true,
        }
    );

    if (!document) {
        return next(new ApiError(`No document for this id ${req.params.id}`, 404));
    }
    res.status(200).json({ data: document });
});

exports.changePassword = asyncHandler(async (req, res, next) => {
    const document= await user.findByIdAndUpdate(req.params.id,
    {
        password: await bcrypt.hash(req.body.password,12),
        passwordChangedAt: Date.now() 
    },
    {
        new:true
    })

    if(!document){
        return next(new ApiError(`No document for this id ${req.params.id}`, 404))
    }
    res.status(200).json({data:document});
});

// @desc    Delete specific user
// @route   DELETE /api/v1/users/:id
// @access  Private
exports.deleteUser = factory.deleteOne(user);
