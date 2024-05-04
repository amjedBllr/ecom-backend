const Seller = require('../models/sellerModel.js')
const Product = require('../models/productModel.js')
const Order = require('../models/orderModel.js')
const ObjectId = require('mongodb').ObjectId;
const uploadImage = require('../utils/firebaseFIleSystem.js');


//*get all sellers function

const getAllSellers = async (req, res) => {

    try {
        const seller = await Seller.find({});

        if (seller.length === 0) {
            return res.status(404).json({ message: 'No Seller exists currently !!' , error:'could not find any seller !' , data:[]});
        }

        return res.status(200).json({message : 'sellers were fetched successfully !!' , data: seller });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to fetch seller',data:null, error: error.message });
    }
}





//* get one Seller function 

const getSeller = async (req, res) => {
    try {
        const { id: SellerId } = req.params;
        const currentUser = req.user;
        const role = currentUser.role;

        const seller = await Seller.findOne({ _id: SellerId });

        if (!seller) {
            return res.status(404).json({ message: `Could not find any Seller`, data: [] });
        }

        let formattedSeller = {
            _id: seller._id,
            userId: seller.userId,
            sellerType: seller.sellerType,
            businessName: seller.businessName,
            businessAddress: seller.businessAddress,
            businessEmail: seller.businessEmail,
            businessPhone: seller.businessPhone,
            creditCardActivity: seller.creditCardActivity,
            paypalActivity: seller.paypalActivity,
            edahabiaActivity: seller.edahabiaActivity,
            averageRating: Seller.averageRating,
            totalReviews: Seller.totalReviews,
        };

        if (role == "admin") {
            formattedSeller = { ...formattedSeller, commerceRegisterNumber: seller.commerceRegisterNumber, identityCard: seller.identityCard, additionalInformation: seller.additionalInformation };
        }

        if (role == "seller") {
            formattedSeller = { ...formattedSeller, commerceRegisterNumber: seller.commerceRegisterNumber, creditCardNumber: seller.creditCardNumber, paypalNumber: seller.paypalNumber, edahabiaNumber: seller.edahabiaNumber };
        }

        return res.status(200).json({ message: `Seller was fetched successfully !!`, data: formattedSeller });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to fetch Seller !!', data: null, error: error.message });
    }
};






//* delete a Seller function 
//!hadi balak manhtajohach (logically) bsah khliha brk

const deleteSeller = async (req,res)=>{
    try{
        let {id:SellerId} = req.params
        let currentUser = req.user._id
        let role = req.user.role
        const seller = await Seller.findOne({ _id: SellerId })

        if(!seller){
            return res.status(404).json({message:`Seller do not exist` , data:[]})
        }

        const objectId = new ObjectId(seller.userId)


        if(((role==="seller" && (objectId.equals(currentUser))) || role == "admin")){

            const seller = await Seller.findOneAndDelete({_id:SellerId})

            
            const formattedSeller = {
                _id: seller._id,
                userId: seller.userId,
                businessName: seller.businessName
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
    try{
        let {id:SellerId} = req.params
        let currentUser = req.user._id
        let role = req.user.role
        const seller = await Seller.findOne({ _id: SellerId })
        const objectId = new ObjectId(seller.userId)

        if(((role==="seller" && (objectId.equals(currentUser))) || role == "admin")){
            
            const { userId, ...updatedFields } = req.body;

            const seller = await Seller.findOneAndUpdate({_id:SellerId},updatedFields,{
                new: true ,
                runValidators : true
            })
        
            if(!seller){
                return res.status(404).json({message:`Could't find any seller`, data:[]})
            }
        
            const formattedSeller = {
                _id: seller._id,
                userId: seller.userId,
                businessName: seller.businessName
            }
        
            res.status(200).json({message:`Seller was patched successfully !!`, data:formattedSeller})
        }
        else{
            return res.status(401).json({ message: 'Access denied !!', error: `Seller is not authorized to ${req.method} other seller data` });
        }
        
    }
    catch(error){
        return res.status(500).json({ message: 'Failed to patch Seller !!',data:null, error: error.message })
    }
}


const getSellerProducts = async (req, res) => {
    let { id: SellerId } = req.params;
    try {
        let products = await Product.find({ sellerId: SellerId });

        if (!products || products.length === 0) {
            return res.status(404).json({ message: `Couldn't find any products of this seller`, data: [] });
        }

        res.status(200).json({ message: `Seller's products were fetched successfully !!`, data: products });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to fetch products !!', data: null, error: error.message });
    }
};


//? well it's clear from the name but , we'll get the orders of a seller , literally ain't no body even getting access to it but him !!

const getSellerOrders = async (req, res) => {
    try {
        let currentUser = req.user._id;
        let seller = await Seller.findOne({ userId: currentUser });

        if (!seller) {
            return res.status(404).json({ message: "Client not found", data: [] });
        }

        let sellerId = seller._id; // Use the seller's ObjectId

        let orders = await Order.find({ sellerId: sellerId });

        if (!orders || orders.length <= 0) {
            return res.status(404).json({ message: "Couldn't find any orders of this seller", data: [] });
        }

        return res.status(200).json({ message: "Seller orders were fetched successfully !!", data: orders });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to fetch orders !!', data: null, error: error.message });
    }
};

module.exports={getAllSellers,getSeller,patchSeller,deleteSeller,getSellerProducts,getSellerOrders}