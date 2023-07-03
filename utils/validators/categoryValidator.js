const { check } = require('express-validator')
const validatorMiddeleware = require('../../middlewares/validatorMiddleware')

// array of rules
exports.getCategoryValidator = [
    check('id').isMongoId().withMessage("invalid category id format"),
    validatorMiddeleware
];

exports.createCategoryValidator = [
  check("name")
      .notEmpty()
      .withMessage('Category required')
      .isLength({min: 3})
      .withMessage('Category name is shorter than 3')
      .isLength({max: 30})
      .withMessage('Category name is lager than 30'),

  
      
      
    validatorMiddeleware
];

exports.updateCategoryValidator = [
  check('id').isMongoId().withMessage("invalid category id format"),
  validatorMiddeleware
];

exports.deleteCategoryValidator = [
  check('id').isMongoId().withMessage("invalid category id format"),
  validatorMiddeleware
];