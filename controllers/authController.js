const bcrypt = require('bcrypt')
const passport = require('../middlewares/passport.js')
const User = require('../models/userModel.js')
const Seller = require('../models/sellerModel.js')
const Client = require('../models/clientModel.js')
const uploadImage = require('../utils/firebaseFIleSystem.js')
const nodemailer = require('nodemailer');

require('dotenv').config()

const registerUser = async (req, res) => {
    try {
        
        const { email, password, role } = req.body

        const pfp = (req.file)? await uploadImage('profile pictures',req.file) : null ;

        //?check if the email already exists in the database
        let Email = await User.findOne({email:email})
        if(Email) {return res.status(401).json({ message: `Could not register the user`, error: `this email is already attached to a user !!` })} 

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
            pfp:pfp,
        })

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS,
            },
          });

          const mailOptions = {
            from: process.env.SMTP_USER,
            to: email,
            subject: 'Email Verification',
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e2e2; border-radius: 10px;">
              <div style="text-align: center;">
                <img src="https://whatemoji.org/wp-content/uploads/2020/07/Waving-Hand-Emoji.png" alt="Logo" style="width: 150px; margin-bottom: 20px;">
              </div>
              <h1 style="color: #333; text-align: center;">Welcome to SouqKantra!</h1>
              <p style="font-size: 16px; color: #555;">Dear User,</p>
              <p style="font-size: 16px; color: #555;">Thank you for registering with SouqKantra. To complete your registration, please click the link below to verify your email address:</p>
              <div style="text-align: center; margin: 20px 0;">
                <a href="${process.env.SERVER_URL}/api/v1/auth/verify/${user._id}" style="background-color: #007bff; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a>
              </div>
              <p style="font-size: 16px; color: #555;">If you did not register for this account, please ignore this email.</p>
              <p style="font-size: 16px; color: #555;">Best Regards,<br>SouqKantra Team</p>
              <hr style="border-top: 1px solid #e2e2e2;">
              <p style="font-size: 12px; color: #999; text-align: center;">&copy; 2024 SouqKantra. All rights reserved.</p>
            </div>
          `,
          };

          transporter.sendMail(mailOptions)

        res.status(201).json({ message: `User ${user._id} registered successfully , check your email to verify your account !!` , data : {id:user._id,email:user.email,pfp:user.pfp} })
    } catch (error) {
        res.status(500).json({ message: 'Failed to register user', error: error.message })
    }
}




const registerClient = async (req, res) => {

    try {
        const client = await Client.findOne({ userId: req.user._id});
        const seller = await Client.findOne({ userId: req.user._id });

        if (client||seller) {
            return res.status(400).json({ message: `could not register client`, error:`User already registered` });
        }

        //? add client to database
        else{
            let client = await Client.create({...req.body,userId: req.user._id,})

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

const verifyUser = async (req, res) => {

    const {id:userId} = req.params ;

    try {
            const user = await User.findOneAndUpdate({_id:userId},{accountStatus:'verified'},{
                new: true ,
                runValidators : true
            })
            return res.status(201).send(`
            <!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Verification Successful!</title>
                    <style>
                        body {
                            font-family: sans-serif;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            min-height: 100vh;
                            background-color: #f0f0f0;
                        }
                        
                        .container {
                            background-color: #fff;
                            padding: 30px;
                            border-radius: 5px;
                            box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1);
                            text-align: center;
                        }
                        
                        .message {
                            font-size: 20px;
                            margin-bottom: 15px;
                            color: #3c763d;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <p class="message">Your email was successfully verified!</p>
                    </div>
            </body>
            </html>
            `);
        }
    catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

module.exports={registerUser,registerClient,registerSeller,loginUser,logoutUser,userinfo,verifyUser}