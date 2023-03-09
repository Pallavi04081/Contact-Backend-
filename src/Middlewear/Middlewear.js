const Auth = async(req,res,next)=>{
    try{
        //console.log(req.headers.authorizatin)
    let token = req.headers.authorization
    console.log(token);
    if(token){
        console.log("hello")
        const Result = await UserToken.findOne({AcessToken:req.headers.authorization}) 
        console.log("Result=>",Result)
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

module.exports = {Auth}