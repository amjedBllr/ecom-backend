const CartItem = require('../models/cartItemModel.js')
const Client = require('../models/clientModel.js')
const Product = require('../models/productModel.js')
const ObjectId = require('mongodb').ObjectId;


//* get one Item function 
const getCartItem = async (req, res) => {

    //! matvirifish hana id same client ?
    
    let {id:ItemId} = req.params

    try {
        const item = await CartItem.findOne({_id:ItemId})

        if(!item){
            return res.status(404).json({message:`Could't find any cart item`, data:[]})
        }
        
        const product = Product.findOne({_id: item.productId})

        let formattedItem = {
            ...item._doc ,
            sellerId: product.sellerId,
            productName: product.productName ,
            productDescription: product.description,
            photos: product.photos,
        }

        res.status(200).json({message:`Item was fetched successfully !!`, data:formattedItem})

    } catch (error) {
        return res.status(500).json({ message: 'Failed to fetch Item !!' , data:null , error: error.message })
    }

}


//* patch Item function
const postCartItem = async (req,res)=>{


    //! take care fi kolch hna ta9dir taki care fih
    const userId = req.user._id

    const ItemData = req.body 
    try {

        const client = await Client.findOne({userId : userId})

        const product = await Product.findOne({ _id: ItemData.productId });
        //?deleting client-id w total price mnah dok nriglhm hna , gholta la

        let {clientId, ...data} = ItemData

        data = {
            clientId : client._id ,
            totalPrice : ItemData.quantity*product.price,
            ...data 
        }
    
        const item = await CartItem.create(data)

        res.status(201).json({message:`cart item was created successfully !!`, data:item})
        
    } catch (error) {

        return res.status(500).json({ message: 'Failed to create Item !!' , data:null , error: error.message })

    }
}

//* delete a Item function 
const deleteCartItem = async (req,res)=>{
    try{

        let {id:ItemId} = req.params
        let currentUser = req.user._id 
        let ItemClientId
        let userClientId

        const item = await  CartItem.findOne({ _id: ItemId })
        if(item) ItemClientId = item.clientId 
        const client = await Client.findOne({ userId : currentUser })
        if(client) userClientId = client._id 
        const objectId = new ObjectId(ItemClientId)
        const samePerson = objectId.equals(userClientId)
        

        if( samePerson ){

           const item = await CartItem.findOneAndDelete({ _id: ItemId })

           if(!item) return res.status(404).json({message:`Could not find any cart item with this id`, error:'cart item does not exist', data:null})

           return res.status(200).json({message:`cart Item was removed successfully !!`, data:item})
        }
        
        else return res.status(401).json({ message: 'Access denied !!', error: `Client is not authorized to ${req.method} other Client data` });
   }
   catch(error){
       return res.status(500).json({ message: 'Failed to delete Item !!' , data:null , error: error.message })
   }

}


//* patch Item function
const patchCartItem = async (req,res)=>{

    try{

        let {id:ItemId} = req.params
        let currentUser = req.user._id 
        let ItemClientId
        let userClientId

        //? so we can verify if the request sender is the same person who posses the item , rarely happens ... but could happen 
        const item = await  CartItem.findOne({ _id: ItemId })
        if(item) ItemClientId = item.clientId 
        const client = await Client.findOne({ userId : currentUser })
        if(client) userClientId = client._id 
        const objectId = new ObjectId(ItemClientId)
        const samePerson = objectId.equals(userClientId)

         if(samePerson){
            const { clientId , productId , ...updatedFields } = req.body;

            const item = await CartItem.findOneAndUpdate({ _id: ItemId },
            updatedFields,{ new: true, runValidators: true })

            if(!item) return res.status(404).json({message:`Could't find any item with this id`, data:[]})

            return res.status(200).json({message:`Item was patched successfully !!`, data:item})
         }
         
         else return res.status(401).json({ message: 'Access denied !!', error: `Client is not authorized to ${req.method} other Client data` });
    }
    catch(error){
        return res.status(500).json({ message: 'Failed to patch Item !!' , data:null , error: error.message })
    }
}



module.exports={postCartItem,getCartItem,patchCartItem,deleteCartItem}