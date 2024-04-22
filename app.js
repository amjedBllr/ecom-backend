//? external packages
const express = require('express')
const passport = require('passport')

//? utils
require('dotenv').config()
require('./utils/sessionCleanup.js')


//? internal packages
const connectDb = require('./db/connect.js')
const session = require('./middlewares/session.js')
const restrict = require('./middlewares/authorization.js')

//? routers
const users = require('./routes/userRoute.js')
const auth = require('./routes/authRoute.js')




const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(session)

app.use(passport.initialize());
app.use(passport.session());


//? routes

app.use('/api/v1/auth',auth)
app.use('/api/v1/users',users)



const port = process.env.PORT || 3000

//? Running the server after a successful db connection
;( async()=>{
    try {
        await connectDb(process.env.MONGO_URL)
        app.listen(port , ()=>{
            console.log(`Server is running on port ${port}`)
        })
    } catch (error) {
        console.log(error)
    }
})()
