//? external packages
const { urlencoded } = require('body-parser')
const express = require('express')
require('dotenv').config()

//? internal packages
const connectDb = require('./db/connect.js')

//? routers
const users = require('./routes/userRoute.js')





const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))


//? routes
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
