const express = require('express')
const mongoose = require('mongoose')

const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')

// routes
const authRoute = require('./routes/authRoute')
const foodRoute = require('./routes/foodRoute')

const app = express()

// loading environment variables
dotenv.config({
  path: '../',
})

const PORT = process.env.PORT || 4000
const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/rating-task'

// ------------------ middlewares -----------------

// parse incomming data into json and response json data to client
app.use(express.json())

//  parse cookie from client
app.use(cookieParser())

//  routes
app.use('/api/auth', authRoute)
app.use('/api/foods', foodRoute)


// ------------------ xxxxxx middleware ---------------

//  creaing mongodb connection 
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server started on port ${PORT}`)
      console.log('mongodb connected')
    })
  })
  .catch((err) =>
    console.log(`error while creating mongodb connection :- ${err}`),
  )
