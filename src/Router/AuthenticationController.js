const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

const AcessToken = async(req,res)=>{
    console.log("verify=>",req.VerifyToken)
    console.log(req.VerifyToken)
    if(req.VerifyToken){
        res.status(200).json({
            success:true,
            message:"user is authenticated"
        })
    }
}


const GenerateAcessToken = async(req,res)=>{
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
}



module.exports = {AcessToken,GenerateAcessToken}