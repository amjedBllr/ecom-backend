
const Seller = require('../models/sellerModel.js')




//*get all sellers function

const getAllSellers = async (req, res) => {

    try {
        const seller = await Seller.find({});

        if (seller.length === 0) {
            return res.status(404).json({ message: 'No Seller exists currently !!' , error:'could not find any seller !' , data:[]});
        }

        return res.status(200).json({message : 'seller were fetched successfully !!' , data: seller });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to fetch seller',data:null, error: error.message });
    }
}





//* get one Seller function 

const getSeller = async(req,res)=>{
    try{

        let {id:SellerId} = req.params
        let currentSeller = req.Seller._id
        let role = req.Seller.role

        if(((['client', 'seller'].includes(role) && (SellerId == currentSeller)) || role === 'admin')){

            const Seller = await Seller.findOne({_id:SellerId})

            if(!Seller){
                return res.status(404).json({message:`Could't find any Seller`, data:[]})
            }

            const formattedSeller = {
                _id: Seller._id,
                Sellername: Seller.Sellername ? Seller.Sellername : null,
                email: Seller.email,
                role: Seller.role,
                registrationDate: Seller.registrationDate
            }

            return res.status(201).json({message:`Seller was fetched successfully !!`, data:formattedSeller})
        }
        else{
            return res.status(401).json({ message: 'Access denied !!', error: `Seller is not authorized to ${req.method} other seller data` });
        }

        
    }
    catch(error){
        res.status(500).json({ message: 'Failed to fetch Seller !!',data:null, error: error.message })
    }
}






//* delete a Seller function 

const deleteSeller = async (req,res)=>{
    try{
        let {id:SellerId} = req.params
        let currentSeller = req.Seller._id
        let role = req.Seller.role

        if(((['client', 'seller'].includes(role) && (SellerId == currentSeller)) || role === 'admin')){
            const Seller = await Seller.findOneAndDelete({_id:SellerId})

            if(!Seller){
                return res.status(404).json({message:`Could't find any Seller` , data:[]})
            }

            const formattedSeller = {
                _id: Seller._id,
                Sellername: Seller.Sellername ? Seller.Sellername : null,
                email: Seller.email,
                role: Seller.role,
                registrationDate: Seller.registrationDate
            }

            return res.status(201).json({message:`Seller was removed successfully !!`, data:formattedSeller})
        }
        else{
            return res.status(401).json({ message: 'Access denied !!', error: `Seller is not authorized to ${req.method} other seller data` });
        }
        
    }
    catch(error){
        return res.status(500).json({ message: 'Failed to remove Seller !!',data:null, error: error.message })
    }
}










//* patch Seller function

const patchSeller = async (req,res)=>{
    try {

        let {id:SellerId} = req.params
        let currentSeller = req.Seller._id
        let role = req.Seller.role

        if(((['client', 'seller'].includes(role) && (SellerId == currentSeller)) || role === 'admin')){

            const Seller = await Seller.findOneAndUpdate({_id:SellerId},req.body,{
                new: true ,
                runValidators : true
            })

            if(!Seller){
                return res.status(404).json({message:`Could't find any Seller`, data:[]})
            }
    
            const formattedSeller = {
                _id: Seller._id,
                Sellername: Seller.Sellername ? Seller.Sellername : null,
                email: Seller.email,
                role: Seller.role,
                registrationDate: Seller.registrationDate
            }
    
            res.status(201).json({message:`Seller was patched successfully !!`, data:formattedSeller})

        }
        else{
            return res.status(401).json({ message: 'Access denied !!', error: `Seller is not authorized to ${req.method} other seller data` });
        }


    } catch (error) {
        res.status(500).json({ message: 'Failed to patch Seller !!',data:null, error: error.message })
    }
}






module.exports={getAllSellers,getSeller,patchSeller,deleteSeller}