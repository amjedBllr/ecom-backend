const session = require('express-session')
const MongoStore = require('connect-mongo')
require('dotenv').config()

const sessionMiddleware = session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60000 * 24 *3 }, //? store for 3 days
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URL })
    })

module.exports = sessionMiddleware

