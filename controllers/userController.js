
const User = require('../models/userModel.js')
const Seller= require('../models/sellerModel.js')
const Client = require('../models/clientModel.js')
const uploadImage = require('../utils/firebaseFIleSystem.js');

//*get all users function

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});

        if (users.length === 0) {
            return res.status(404).json({ message: 'Could not find any user !' , data:[]});
        }

        const formattedUsers = users.map((user) => ({
            _id: user._id,
            username: user.username ? user.username : null,
            email: user.email,
            role: user.role,
            registrationDate: user.registrationDate,
            pfp:user.pfp,
            accountStatus : user.accountStatus
        }));

        res.status(200).json({message : 'Users were fetched successfully !!' , data: formattedUsers });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch users',data:null, error: error.message });
    }
}





//* get one user function 

const getUser = async(req,res)=>{
    try{

        let {id:UserId} = req.params
        let role = req.user.role

            const user = await User.findOne({_id:UserId})

            let formattedUser = {
                _id: user._id,
                username: user.username ? user.username : null,
                email: user.email,
                role: user.role,
                registrationDate: user.registrationDate
            }

            if (user.role==='seller'){
                const seller = await Seller.findOne({userId:user._id})
                formattedUser = {...formattedUser ,"seller_id":seller._id}
            }

            if (user.role==='client'){
                const client = await Client.findOne({userId:user._id})
                formattedUser = {...formattedUser ,"client_id":client._id}
            }

            if(!user){
                return res.status(404).json({message:`Could't find any user`, data:[]})
            }

            else return res.status(200).json({message:`User was fetched successfully !!`, data:formattedUser})
        

        
    }
    catch(error){
        res.status(500).json({ message: 'Failed to fetch user !!', error: error.message })
    }
}






//* delete a user function 

const deleteUser = async (req,res)=>{
    try{
        let {id:UserId} = req.params
        let currentUser = req.user._id
        let role = req.user.role

        if(((['client', 'seller'].includes(role) && (UserId == currentUser)) || role === 'admin')){
            const user = await User.findOneAndDelete({_id:UserId})

            if(!user){
                return res.status(404).json({message:`Could't find any user` , data:[]})
            }

            let formattedUser = {
                _id: user._id,
                username: user.username ? user.username : null,
                email: user.email,
                role: user.role,
                registrationDate: user.registrationDate
            }

            if (user.role==='seller'){
                const seller = await Seller.findOneAndDelete({userId:user._id})
                formattedUser = {...formattedUser ,"seller_id":seller._id}
            }

            if (user.role==='client'){
                const client = await Client.findOneAndDelete({userId:user._id})
                formattedUser = {...formattedUser ,"client_id":client._id}
            }

            return res.status(201).json({message:`User was removed successfully !!`, data:formattedUser})
        }
        else{
            return res.status(401).json({ message: 'Access denied !!', error: `user is not authorized to ${req.method} other users data` });
        }
        
    }
    catch(error){
        return res.status(500).json({ message: 'Failed to remove user !!',data:null, error: error.message })
    }
}










//* patch user function

const patchUser = async (req,res)=>{
    try {

        let {id:UserId} = req.params
        let currentUser = req.user._id
        let role = req.user.role

        if(((['client', 'seller'].includes(role) && (UserId == currentUser)) || role === 'admin')){

            const pfp = (req.file)? await uploadImage('profile pictures',req.file) : null ;

            const user = await User.findOneAndUpdate({_id:UserId},{...req.body , pfp},{
                new: true ,
                runValidators : true
            })

            if(!user){
                return res.status(404).json({message:`Could't find any user`, data:[]})
            }

    
            const formattedUser = {
                _id: user._id,
                username: user.username ? user.username : null,
                email: user.email,
                role: user.role,
                registrationDate: user.registrationDate,
                pfp:pfp
            }
    
            res.status(201).json({message:`User was patched successfully !!`, data:formattedUser})

        }
        else{
            return res.status(401).json({ message: 'Access denied !!', error: `user is not authorized to ${req.method} other users data` });
        }


    } catch (error) {
        res.status(500).json({ message: 'Failed to patch user !!',data:null, error: error.message })
    }
}


module.exports={getAllUsers,getUser,patchUser,deleteUser}