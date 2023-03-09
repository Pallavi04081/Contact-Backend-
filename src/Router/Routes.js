const express = require("express")
const RegsterUser = require("../module/UserSchema")
const UserToken = require("../module/Token")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const Router = express.Router();
const SendEmail = require("../Utils/sendEmail")




const Auth = async(req,res,next)=>{
    try{
    let token = req.headers.authorization
    console.log(token);
    if(token){
        const Result = await UserToken.findOne({AcessToken:req.headers.authorization}) 
      if(Result.AcessToken){
          const VerifyToken = jwt.verify(token,"abcdefghijklmnopqrstuvwxyz")
          console.log(VerifyToken)
          if(VerifyToken){
            req.VerifyToken = VerifyToken
            next()
          }
          else{
            res.status(400).json({
                message:"unverified Token"
            })
          }
     }
     else{
        res.status(400).json({
            message:"Token not Found"
        })
     }
    }}
    catch(error){
        res.status(403).json({
            message:"user not authenticated"
        })
    }
}


Router.post("/GenerateAcessToken",async(req,res)=>{
      try{
    const RefreshToken = req.body.token
    console.log(RefreshToken)
         if(RefreshToken){
               const Result = await UserToken.find({RefreshToken:req.body.token})
               console.log("res=>",Result)
               if(Result[0].RefreshToken){
                 const AcessToken = jwt.sign({_id:Result[0].user},"abcdefghijklmnopqrstuvwxyz",{expiresIn:"14m"})
                 const Data = await UserToken.updateOne({RefreshToken},{$set:{AcessToken:AcessToken}})
                 const newAcessToken = await UserToken.find({RefreshToken:RefreshToken})
                 res.status(200).json({
                    success:true,
                    AcessToken:AcessToken
                 })
               }
               else{
                res.status(400).json({
                    success:false,
                    message:"user is not logged in"
                })
               }
         }
         else{
            res.status(200).json({
                success:false,
                message:"token not avalible in req.body"
            })
         }
      }
      catch(error){
        console.log(error)
      }
})



Router.post("/AcessToken",Auth,(req,res)=>{
    console.log("verify=>",req.VerifyToken)
    if(req.VerifyToken){
        res.status(200).json({
            success:true,
            message:"user is authenticated"
        })
    }
})



Router.post("/Userlogin",async(req,res)=>{
    try{
        console.log(req.body)
        const Result = await RegsterUser.find({Email:req.body.email})
        if(Result.length>=1){    
            if(Result[0]?.VerifiedEmail==1) {
            let CompairedPassword = await bcrypt.compare(req.body.password,Result[0].password)
            console.log(CompairedPassword) 
            if(CompairedPassword){
                const RefreshToken = jwt.sign({_id:Result.id},"abcdefghijklmnopqrstuvwxyz",{
                    expiresIn:'30days'
                })
                const expeiredToken = jwt.sign({_id:Result.id},"abcdefghijklmnopqrstuvwxyz",{
                    expiresIn:'14m'
                })

                const useTokenPresent = await UserToken.find({user:Result[0]._id})
                console.log("usetoken=>",useTokenPresent)
                let useTokenPresentResult;
                if(useTokenPresent[0]?.RefreshToken){
                    const ResponceResult = await UserToken.updateOne({user:Result[0]._id},{$unset:[
                        "AcessToken", "RefreshToken"
                    ]})
                     console.log("unset=>",ResponceResult)
                    const useTokenPresentResult = await UserToken.updateOne({user:Result[0]._id},{$set:{
                        AcessToken:expeiredToken,
                        RefreshToken:RefreshToken
                    }})
                    console.log("set=>",useTokenPresentResult)
                }
                else{
                    const useTokenPresentResult = await UserToken.create({
                        AcessToken:expeiredToken,
                        RefreshToken:RefreshToken,
                        user:Result[0]._id
                    })
                }   
                console.log("token=>",useTokenPresent)         
                res.status(200).json({
                    TokenResult: useTokenPresentResult,
                    RefreshToken:RefreshToken,
                    expeiredToken:expeiredToken
                })
             }
            }
            else{
                SendEmail(Result)
                res.status(400).json({
                    message:"Email is not verified please checkout your email to vetification link"
                })
            }
            }
        else{
                res.status(400).json({
                    message:"Please Register"
                })
        }
    }
    catch(error){
        console.log(error)
    }
})

Router.post("/UserRegister",
body('firstname').isAlpha(),body('middlename').isAlpha(),body('lastname').isAlpha(),body('email').isEmail(),body('password').isLength({min:8})
,async(req,res)=>{
    try {
        console.log(req.body)
        const validationOutput = validationResult(req)
        console.log(validationOutput.isEmpty())
        console.log(validationOutput.array())
        const hashedPassowrd = await bcrypt.hash(req.body.password, 10)

        if (validationOutput.isEmpty()) {
            let Result = await RegsterUser.create({
                FirstName:req.body.firstname,
                LastName:req.body.lastname,
                MiddleName:req.body.middlename,
                Email:req.body.email,
                Gender:req.body.gender,
                ProgileImage:req.body.profileimage,
                DateOFBirth:req.body.DOB,
                password:hashedPassowrd,
                ProfileImage:req.body.profileimage
            })
            SendEmail(Result)
            console.log(SendEmail)
            res.status(200).json({  
             success:true,
             message:"Registration Sucess Please Verify Email address"
            })
        } else {
            res.status(400).json({
             error: validationOutput.array()
                
            })
            
        }
    }
    catch (error) {
        res.status(400).json({
            error
        })
    }
})

Router.get("/verifyEmail",async(req,res)=>{
       try{
       const Result = await RegsterUser.updateOne({_id:req.query.id},{$set:{VerifiedEmail:1}})
       res.send("Email is Verified")
       }
       catch(error){
        console.log(error)
       }
})


Router.get("/getRegisterUser",async(req,res)=>{
    try{
    if(req.query.id){
        const Result = await RegsterUser.find({_id:req.query.id})
        console.log(Result)
         res.status(200).json({
             Result:Result
         })
    }
    else{
    const Result = await RegsterUser.find({VerifiedEmail:1})
    console.log(Result)
     res.status(200).json({
         Result:Result
     })
    }
    }
    catch(error){
     console.log(error)
    }
})

Router.post("/deleteUser",async(req,res)=>{
    try{
        console.log(req.body)
    if(!req.query.id){
        let Result
        for(i=0;i<req.body.length;i++){
        Result = await RegsterUser.findOneAndDelete({_id:req.body[i]})
        }  
        if(Result){
            res.status(200).json({
                message:"success"
            })
        }
    }
    else{
    const Result = await RegsterUser.findOneAndDelete({_id:req.query.id})
    console.log(Result)
     res.status(200).json({
         Result:Result
     })
    }}
    catch(error){
     console.log(error)
    }
})

Router.delete("/deleteUser",async(req,res)=>{
    try{
    const Result = await RegsterUser.findOneAndDelete({_id:req.query.id})
    console.log(Result)
     res.status(200).json({
         Result:Result
    })
}
    catch(error){
     console.log(error)
    }
})

Router.put("/UpdateUser",async(req,res)=>{
    try{
    if(req.query.id){
        const Result = await RegsterUser.findOneAndUpdate({_id:req.query.id},{
            FirstName:req.body.FirstName,
            LastName:req.body.LastName,
            MiddleName:req.body.MiddleName,
            Email:req.body.Email,
            Gender:req.body.Gender,
            ProgileImage:req.body.ProgileImage,
            DateOFBirth:req.body.DateOFBirth,
            password:req.body.password,
            ProfileImage:req.body.profileImage
        })
        
         res.status(200).json({
             Result:Result
         })
    }
    else{
    const Result = await RegsterUser.find({VerifiedEmail:1})
    console.log(Result)
     res.status(200).json({
         Result:Result
     })
    }
    }
    catch(error){
     console.log(error)
    }
})

module.exports = Router