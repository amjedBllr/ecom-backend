const bcrypt = require('bcrypt')
const User = require('../models/userModel.js')



//! regestering user 

const registerUser = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        
        //? Generate salt and hash password
        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedPassword = bcrypt.hashSync(password, salt);

        //? add the user the the database
        let user = await User.create({
            email : email,
            hash: hashedPassword,
            salt: salt,
            role: role,
        })

        res.status(201).json({ message: `User ${user._id} registered successfully !!` , data : {id:user._id,email:user.email} });
    } catch (error) {
        res.status(500).json({ message: 'Failed to register user', error: error.message });
    }
};


const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});

        if (users.length === 0) {
            return res.status(404).json({ message: 'No user exists currently !!' , data:null});
        }

        const formattedUsers = users.map((user) => ({
            _id: user._id,
            username: user.username ? user.username : null,
            email: user.email,
            role: user.role,
            registrationDate: user.registrationDate
        }));

        res.status(200).json({message : 'Users were fetched successfully !!' , data: formattedUsers });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch users',data:null, error: error.message });
    }
}






const getUser = async(req,res)=>{
    try{
        let {id:UserId} = req.params
        const user = await User.findOne({_id:UserId})

        if(!user){
            return res.status(404).json({message:`the id : ${UserId} isn't attached to any user !!`, data:null})
        }

        const formattedUser = {
            _id: user._id,
            username: user.username ? user.username : null,
            email: user.email,
            role: user.role,
            registrationDate: user.registrationDate
        }

        res.status(201).json({message:`User was fetched successfully !!`, data:formattedUser})
    }
    catch(error){
        res.status(500).json({ message: 'Failed to fetch user !!',data:null, error: error.message })
    }
}


const deleteUser = async (req,res)=>{
    try{
        let {id:UserId} = req.params
        const user = await User.findOneAndDelete({_id:UserId})

         if(!user){
            return res.status(404).json({message:`the id : ${UserId} isn't attached to any user !!`, data:null})
        }

        const formattedUser = {
            _id: user._id,
            username: user.username ? user.username : null,
            email: user.email,
            role: user.role,
            registrationDate: user.registrationDate
        }

        res.status(201).json({message:`User was removed successfully !!`, data:formattedUser})
    }
    catch(error){
        res.status(500).json({ message: 'Failed to remove user !!',data:null, error: error.message })
    }
}



//! b9a ghir patch fl controller hada !! 

const patchUser = async (req,res)=>{
    try {
        const {id:UserId} = req.params
        const User = await User.findOneAndUpdate({_id:UserId},req.body,{
            new: true ,
            runValidators : true
        })
        if(!User){
            res.status(404).json({msg:`there ain't no User with the id of : ${UserId}`})
        }
        else res.status(201).json({User})
    } catch (err) {
        res.status(500).json({ message: 'Failed to patch user !!',data:null, error: error.message })
    }
}


module.exports={registerUser,getAllUsers,getUser,patchUser,deleteUser}