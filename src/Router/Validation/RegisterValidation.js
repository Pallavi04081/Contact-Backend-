const jwt = require("jsonwebtoken");
const UserToken = require("../../module/Token")




const Tokenverify = async (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization;
    console.log(token)
    const Result = await UserToken.find({RefreshToken:token})
    if (Result[0]?.RefreshToken){
      jwt.verify(token, "abcdefghijklmnopqrstuvwxyz", function (err, decoded) {
        if (err) {
          console.log(err)
          return res.status(403).json({
            status: "failed",
            message: "Invalid token",
          });
        }
        console.log("insideverifytoken")
        next();
      });
    } else {
      return res.status(403).json({
        status: "failed",
        message: "Please loggin",
      });
    }
    }
    else {
    return res.status(403).json({ status: "Failed", message: "Not authenticated user" });
    }
};

module.exports = {Tokenverify}; 

