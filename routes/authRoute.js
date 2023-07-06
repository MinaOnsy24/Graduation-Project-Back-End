const express = require('express')

const { signValidator, loginValidator } = require('../utils/validators/authValidator');
const { signup, login } = require('../controllers/authUserController');

const router = express.Router();

router.route('/signup').post(signValidator, signup);
router.route('/login').post(loginValidator, login)


module.exports = router;