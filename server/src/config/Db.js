const mongoose = require('mongoose')

const DbConnect = async (req, res)=>{
    try{
        mongoose.connect(process.env.MongoDb)
        console.log("DB Connect Successfully 🚀🚀..")
    }
    catch(err){
        console.log(err)
    }
}

module.exports = DbConnect