const mongoose = require('mongoose')

// category schema
const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    unique: true,
    minlength: 3,
    maxlength: 30
  },
  slug: {
    type: String,
    lowercase: true
  },
  
  image: {
    type: String,
    
  }
  
},{
  timestamps: true
}
)

// category model
const CategoryModel = mongoose.model('Category',CategorySchema)

module.exports = CategoryModel