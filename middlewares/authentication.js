const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/userModel');

const customFields = {
    usernameField: 'email', // Change the field to 'email'
    passwordField: 'password'
}

const VerifyCB = async (email, password, done) => { // Change 'username' to 'email'
    try {
        const user = await User.findOne({ email: email }); // Find user by email
        if (!user) { return done(null, false); }
        const isValid = validPass(password, user.hash, user.salt);
        if (isValid) return done(null, user);
        else return done(null, false);
    } catch (error) {
        return done(error);
    }
}

const validPass = (password, hash, salt) => {
    if (password === hash) return (true);
    else return (false);
}

const strategy = new LocalStrategy(customFields, VerifyCB); // Use customFields object

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (userId, done) => {
    try {
        const user = await User.findById(userId);
        if (user) done(null, user);
    } catch (error) {
        done(error);
    }
});

passport.use(strategy);

module.exports = passport;
