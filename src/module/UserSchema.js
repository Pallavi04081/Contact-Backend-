const mongoose = require("mongoose")

const userRegisationDetails = mongoose.Schema({      
    FirstName:{
        type:String,
        required:true
        
    },
    MiddleName:{
        type:String,
        required:true
    },
    LastName:{
        type:String,
        required:true
    },
    Email:{
        type:String,
        required:true,
        unique:true
    },
    Gender:{
        type:String,
        required:true,
    },
    ProfileImage:{
        type:String
    },
    DateOFBirth:{
        type:String,
        reuqired:true
    }
})


const RegsterUser = mongoose.model("UserRegisationDetail",userRegisationDetails)

module.exports = RegsterUser