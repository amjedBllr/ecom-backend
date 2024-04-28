const Product = require('../models/ProductModel.js')
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

        if(!product){
            return res.status(404).json({message:`Could't find any Product`, data:[]})
        }

        res.status(200).json({message:`Products was fetched successfully !!`, data:products})

    } catch (error) {
        return res.status(500).json({ message: 'Failed to fetch products !!', error: error.message })
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
        const ratings = []
        const rating = 0

        if(reviews){
            ratings = reviews.map(r=>{
                return(r.rating)
            })

              rating = rating.reduce((accumulator, currentValue) => {
                return accumulator + currentValue;
              }, 0);

              rating/=reviews.length
        }

        let formattedProduct = {
            ...product ,
            sellerName : seller.businessName ,
            rating : rating ,
            ratingCount : (reviews)? reviews.length : 0
        }

        res.status(200).json({message:`Product was fetched successfully !!`, data:formattedProduct})

    } catch (error) {
        return res.status(500).json({ message: 'Failed to fetch product !!', error: error.message })
    }

}


//* patch Product function
const postProduct = async (req,res)=>{

}

//* delete a Product function 
const deleteProduct = async (req,res)=>{

}


//* patch Product function
const patchProduct = async (req,res)=>{

}







/**
 *     try{
        let {id:ProductId} = req.params
        let currentUser = req.user._id
        let role = req.user.role
        const Product = await Product.findOne({ _id: ProductId })
        const objectId = new ObjectId(Product.userId)

        if(((role==="Product" && (objectId.equals(currentUser))) || role == "admin")){

            const Product = await Product.findOneAndUpdate({_id:ProductId},req.body,{
                new: true ,
                runValidators : true
            })
        
            if(!Product){
                return res.status(404).json({message:`Could't find any Product`, data:[]})
            }
        
            const formattedProduct = {
                _id: Product._id,
                userId: Product.userId,
                businessName: Product.businessName
            }
        
            res.status(200).json({message:`Product was patched successfully !!`, data:formattedProduct})
        }
        else{
            return res.status(401).json({ message: 'Access denied !!', error: `Product is not authorized to ${req.method} other Product data` });
        }
        
    }
    catch(error){
        return res.status(500).json({ message: 'Failed to remove Product !!',data:null, error: error.message })
    }
 */

module.exports={getManyProducts,postProduct,getProduct,patchProduct,deleteProduct}