//? external packages
const express = require('express')
const passport = require('passport')
const cors = require('cors')

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
const sellers = require('./routes/sellerRoute.js')
const clients = require('./routes/clientRoute.js')
const categories = require('./routes/PCRoute.js')
const types = require('./routes/PCTRoute.js')
const products = require('./routes/productRoute.js')
const cartItems = require('./routes/cartItemRoute.js')
const orders = require('./routes/orderRoute.js')

/*
const reviews = require('./routes/reviewRoute.js')
const notifications = require('./routes/notificationRoute.js')
const questions = require('./routes/questionRoute.js')
const reports = require('./routes/reportRoute.js')
const admins = require('./routes/adminRoute.js')...
*/

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(cors({
    origin: ['http://localhost:5173','*'],
    methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD','PATCH','DELETE'],
    credentials: true
  }));

app.use(session)

app.use(passport.initialize());
app.use(passport.session());


//? routes

app.use('/api/v1/auth',auth)
app.use('/api/v1/users',users)
app.use('/api/v1/sellers',sellers)
app.use('/api/v1/clients',clients)
app.use('/api/v1/categories',categories)
app.use('/api/v1/types',types)
app.use('/api/v1/products',products)
app.use('/api/v1/cart-items',cartItems)
app.use('/api/v1/orders',orders)

app.get('/userinfo',(req,res)=>{
    res.json(`${req.user}`)
})



app.use('*',(req,res)=>{res.send('404 , this endpoint do not exist !!')})


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
