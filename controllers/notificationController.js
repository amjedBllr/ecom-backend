const Notif = require('../models/notificationModel.js')

const getManyNotifications = async (req,res)=>{

    const currentUser = req.user._id

    try {
        const notifs = await Notif.find({userId : currentUser})

        if (notifs.length === 0) { 
            return res.status(404).json({ message: 'No notification exists currently !!' , error:'could not find any notification !' , data:[]});
        }
        return res.status(200).json({message : 'Notification were fetched successfully !!' , data: notifs });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to fetch notfication',data:null, error: error.message });
    }
}

const getNotification = async(req,res)=>{

    const { id: NotifId } = req.params

    const currentUser = req.user._id

    try {
        const notif = await Notif.findOne({ userId: currentUser, _id: NotifId });

        if (notif.length === 0) { 
            return res.status(404).json({ message: 'notification does not exist currently !!' , error:'could not find any notification !' , data:[]});
        }

        return res.status(200).json({message : 'Notification were fetched successfully !!' , data: notif });

    } catch (error) {
        return res.status(500).json({ message: 'Failed to fetch notfication',data:null, error: error.message });
    }
}


const deleteNotification = async (req,res)=>{
        let {id:NotId} = req.params

    try{
        const notif = await Notif.findOneAndDelete({ _id: NotId })
        if(!notif) return res.status(404).json({message:`Could not find any notfication with this id`, error:'notification does not exist', data:null})
        return res.status(200).json({message:`notification was removed successfully !!`, data:notif})  
    }
    catch(error){
    return res.status(500).json({ message: 'Failed to delete notification !!' , data:null , error: error.message })
    }

}


module.exports={getManyNotifications,getNotification,deleteNotification}