//1 import express
const express = require('express')

const userController = require('../Controller/userController')
const petController = require('../Controller/petController')

const jwtMiddleware = require('../Middlewares/jwtMiddleware')
const multerconfig = require('../Middlewares/multerMiddlewares')
const passport = require('passport')
//2 create router object of express to define path
const router = express.Router() 


router.get("/login/success",(req,res)=>{
    if(req.user){
res.status(200).json({
  error:false,  
  message:"Successfully Loged in",
  user:req.user,
});
    } else{
        res.status(403).json({error:true,message:"Not Authorized"});
    }
});



router.get("/login/failed",(req,res)=>{
    res.status(401).json({
        error:true,
        message:"Log in failure",
    });
});


router.get(
    "/google/callback",
    passport.authenticate("google",{
        successRedirect:process.env.CLIENT_URL,
        failureRedirect:"/login/failed",
    })
);

router.get("/google",passport.authenticate("google",["profile","email"]));

router.get("/logout",(req,res)=>{
    req.logOut();
    res.redirect(process.env.CLIENT_URL);
});


//3 Register api call
router.post('/register',userController.register)

//4 login api call
 router.post('/login',userController.login)
//5add pet api call
router.post('/pet/add-pet',jwtMiddleware,multerconfig.single('petImage'), petController.addPet) 

 //6 get a particular  pet details API
 router.get('/pet/get-a-pet',jwtMiddleware,petController.getAPet)

//7 get first 3   project details for home API
router.get('/pet/home-pet',multerconfig.single('petImage'),petController.getHomePets) //token is not needed to check because before login 3 projects are displayed in home
 
//8 get all  pets details for  API
router.get('/pet/all-pet',jwtMiddleware,petController.allPets)

//9 delete pet
router.delete('/pet/delete-a-pet/:pid',jwtMiddleware,petController.deleteUserPet)
//10 update user project
router.put('/pet/update-user-pet/:pid',jwtMiddleware,multerconfig.single('petImage'), petController.updateUserPet)
//11 get all  userss details for  API
router.get('/users/all-users',jwtMiddleware,userController.allUsers)
//12 get all users
router.put('/user/update/:id', jwtMiddleware, userController.updateUser);
 module.exports = router;