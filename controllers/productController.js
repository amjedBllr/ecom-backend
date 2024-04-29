const Product = require('../models/productModel.js')
const Seller = require('../models/sellerModel.js')
const Review = require('../models/reviewModel.js')
const ObjectId = require('mongodb').ObjectId;



//*get many Products function
const getManyProducts = async (req, res) => {
    
    const {name, category, type, discount} = req.query 

    let conditions = {}

    if(name){
        if(name!=="" && name!==" " && name!==null && name!==undefined ) conditions = { ...conditions, productName: { $regex: name, $options: 'i' } };
    }
    
    if(category){
        if(category!=="" && category!==" " && category!==null && category!==undefined ) conditions = { ...conditions, category: { $regex: category, $options: 'i' } };

        //?type could not be defined if the category wasn't !!
        if(type){
            if(type!=="" && type!==" " && type!==null && type!==undefined ) conditions = { ...conditions, categoryType: { $regex: type, $options: 'i' } };
        } 
    }

    if(discount){
        if(discount!==null && discount!==undefined ) conditions = { ...conditions, onDiscount : discount };
    }

    try {
        const products = await Product.find(conditions)

        if(products.length<=0){
            return res.status(404).json({message:`Could't find any Products`, data:[]})
        }

        res.status(200).json({message:`Products was fetched successfully !!`, data:products})

    } catch (error) {
        return res.status(500).json({ message: 'Failed to fetch products !!' , data:null , error: error.message })
    }

}


//* get one Product function 
const getProduct = async (req, res) => {

    let {id:ProductId} = req.params

    try {
        const product = await Product.findOne({_id:ProductId})

        if(!product){
            return res.status(404).json({message:`Could't find any Product`, data:[]})
        }

        const seller = await Seller.findOne({_id : product.sellerId})
        const reviews = await Review.find({productId : product._id})
        let ratings = []
        let rating = 0

        if(reviews.length>0){
            ratings = reviews.map(r=>{
                return(r.rating)
            })

              rating = ratings.reduce((accumulator, currentValue) => {
                return accumulator + currentValue;
              }, 0);

              rating/=reviews.length
        }

        let formattedProduct = {
            ...product._doc ,
            sellerName : seller.businessName ,
            rating : (reviews) ? rating : 0,
            ratingCount : (reviews)? reviews.length : 0
        }

        res.status(200).json({message:`Product was fetched successfully !!`, data:formattedProduct})

    } catch (error) {
        return res.status(500).json({ message: 'Failed to fetch product !!' , data:null , error: error.message })
    }

}


//* patch Product function
const postProduct = async (req,res)=>{

    const userId = req.user._id
    const productData = req.body 
    try {

        const seller = await Seller.findOne({userId : userId})

        let {sellerId, ...data} = productData

        data = {
            sellerId : seller._id ,
            ...data
        }
    
        const product = await Product.create(data)

        res.status(201).json({message:`Product was created successfully !!`, data:product})
        
    } catch (error) {

        return res.status(500).json({ message: 'Failed to create product !!' , data:null , error: error.message })

    }
}

//* delete a Product function 
const deleteProduct = async (req,res)=>{
    try{

        let {id:ProductId} = req.params
        let currentUser = req.user._id 
        let role = req.user.role 
        let productSellerId
        let userSellerId

        const product = await Product.findOne({ _id: ProductId })
        if(product) productSellerId = product.sellerId 
        const seller = await Seller.findOne({ userId : currentUser })
        if(seller) userSellerId = seller._id 
        const objectId = new ObjectId(productSellerId)
        const samePerson = objectId.equals(userSellerId)
        

        if( samePerson || role === "admin"){

           const product = await Product.findOneAndDelete({ _id: ProductId })

           if(!product) return res.status(404).json({message:`Could not find any product with this id`, error:'product does not exist', data:null})

           return res.status(200).json({message:`Product was removed successfully !!`, data:product})
        }
        
        else return res.status(401).json({ message: 'Access denied !!', error: `Seller is not authorized to ${req.method} other seller data` });
   }
   catch(error){
       return res.status(500).json({ message: 'Failed to delete product !!' , data:null , error: error.message })
   }

}


//* patch Product function
const patchProduct = async (req,res)=>{

    try{

         let {id:ProductId} = req.params
         let currentUser = req.user._id 
         let productSellerId
         let userSellerId
 
         const product = await Product.findOne({ _id: ProductId })
         if(product) productSellerId = product.sellerId 
         const seller = await Seller.findOne({ userId : currentUser })
         if(seller) userSellerId = seller._id 
         const objectId = new ObjectId(productSellerId)
         const samePerson = objectId.equals(userSellerId)

         if(objectId.equals(userSellerId)){
            const { sellerID, ...updatedFields } = req.body;

            const product = await Product.findOneAndUpdate({ _id: ProductId },
            updatedFields,{ new: true, runValidators: true })

            return res.status(200).json({message:`Product was patched successfully !!`, data:product})
         }
         
         else return res.status(401).json({ message: 'Access denied !!', error: `Seller is not authorized to ${req.method} other seller data` });
    }
    catch(error){
        return res.status(500).json({ message: 'Failed to patch product !!' , data:null , error: error.message })
    }
}



module.exports={getManyProducts,postProduct,getProduct,patchProduct,deleteProduct}