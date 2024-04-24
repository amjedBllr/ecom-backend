const PCT = require('../models/PCTModel.js')

const getAllPCTs = async (req,res)=>{
    try{
        const pct = await PCT.find({})

        if (pct.length === 0) {
            return res.status(404).json({ message: 'Could not find any category types !' , data:[]});
        }

        res.status(200).json({message : 'category types were fetched successfully !!' , data: pct })
    }
    catch(error){
        res.status(500).json({ message: 'Failed to fetch category types', error: error.message });
    }
}

const getPCT = async(req,res)=>{
    try{
        let {type:typeName} = req.params

        const pc = await PCT.findOne({typeName:typeName})

        if(!pc) return res.status(404).json({message:`Could't find any category with that name`, data:[]})

        else return res.status(201).json({message:`Category was fetched successfully !!`, data:pc})
    }
    catch(error){
        res.status(500).json({ message: 'Failed to fetch category !!', error: error.message })
    }
}

const postPCT = async (req,res)=>{
    try{

    let pc = await PCT.findOne({typeName:req.body.typeName})

    if (pc) {
        return res.status(400).json({ message: `could not add category`, error:`Category already exists` });
    }
    else{
        let pc = await PCT.create(req.body)
        return res.status(201).json({ message: `category added successfully !!` , data : {pc} })
    }

    }
    catch(error){
        res.status(500).json({ message: 'Failed to add category', error: error.message })
    }
}
const deletePCT = async (req,res)=>{
    try{
        let {type:typeName} = req.params

        const pc = await PCT.deleteOne({typeName : typeName})

        if(!pc) return res.status(404).json({message:`Could't find any category with that name`, data:[]})

        else return res.status(200).json({message:`Category was deleted successfully !!`, data:pc})
    }
    catch(error){
        res.status(500).json({ message: 'Failed to delete category !!', error: error.message })
    }
}

const patchPCT = async (req,res)=>{
    try{
        let {type:typeName} = req.params

        const pc = await PCT.findOneAndUpdate({typeName : typeName},req.body,{
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





module.exports={getAllPCTs,getPCT,postPCT,patchPCT,deletePCT}