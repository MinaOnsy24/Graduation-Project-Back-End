const express = require('express')


const { getUsers,getUser,createUser,updateUser,deleteUser, uploadUserImage, resizeImage } = 
require('../controllers/userController')
// const { getCategoryValidator,createCategoryValidator,updateCategoryValidator,deleteCategoryValidator } = 
// require('../utils/validators/categoryValidator')


const router = express.Router()
router.route('/')
.get(getUsers)
.post(uploadUserImage,
    resizeImage,
    createUser)

router.route("/:id")
.get(getUser)
.put(updateUser)
.delete(deleteUser)


module.exports = router