const applicationMiddleware =(req,res,next) => {
    console.log("Inside application middleware");
    next()
}
module.exports = applicationMiddleware