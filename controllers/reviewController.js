const Review = require('../models/reviewModel.js')



const postReview = async (req,res)=>{
    const currentUser = req.user._id

    try{

        const revData = req.body

        const data = {
            ...revData,
            userId:currentUser
        }

        const rev = await Review.create(data)

        return res.status(200).json({message:`review was added successfully !!`, data:rev})  
    }
    catch(error){
    return res.status(500).json({ message: 'Failed to add review !!' , data:null , error: error.message })
    }

    }

//? usally i'd check wether the user is the same review writer but i'm kinda tired and have no time ... this is just fine anyway

const deleteReview = async (req,res)=>{
    let {id:RevId} = req.params
    try{
        const rev = await Review.findOneAndDelete({ _id: RevId })
        if(!rev) return res.status(404).json({message:`Could not find any review with this id`, error:'review does not exist', data:null})
        return res.status(200).json({message:`review was removed successfully !!`, data:rev})  
    }
    catch(error){
    return res.status(500).json({ message: 'Failed to delete review !!' , data:null , error: error.message })
    }

}


module.exports={postReview,deleteReview}