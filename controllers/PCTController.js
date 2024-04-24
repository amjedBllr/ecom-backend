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

        const pct = await PCT.findOne({typeName:typeName})

        if(!pct) return res.status(404).json({message:`Could't find any type with that name`, data:[]})

        else return res.status(201).json({message:`type was fetched successfully !!`, data:pct})
    }
    catch(error){
        res.status(500).json({ message: 'Failed to fetch type !!', error: error.message })
    }
}

const postPCT = async (req,res)=>{
    try{

    let pct = await PCT.findOne({typeName:req.body.typeName})

    if (pct) {
        return res.status(400).json({ message: `could not add type`, error:`type already exists` });
    }
    else{
        let pct = await PCT.create(req.body)
        return res.status(201).json({ message: `type added successfully !!` , data : {pct} })
    }

    }
    catch(error){
        res.status(500).json({ message: 'Failed to add type', error: error.message })
    }
}
const deletePCT = async (req,res)=>{
    try{
        let {type:typeName} = req.params

        const pct = await PCT.deleteOne({typeName : typeName})

        if(!pct) return res.status(404).json({message:`Could't find any type with that name`, data:[]})

        else return res.status(200).json({message:`type was deleted successfully !!`, data:pct})
    }
    catch(error){
        res.status(500).json({ message: 'Failed to delete type !!', error: error.message })
    }
}

const patchPCT = async (req,res)=>{
    try{
        let {type:typeName} = req.params

        const pct = await PCT.findOneAndUpdate({typeName : typeName},req.body,{
            new: true ,
            runValidators : true
        })
        

        if(!pct) return res.status(404).json({message:`Could't find any type with that name`, data:[]})

        else return res.status(201).json({message:`type was patched successfully !!`, data:pct})
    }
    catch(error){
        res.status(500).json({ message: 'Failed to patch type !!', error: error.message })
    }
}





module.exports={getAllPCTs,getPCT,postPCT,patchPCT,deletePCT}