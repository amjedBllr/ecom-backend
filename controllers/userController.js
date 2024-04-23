
const User = require('../models/userModel.js')





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
            registrationDate: user.registrationDate
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
        let currentUser = req.user._id
        let role = req.user.role

        if(((['client', 'seller'].includes(role) && (UserId == currentUser)) || role === 'admin')){

            const user = await User.findOne({_id:UserId})

            if(!user){
                return res.status(404).json({message:`Could't find any user`, data:[]})
            }

            const formattedUser = {
                _id: user._id,
                username: user.username ? user.username : null,
                email: user.email,
                role: user.role,
                registrationDate: user.registrationDate
            }

            return res.status(201).json({message:`User was fetched successfully !!`, data:formattedUser})
        }
        else{
            return res.status(401).json({ message: 'Access denied !!', error: `user is not authorized to ${req.method} other users data` });
        }

        
    }
    catch(error){
        res.status(500).json({ message: 'Failed to fetch user !!',data:null, error: error.message })
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

            const formattedUser = {
                _id: user._id,
                username: user.username ? user.username : null,
                email: user.email,
                role: user.role,
                registrationDate: user.registrationDate
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

            const user = await User.findOneAndUpdate({_id:UserId},req.body,{
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
                registrationDate: user.registrationDate
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