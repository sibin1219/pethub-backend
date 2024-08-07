const jwt = require('jsonwebtoken')
//Token verification


const jwtMiddleware =(req,res,next)=>{
    console.log("Inside jwt middleware");
    try{
        //get the token
    const token = req.headers['authorization'].slice(7)
    console.log(token);
    //verify the token
    const jwtverification = jwt.verify(token,"super2024")
    console.log(jwtverification);//payload -useid
    req.payload = jwtverification.userId
    next();
    }
    catch(err){
        res.status(401).json({"AuthorizationError":err.message})
    }
}
module.exports = jwtMiddleware