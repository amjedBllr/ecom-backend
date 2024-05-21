const Report = require('../models/reportModel.js');

const getAllReports = async (req, res) => {
    try {
        const reports = await Report.find({});
        if (reports.length === 0) {
            return res.status(404).json({ message: 'No reports exists currently !!' , error:'could not find any report !' , data:[]});
        }

        return res.status(200).json({message : 'reports were fetched successfully !!' , data: reports });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to fetch reports',data:null, error: error.message });
    }
};

const getOneReport = async (req, res) => {
    const { id } = req.params;
    try {
        const report = await Report.findOne({_id:id});
        if (!report) {
            return res.status(404).json({ message: 'Could not find a report with this id !!' , error:'could not find any report !' , data:[]});
        }
        return res.status(200).json({message : 'report were fetched successfully !!' , data: report });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to fetch report',data:null, error: error.message });
    }
};

const postOneReport = async (req, res) => {
    const currentUser = req.user;
    const data = {...req.body,userId:currentUser._id};
  
    try {
        const report = await Report.create(data)
        return res.status(201).json({message:`Report was added successfully !!`, data:data})  
    } catch (error) {
        return res.status(500).json({ message: 'Failed to add report !!' , data:null , error: error.message })
    }
};

const deleteOneReport = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedReport = await Report.findByIdAndDelete(id);
        if (!deletedReport) {
            return res.status(404).json({ message: 'Could not find a report with this id !!' , error:'could not find any report !' , data:[]});
        }
        return res.status(201).json({message:`Report was deleted successfully !!`, data:deletedReport}) 
    } catch (error) {
        return res.status(500).json({ message: 'Failed to delete report !!' , data:null , error: error.message })
    }
};


module.exports = { getAllReports, getOneReport, postOneReport, deleteOneReport };
