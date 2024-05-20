const Order = require('../models/orderModel.js')
const Client = require('../models/clientModel.js')
const Seller = require('../models/sellerModel.js')
const Product = require('../models/productModel.js')
const ObjectId = require('mongodb').ObjectId;


//* get one Order function 
const getOrder = async (req, res) => {
    //! matvirifish hana id same client ? .. khli nhar khlaf , mnah mach lazma fl presentation , lazma ida rah tbda lkhdma bih sah
    
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
            sellerId: product.sellerId,
            totalPrice: price * orderData.quantity,
            ...orderData
        };

        console.log(data)

        const order = await Order.create(data);

        res.status(201).json({ message: 'Cart Order was created successfully !!', data: order });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to create Order !!', data: null, error: error.message });
    }
};



//* patch Order function
const patchOrder = async (req, res) => {
    try {
        let { id: OrderId } = req.params;
        let currentUser = req.user._id;

        let orderSellerId;
        let userSellerId;

        const order = await Order.findOne({ _id: OrderId });
        if (!order) {
            return res.status(404).json({ message: `Couldn't find any order with this id`, data: [] });
        }

        const product = await Product.findOne({ _id: order.productId });
        if (!product) {
            return res.status(404).json({ message: `Couldn't find any product associated with this order`, data: [] });
        }
        orderSellerId = product.sellerId;

        const seller = await Seller.findOne({ userId: currentUser });
        if (seller) {
            userSellerId = seller._id;

            const objectId = new ObjectId(orderSellerId);
            const samePerson = objectId.equals(userSellerId);

            if (samePerson) {
                const { orderStatus, ...other } = req.body;

                const updatedOrder = await Order.findOneAndUpdate({ _id: OrderId }, { orderStatus }, { new: true, runValidators: true });

                return res.status(200).json({ message: `Order was patched successfully !!`, data: updatedOrder });
            } else {
                return res.status(401).json({ message: 'Access denied !!', error: `Seller is not authorized to ${req.method} other seller data` });
            }
        } else {
            return res.status(401).json({ message: 'Unauthorized', error: `Current user is not a seller` });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Failed to patch Order !!', data: null, error: error.message });
    }
};



module.exports={postOrder,getOrder,patchOrder}