const Order = require('../models/orderModel.js')
const Client = require('../models/clientModel.js')
const Seller = require('../models/sellerModel.js')
const Product = require('../models/productModel.js')
const ObjectId = require('mongodb').ObjectId;


//* get one Order function 
const getOrder = async (req, res) => {
    //! matvirifish hana id same client ?
    
    let {id:OrderId} = req.params

    try {
        const order = await Order.findOne({_id:OrderId})

        if(!order){
            return res.status(404).json({message:`Could't find any order`, data:[]})
        }
        

        const product = Product.findOne({_id: order.productId})

        let formattedOrder = {
            ...order._doc ,
            sellerId: product.sellerId,
            productName: product.productName ,
            productDescription: product.description,
            photos: product.photos,
        }

        res.status(200).json({message:`Order was fetched successfully !!`, data:formattedOrder})

    } catch (error) {
        return res.status(500).json({ message: 'Failed to fetch Order !!' , data:null , error: error.message })
    }

}

//? create an order

const postOrder = async (req, res) => {
    const userId = req.user._id;
    const orderData = req.body;

    try {
        const client = await Client.findOne({ userId: userId });
        const product = await Product.findOne({ _id: orderData.productId });

        if (!product) {
            throw new Error('There is no product with such id');
        }

        const price = product.onDiscount ? product.discountedPrice : product.price;

        if (orderData.quantity <= 0 || !Number.isInteger(orderData.quantity)) {
            throw new Error('Invalid quantity');
        }

        const data = {
            clientId: client._id,
            totalPrice: price * orderData.quantity,
            ...orderData
        };

        const order = await Order.create(data);

        res.status(201).json({ message: 'Cart Order was created successfully !!', data: order });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to create Order !!', data: null, error: error.message });
    }
};



//* patch Order function
const patchOrder = async (req,res)=>{

    try{

        let {id:OrderId} = req.params
        let currentUser = req.user._id 

        let orderSellerId
        let userSellerId

        //? so we can verify if the request sender is the same seller of the product in the order, rarely happens ... but could happen 

        const order = await  order.findOne({ _id: OrderId })
         if(order) {
            const product = await Product.findOne({_id:order.productId})
            orderSellerId = product.sellerId 
         }
        const seller = await Seller.findOne({ userId : currentUser })
        if(seller) userSellerId = seller._id 
        const objectId = new ObjectId(orderSellerId)
        const samePerson = objectId.equals(userSellerId)

         if(samePerson){
            const { orderStatus , ...other } = req.body;

            const order = await Order.findOneAndUpdate({ _id: OrderId },
            orderStatus,{ new: true, runValidators: true })

            if(!order) return res.status(404).json({message:`Could't find any order with this id`, data:[]})

            return res.status(200).json({message:`Order was patched successfully !!`, data:Order})
         }
         
         else return res.status(401).json({ message: 'Access denied !!', error: `Seller is not authorized to ${req.method} other seller data` });
    }
    catch(error){
        return res.status(500).json({ message: 'Failed to patch Order !!' , data:null , error: error.message })
    }
}



module.exports={postOrder,getOrder,patchOrder}