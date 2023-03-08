const express = require("express")
const RegsterUser = require("../module/UserSchema")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const Router = express.Router();


Router.login("/Userlogin",async(req,res)=>{
    try{
        const Result = await RegsterUser.find({Email:req.body.email})
        if(Result && Result.isVerfied==1){
            let CompairedPassword = await bcrypt.compare(myPlaintextPassword, hash)
             if(CompairedPassword){
                const RefreshToken = jwt.sign(Result.id,"abcdefghijklmnopqrstuvwxyz",{
                    expiresIn:'30days'
                })
                const expeiredToken = jwt.sign(Result.id,"abcdefghijklmnopqrstuvwxyz",{
                    expiresIn:'14min'
                })              
             }
        }
    }
    catch(error){
        console.log(error)
    }
})

Router.login("/UserRegister",
body('name').isAlpha(),body('username').isAlphanumeric(),body('email').isEmail(),body('password').isLength({min:8})
,async(req,res)=>{
    try {
        const validationOutput = validationResult(req)
        console.log(validationOutput.isEmpty())
        const hashedPassowrd = await bcrypt.hash(req.body.password, 10)

        if (validationOutput.isEmpty()) {
            let Result = await RegistionDataNew.create({
                name: req.body.name,
                username: req.body.username,
                password: hashedPassowrd,
                email: req.body.email
            })
            res.json({ Result })
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







module.exports = Router