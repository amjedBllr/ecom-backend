const bcrypt = require('bcrypt')
const passport = require('../middlewares/passport.js')
const User = require('../models/userModel.js')
const Seller = require('../models/sellerModel.js')
const Client = require('../models/clientModel.js')



const registerUser = async (req, res) => {
    try {
        const { email, password, role } = req.body


        //?check if the email already exists in the database
        let Email = await User.findOne({email:email})
        if(Email) {return res.json({ message: `Could not register the user`, error: `this email is already attached to a user !!` })} 

        //? Generate salt and hash password
        const saltRounds = 10
        const salt = bcrypt.genSaltSync(saltRounds)
        const hashedPassword = bcrypt.hashSync(password, salt)

        //? add the user to the database
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




const registerClient = async (req, res) => {

    try {
        const {
            id,fullName,phoneNumber,DeliveryAddress,paymentAccountNumber,paymentAccountType
        } = req.body

        //? add client to database

        let client = await Client.create({
                userId:id ,
                fullname: fullName,
                phoneNumber: phoneNumber,
                shippingAddress: DeliveryAddress,
                creditCardNumber: ((paymentAccountType=='creditCard')?paymentAccountNumber:null),
                paypalNumber: ((paymentAccountType=='paypal')?paymentAccountNumber:null),
                edahabiaNumber: ((paymentAccountType=='edahabia')?paymentAccountNumber:null),
            })

            res.status(201).json({ message: `User ${client._id} registered successfully !!` , data : {client} })
        }

    catch (error) {
        res.status(500).json({ message: 'Failed to register client', error: error.message })
    }
}




const registerSeller = async (req, res) => {

    try {
        const {
            id,type,name,businessPhoneNumber,businessEmail,address,paymentAccountNumber,paymentAccountType,identification,commerceRegisterNumber
        } = req.body

        //? add seller to the database 

        let seller = await Seller.create({
            userId: id,
            sellerType: type ,
            businessName: name,
            businessAddress: address,
            businessEmail: businessEmail,
            businessPhone: businessPhoneNumber,
            creditCardActivity: ((paymentAccountType=='creditCard')?true:false),
            paypalActivity: ((paymentAccountType=='paypal')?true:false),
            edahabiaActivity: ((paymentAccountType=='edahabia')?true:false),
            creditCardNumber: ((paymentAccountType=='creditCard')?paymentAccountNumber:null),
            paypalNumber: ((paymentAccountType=='paypal')?paymentAccountNumber:null),
            edahabiaNumber: ((paymentAccountType=='edahabia')?paymentAccountNumber:null),
            commerceRegisterNumber: commerceRegisterNumber,
            identityCard: identification,
        })

            res.status(201).json({ message: `User ${seller._id} registered successfully !!` , data : {seller} })
        }

    catch (error) {
        res.status(500).json({ message: 'Failed to register client', error: error.message })
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
                    console.log(`user ${user._id} logged in !`)
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


module.exports={registerUser,registerClient,registerSeller,loginUser,logoutUser}