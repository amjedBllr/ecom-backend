const Client = require('../models/clientModel.js')
const ObjectId = require('mongodb').ObjectId;



//*get all clients function

const getAllClients = async (req, res) => {

    try {
        const client = await Client.find({});

        if (client.length === 0) {
            return res.status(404).json({ message: 'No client exists currently !!' , error:'could not find any client !' , data:[]});
        }

        return res.status(200).json({message : 'clients were fetched successfully !!' , data: client });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to fetch client',data:null, error: error.message });
    }
}





//* get one client function 

const getClient = async (req, res) => {
    try {
        const { id: clientId } = req.params;
        const currentUser = req.user;
        const role = currentUser.role;

        const client = await Client.findOne({ _id: clientId });

        if (!client) {
            return res.status(404).json({ message: `Could not find any client`, data: [] });
        }

        let formattedclient = {
            _id: client._id,
            userId: client.userId,
            fullname: client.fullname,
            shippingAddress: client.shippingAddress ,
            secondaryShippingAddress: client.secondaryShippingAddress,
            loyaltyPoints: client.loyaltyPoints
        };

        if (role == "client") {
            formattedclient = { ...formattedclient,gender: client.gender,phoneNumber:client.phoneNumber,birthday:client.birthday,creditCardNumber:client.creditCardNumber,paypalNumber:client.paypalNumber,edahabiaNumber:client.edahabiaNumber};
        }

        return res.status(200).json({ message: `client was fetched successfully !!`, data: formattedclient });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to fetch client !!', data: null, error: error.message });
    }
};






//* delete a client function 
//!hadi balak manhtajohach (logically) bsah khliha brk

const deleteClient = async (req,res)=>{
    try{
        let {id:clientId} = req.params
        let currentUser = req.user._id
        let role = req.user.role

        const client = await Client.findOne({ _id: clientId })

        if(!client){
            return res.status(404).json({message:`client do not exist` , data:[]})
        }

        const objectId = new ObjectId(client.userId)


        if(((role==="client" && (objectId.equals(currentUser))) || role == "admin")){

            const client = await Client.findOneAndDelete({_id:clientId})

            
            const formattedclient = {
                _id: client._id,
                userId: client.userId,
                fullname: client.fullname
            }

            return res.status(201).json({message:`client was removed successfully !!`, data:formattedclient})
        }
        else{
            return res.status(401).json({ message: 'Access denied !!', error: `client is not authorized to ${req.method} other client data` });
        }
        
    }
    catch(error){
        return res.status(500).json({ message: 'Failed to remove client !!',data:null, error: error.message })
    }
}










//* patch client function

const patchClient = async (req,res)=>{
    try{
        let {id:clientId} = req.params
        let currentUser = req.user._id
        let role = req.user.role
        const client = await Client.findOne({ _id: clientId })
        const objectId = new ObjectId(client.userId)

        if(((role==="client" && (objectId.equals(currentUser))) || role == "admin")){

            const client = await Client.findOneAndUpdate({_id:clientId},req.body,{
                new: true ,
                runValidators : true
            })
        
            if(!client){
                return res.status(404).json({message:`Could't find any client`, data:[]})
            }
        
            const formattedclient = {
                _id: client._id,
                userId: client.userId,
                fullname: client.fullname
            }
        
            res.status(200).json({message:`client was patched successfully !!`, data:formattedclient})
        }
        else{
            return res.status(401).json({ message: 'Access denied !!', error: `client is not authorized to ${req.method} other client data` });
        }
        
    }
    catch(error){
        return res.status(500).json({ message: 'Failed to remove client !!',data:null, error: error.message })
    }
}






module.exports={getAllClients,getClient,patchClient,deleteClient}