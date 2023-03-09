const nodemailer = require("nodemailer");

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
          user: 'nirmalpallavi0408@gmail.com', 
          pass: 'bvdwavxmvdwefqcx', 
        },
      });
    
      
      let info = await transporter.sendMail({
        from: 'nirmalpallavi0408@gmail.com', 
        to: Result[0].Email, 
        subject:"For verification mail",
        html: `<p>Hi ${Result[0].FirstName} Please click here <a href=http://localhost:5000/verifyEmail?id=${Result[0]._id}>Verify</a> to verify your Eamil Address</p>`, 
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
          user: 'nirmalpallavi0408@gmail.com', 
          pass: 'bvdwavxmvdwefqcx', 
        },
      });
    
      
      let info = await transporter.sendMail({
        from: 'nirmalpallavi0408@gmail.com', 
        to: Result.Email, 
        subject:"For verification mail",
        html: `<p>Hi ${Result.FirstName} Please click here <a href=http://localhost:5000/verifyEmail?id=${Result._id}>Verify</a> to verify your Eamil Address</p>`, 
      });
    
      console.log("Message sent: %s", info.messageId);
    
    }
}


module.exports = SendEmail
