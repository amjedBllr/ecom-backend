const passport = require('passport')
const bcrypt = require('bcrypt')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/userModel')

const customFields = {
    usernameField: 'email',
    passwordField: 'password'
}

const Verify = async (email, password, cb) => {
    try {
        const user = await User.findOne({ email: email })
        if (!user) { return cb(null, false,{message:`the email of ${email} is not attached to a user`}) }
        const isValid = validPass(password, user.hash, user.salt)
        if (isValid){
            return cb(null, user ,{message:`User have been successfully authenticated !!`})}
        else return cb(null, false , {message:`password is incorrect !!`})
    } catch (error) {
        return cb(error)
    }
}

const validPass = (password, hash) => {
    return bcrypt.compareSync(password, hash)
}


passport.serializeUser((user, cb) => {
    cb(null, user.id)
})

passport.deserializeUser(async (userId, cb) => {
    try {
        const user = await User.findById(userId)
        if (user) cb(null, user)
    } catch (error) {
        cb(error)
    }
})

const strategy = new LocalStrategy(customFields, Verify)

//? using the local strategy !! 
passport.use(strategy)

module.exports = passport




