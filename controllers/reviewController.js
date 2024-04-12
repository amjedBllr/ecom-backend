const Task = require('../models/reviewModel.js')

const getAllTasks = async (req,res)=>{
    try{
        const tasks = await Task.find({})
        res.status(201).json({tasks})}
    catch(err){
        res.status(500).json({msg:err})
    }
}
const getOneTask = async(req,res)=>{
    try{
        let {id:taskId} = req.params
        const task = await Task.findOne({_id:taskId})
        if(!task){
            res.status(404).json({msg:`there ain't no task with the id of : ${taskId}`})
        }
        else res.status(201).json({task})
    }
    catch(err){
        res.status(500).json({msg:err})
    }
}
const postOneTask = async (req,res)=>{
    try{
    let task = await Task.create(req.body)
    res.status(201).json({task})
    console.log(`new task added !!`)
    }
    catch(err){
        res.status(500).json({msg:err})
    }
}
const deleteOneTask = async (req,res)=>{
    try{
        let {id:taskId} = req.params
        const task = await Task.findOneAndDelete({_id:taskId})
        if(!task){
            res.status(404).json({msg:`there ain't no task with the id of : ${taskId}`})
        }
        else res.status(201).json({task})
    }
    catch(err){
        res.status(500).json({msg : err})
    }
}

const patchOneTask = async (req,res)=>{
    try {
        const {id:taskId} = req.params
        const task = await Task.findOneAndUpdate({_id:taskId},req.body,{
            new: true ,
            runValidators : true
        })
        if(!task){
            res.status(404).json({msg:`there ain't no task with the id of : ${taskId}`})
        }
        else res.status(201).json({task})
    } catch (err) {
        res.status(500).json({msg : err})
    }
}

module.exports={getAllTasks,getOneTask,postOneTask,patchOneTask,deleteOneTask}