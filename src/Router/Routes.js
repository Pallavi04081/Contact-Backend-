const express = require("express")
const {Tokenverify} = require("./Validation/RegisterValidation")


const { body, validationResult } = require('express-validator');
const Router = express.Router();

const { RegisterUSer,loginUser,getRegisterUser,deleteUser,deleteOne, UpdateUser} = require("./Controller")
const {Auth} = require("../Middlewear/Middlewear");
const { AcessToken, GenerateAcessToken } = require("./AuthenticationController");



Router.post("/GenerateAcessToken",GenerateAcessToken)

Router.post("/AcessToken",Auth,AcessToken)

Router.post("/Userlogin",loginUser)

Router.post("/UserRegister",
body('firstname').isAlpha(),body('middlename').isAlpha(),body('lastname').isAlpha(),body('email').isEmail(),body('password').isLength({min:8})
,RegisterUSer)

Router.get("/verifyEmail",async(req,res)=>{
       try{
       const Result = await RegsterUser.updateOne({_id:req.query.id},{$set:{VerifiedEmail:1}})
       res.send("Email is Verified")
       }
       catch(error){
        console.log(error)
       }
})

Router.get("/verify",async(req,res)=>{
       console.log("hello")
})

Router.get("/getRegisterUser",Tokenverify,getRegisterUser)

Router.post("/deleteUser",Tokenverify,deleteUser)

Router.delete("/deleteUser",Tokenverify,deleteOne)

Router.put("/UpdateUser",Tokenverify,UpdateUser)

module.exports = Router