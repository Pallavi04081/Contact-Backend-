const mongoose = require("mongoose")

const userToken = mongoose.Schema({      
    AcessToken:{
        type:String,
        reuqired:true
    },
    RefreshToken:{
        type:String,
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"userRegisationDetails"
    }
})


const UserToken = mongoose.model("UserToken",userToken)

module.exports = UserToken