const Product = require('../models/productModel.js')
const Seller = require('../models/sellerModel.js')
const Review = require('../models/reviewModel.js')
const ObjectId = require('mongodb').ObjectId;
const uploadImage = require('../utils/firebaseFIleSystem.js');


//*get many Products function
const getManyProducts = async (req, res) => {
    const { name, category, type, discount, minPrice, maxPrice, page = 1, limit = 10 } = req.query;

    let conditions = {};

    if (name && name.trim()) {
        conditions = { ...conditions, productName: { $regex: name, $options: 'i' } };
    }

    if (category && category.trim()) {
        conditions = { ...conditions, category: { $regex: category, $options: 'i' } };

        if (type && type.trim()) {
            conditions = { ...conditions, categoryType: { $regex: type, $options: 'i' } };
        }
    }

    if (discount !== null && discount !== undefined) {
        conditions = { ...conditions, onDiscount: true };
    }

    if (minPrice !== undefined) {
        conditions = { ...conditions, price: { $gte: minPrice } };
    }
    
    if (maxPrice !== undefined) {
        conditions = { ...conditions, price: { $lte: maxPrice } };
    }
    

    const pageNumber = parseInt(page, 10) || 1;
    const pageSize = parseInt(limit, 10) || 10;
    const skip = (pageNumber - 1) * pageSize;

    try {
        const products = await Product.find(conditions).skip(skip).limit(pageSize);
        const totalProducts = await Product.countDocuments(conditions);

        if (products.length <= 0) {
            return res.status(404).json({ message: `Couldn't find any Products`, data: [] });
        }

        res.status(200).json({
            message: `Products were fetched successfully !!`,
            data: products,
            currentPage: pageNumber,
            totalPages: Math.ceil(totalProducts / pageSize),
            totalProducts: totalProducts
        });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to fetch products !!', data: null, error: error.message });
    }
};



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
const postProduct = async (req, res) => {
    const userId = req.user._id;
    const productData = req.body;

    try {
        const seller = await Seller.findOne({ userId: userId });

        let photos = [];

        if (req.files && req.files.length > 0) {
            photos = await Promise.all(req.files.map(async (photo) => {
                return await uploadImage('products', photo);
            }));
        }

        const { sellerId, ...data } = productData;

        let colors = data.colors || null
        let sizes = data.sizes || null
        let dimensions = data.dimensions || null

        if(colors) colors = colors.split(';').map(item => item.trim());
        if(sizes) sizes = sizes.split(';').map(item => item.trim());
        if(dimensions) dimensions = dimensions.split(';').map(item => item.trim());


        const newData = {
            sellerId: seller._id,
            ...data,
            colors:colors,
            sizes:sizes,
            dimensions:dimensions,
            photos: photos
        };

        const product = await Product.create(newData);

        res.status(201).json({ message: 'Product was created successfully!', data: product });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to create product!', data: null, error: error.message });
    }
};


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


const getProductReviews = async (req, res) => {
    let { id: ProductId } = req.params;
    try {
        let reviews = await Review.find({ productId: ProductId });
        if (!reviews || reviews.length === 0) {
            return res.status(404).json({ message: `Couldn't find any reviews of this product`, data: [] });
        }
        res.status(200).json({ message: `Product's reviews were fetched successfully !!`, data: reviews });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to fetch reviews !!', data: null, error: error.message });
    }
};

module.exports={getManyProducts,postProduct,getProduct,patchProduct,deleteProduct,getProductReviews}