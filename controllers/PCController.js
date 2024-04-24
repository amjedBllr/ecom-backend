const PC = require('../models/PCModel.js')

const getAllPCs = async (req,res)=>{
    try{
        const pc = await PC.find({})

        if (pc.length === 0) {
            return res.status(404).json({ message: 'Could not find any category !' , data:[]});
        }

        res.status(200).json({message : 'categories were fetched successfully !!' , data: pc })
    }
    catch(error){
        res.status(500).json({ message: 'Failed to fetch categories', error: error.message });
    }
}

const getPC = async(req,res)=>{
    try{
        let {category:categoryName} = req.params

        const pc = await PC.findOne({categoryName : categoryName})

        if(!pc) return res.status(404).json({message:`Could't find any category with that name`, data:[]})

        else return res.status(201).json({message:`Category was fetched successfully !!`, data:pc})
    }
    catch(error){
        res.status(500).json({ message: 'Failed to fetch category !!', error: error.message })
    }
}

const postPC = async (req,res)=>{
    try{

    let pc = await PC.findOne({categoryName:req.body.categoryName})

    if (pc) {
        return res.status(400).json({ message: `could not add category`, error:`Category already exists` });
    }
    else{
        let pc = await PC.create(req.body)
        return res.status(201).json({ message: `category added successfully !!` , data : {pc} })
    }

    }
    catch(error){
        res.status(500).json({ message: 'Failed to add category', error: error.message })
    }
}
const deletePC = async (req,res)=>{
    try{
        let {category:categoryName} = req.params

        const pc = await PC.deleteOne({categoryName : categoryName})

        if(!pc) return res.status(404).json({message:`Could't find any category with that name`, data:[]})

        else return res.status(200).json({message:`Category was deleted successfully !!`, data:pc})
    }
    catch(error){
        res.status(500).json({ message: 'Failed to delete category !!', error: error.message })
    }
}

const patchPC = async (req,res)=>{
    try{
        let {category:categoryName} = req.params

        const pc = await PC.findOneAndUpdate({categoryName : categoryName},req.body,{
            new: true ,
            runValidators : true
        })
        

        if(!pc) return res.status(404).json({message:`Could't find any category with that name`, data:[]})

        else return res.status(201).json({message:`Category was patched successfully !!`, data:pc})
    }
    catch(error){
        res.status(500).json({ message: 'Failed to patch category !!', error: error.message })
    }
}





module.exports={getAllPCs,getPC,postPC,patchPC,deletePC}