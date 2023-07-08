const path = require('path')
const express = require('express')
const morgan = require('morgan')
const databaseConnection = require('./config/connectToDB')
require('dotenv').config()
const ApiError = require('./utils/apiError')
const globalError = require('./middlewares/errorMideleware')
// const userRoute = require('./routes/userRoute')
const cors=require("cors");
const helmet=require("helmet");

// connec to DB
databaseConnection()
// Init app
const app = express()

// Middelware
app.use(express.json())
app.use(express.static(path.join(__dirname,'uploads')))
// if( process.env.NODE_ENV === 'development'){
//   app.use(morgan('dev'))
//   console.log(`mode: ${process.env.NODE_ENV}`)
// }
app.use(helmet());

app.use(cors({
  origin:"http://localhost:3000"
}))

//routes
app.use('/api/category',require('./routes/categoryRoute'))
app.use('/api/products',require('./routes/productRoute'))
app.use('/api/users', require('./routes/user2Route'))
app.use('/api/auth', require('./routes/authRoute'))



app.all('*' , (req,res,next) =>{
  next(new ApiError(`can not find this route: ${req.originalUrl}`,400))
})

// global error handel middelware inside express
app.use(globalError)

// run server
const PORT = process.env.PORT || 8000 
const server = app.listen(PORT, () =>{
  console.log(`Server is running on Port ${PORT}`);
})

// hundel errors outside exress
process.on('unhandledRejection',(err) =>{
  console.error(`unhandledRejection Errors: ${err.name} | ${err.message}`)
  server.close(() =>{
    console.error("Server closed");
    process.exit(1)
  })
})