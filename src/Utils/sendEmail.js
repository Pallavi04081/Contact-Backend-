const nodemailer = require("nodemailer");
const env = require('dotenv')
env.config()


async function SendEmail(Result) {
    console.log("Result=>",Result)
    const output = Array.isArray(Result)
    
    if(output){
      let testAccount = await nodemailer.createTestAccount();

  
      let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        requireTLS:true, 
        auth: {
          user: process.env.USER, 
          pass: process.env.PASS, 
        },
      });
    
      let info = await transporter.sendMail({
        from:'katesunita021@gmail.com', 
        to: Result[0].Email, 
        subject:"For verification mail",
html: `<p>Hi ${Result[0].FirstName} Please click here <a href=https://contact-backend-ukxi.onrender.com/verifyEmail?id=${Result[0]._id}>Verify</a> to verify your Eamil Address</p>`, 
      });
    
      console.log("Message sent: %s", info.messageId);
    
    }
    else{
      let testAccount = await nodemailer.createTestAccount();

  
      let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        requireTLS:true, 
        auth: {
          user: process.env.USER, 
          pass: process.env.PASS, 
        },
      });
    
      
      let info = await transporter.sendMail({
        from: 'katesunita021@gmail.com', 
        to: Result.Email, 
        subject:"For verification mail",
        html: `<p>Hi ${Result.FirstName} Please click here <a href=https://contact-backend-ukxi.onrender.com/verifyEmail?id=${Result._id}>Verify</a> to verify your Eamil Address</p>`, 
      });
    
      console.log("Message sent: %s", info.messageId);
    
    }
}


module.exports = SendEmail
