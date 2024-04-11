const mongoose = require('mongoose')

const  connectDb = async (url)=>{
   try{
    await mongoose.connect(url)
    console.log('Database connection has been established !!')
   }
   catch(err){
    throw(err)
   }
}

module.exports = connectDb ;