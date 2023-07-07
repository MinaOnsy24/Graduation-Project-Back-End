const express = require('express')

const { signValidator, loginValidator,forgetPasswordValidator } = require('../utils/validators/authValidator');
const { signup, login,forgetPassword,verifyResetCode,resetPassword } = require('../controllers/authUserController');

const router = express.Router();

router.route('/signup').post(signValidator, signup);
router.route('/login').post(loginValidator, login);
router.route('/forgetPassword').post(forgetPasswordValidator,forgetPassword)
router.route('/resetCode').post(verifyResetCode)
router.route('/resetPassword').put(resetPassword)





module.exports = router;