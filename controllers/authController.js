const bcrypt = require('bcrypt')
const passport = require('../middlewares/passport.js')
const User = require('../models/userModel.js')
const Seller = require('../models/sellerModel.js')
const Client = require('../models/clientModel.js')
const uploadImage = require('../utils/firebaseFIleSystem.js')

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
            fullName,phoneNumber,DeliveryAddress,paymentAccountNumber,paymentAccountType
        } = req.body

        const client = await Client.findOne({ userId: req.user._id});
        const seller = await Client.findOne({ userId: req.user._id });

        if (client||seller) {
            return res.status(400).json({ message: `could not register client`, error:`User already registered` });
        }

        //? add client to database
        else{
            let client = await Client.create({
                userId:req.user._id,
                fullname: fullName,
                phoneNumber: phoneNumber,
                shippingAddress: DeliveryAddress,
                creditCardNumber: ((paymentAccountType=='creditCard')?paymentAccountNumber:null),
                paypalNumber: ((paymentAccountType=='paypal')?paymentAccountNumber:null),
                edahabiaNumber: ((paymentAccountType=='edahabia')?paymentAccountNumber:null),
            })

            res.status(201).json({ message: `client ${client._id} registered successfully !!` , data : {client} })
        }

        }
        
    catch (error) {
        res.status(500).json({ message: 'Failed to register client', error: error.message })
    }
}




const registerSeller = async (req, res) => {

    try {
        const idCard = req.files['identityCard']
        const addInfo = req.files['additionalInformation']

        const client = await Client.findOne({ userId: req.user._id});
        const seller = await Client.findOne({ userId: req.user._id });

        if (client||seller) {
            return res.status(400).json({ message: `could not register seller`, error:`User already registered` });
        }
        //? add seller to the database 

        else{
            
            let idUrl = (idCard)? await uploadImage('seller information',idCard[0]) : null
            let addUrl = (addInfo)? await uploadImage('seller information',addInfo[0]) : null

            let seller = await Seller.create({
                ...req.body ,
                userId: req.user._id,
                identityCard : (idUrl)? idUrl:null ,
                additionalInformation: (addUrl)?addUrl:null
            })
    
                res.status(201).json({ message: `Seller ${seller._id} registered successfully !!` , data : {seller} })
        }

        }

    catch (error) {
        res.status(500).json({ message: 'Failed to register seller', error: error.message })
    }
}





const userinfo = async (req, res) => {
    const currentUser = req.user._id;

    try {
        const user = await User.findOne({ _id: currentUser });

        let info;
        if (user.role === "seller") {
            info = {
                user_info:user,
                seller_info: await Seller.findOne({ userId: currentUser })
            };
        } else if (user.role === "client") {
            info = {
                user_info:user,
                client_info: await Client.findOne({ userId: currentUser })
            };
        } else {
            info = {user_info:user}
        }

        return res.status(200).json({ message: "Info fetched successfully!", data: info });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};





const loginUser = async (req, res, next) => {
    try {
        if (!req.isAuthenticated()) {
            passport.authenticate('local', async (err, user, info) => {
                if (err) {
                    return res.status(500).json({ message: 'Internal server error', error: info.message });
                }
                if (!user) {
                    return res.status(401).json({ message: 'Authentication failed', error: info.message });
                }
                req.logIn(user, async (err) => {
                    if (err) {
                        return next(err);
                    } else {
                        try {
                            let client = await Client.findOne({ userId: user._id });
                            let seller = await Seller.findOne({ userId: user._id });
                            let data = { user_id: user._id, email: user.email, role: user.role };

                            if (client) data = { ...data, client_id: client._id };
                            if (seller) data = { ...data, seller_id: seller._id };

                            console.log(`user ${user._id} logged in !`);
                            return res.status(200).json({ message: 'Login successful', data: data });
                        } catch (error) {
                            return res.status(500).json({ message: 'Internal server error', error: error.message });
                        }
                    }
                });
            })(req, res, next);
        } else {
            return res.status(401).json({ message: 'You are already logged in!! Stop messing with the API bud!!' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message });
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


module.exports={registerUser,registerClient,registerSeller,loginUser,logoutUser,userinfo}