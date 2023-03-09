const RegsterUser = require("../module/UserSchema")
const UserToken = require("../module/Token")
const SendEmail = require("../Utils/sendEmail")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');


const RegisterUSer = async(req,res)=>{
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
}


const loginUser = async(req,res)=>{
    try{
        console.log(req.body)
        const Result = await RegsterUser.find({Email:req.body.email})
        if(Result.length>=1){    
            if(Result[0]?.VerifiedEmail==1) {
            let CompairedPassword = await bcrypt.compare(req.body.password,Result[0].password)
            console.log(CompairedPassword) 
            if(CompairedPassword){
                const RefreshToken = jwt.sign({_id:Result[0].id},"abcdefghijklmnopqrstuvwxyz",{
                    expiresIn:'30days'
                })
                const expeiredToken = jwt.sign({_id:Result[0].id},"abcdefghijklmnopqrstuvwxyz",{
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
}


const getRegisterUser = async(req,res)=>{
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
}


const deleteUser = async(req,res)=>{
        try{
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
        catch(error){
         console.log(error)
        }
    }

const deleteOne = async(req,res)=>{
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
}

const UpdateUser = async(req,res)=>{
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
         res.status(200).json({
             Result:Result
         })
        }
        }
        catch(error){
         console.log(error)
        }
}

module.exports = {RegisterUSer,loginUser,getRegisterUser,deleteUser,deleteOne,UpdateUser}