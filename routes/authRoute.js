const express = require('express')

const { signValidator } = require('../utils/validators/authValidator');
const {signup}=require('../controllers/authUserController');

const router = express.Router();

router.route('/signup').post(signValidator,signup)

module.exports = router;