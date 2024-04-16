const bcrypt = require('bcrypt')
const passport = require('../middlewares/passport.js')
const User = require('../models/userModel.js')

const registerUser = async (req, res) => {
    try {
        const { email, password, role } = req.body
        
        //? Generate salt and hash password
        const saltRounds = 10
        const salt = bcrypt.genSaltSync(saltRounds)
        const hashedPassword = bcrypt.hashSync(password, salt)

        //? add the user the the database
        let user = await User.create({
            email : email,
            hash: hashedPassword,
            salt: salt,
            role: role,
        })

        res.status(201).json({ message: `User ${user._id} registered successfully !!` , data : {id:user._id,email:user.email} })
    } catch (error) {
        res.status(500).json({ message: 'Failed to register user', error: error.message })
    }
}

const loginUser = (req, res, next) => {
    if(!req.isAuthenticated()){
        passport.authenticate('local', (err, user, info) => {
            if (err) {
                return res.status(500).json({ message: 'Internal server error' , error : info.message});
            }
            if (!user) {
                return res.status(401).json({ message: 'Authentication failed', error : info.message });
            }
            req.logIn(user, (err) => {
                if (err) {
                    return next(err);
                }
                else{
                    return res.status(200).json({ message: 'Login successful' });
                }
                
            });
        })(req, res, next);
    }
    else{
       return res.status(401).json({ message: 'you are already logged in !! , stop messing with the api bud !!' });
    }
};

const logoutUser = (req, res) => {
    if(req.isAuthenticated()){
        req.logout((err) => {
            if (err) {
                return res.status(500).json({ message: 'Logout failed', error: err });
            }
            else{
                return res.status(200).json({ message: 'Logout successful' });
            }
            
        })
    }
   else return res.status(401).json({ message: 'you were not even logged in , stop messing with URLs bud !!' });
};


module.exports={registerUser,loginUser,logoutUser}