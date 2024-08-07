const pets = require('../Models/petSchema')
//add project logic
exports.addPet = async (req, res) => {
    console.log("inside the addPet method");
    const {name,age,type,breed,gender,number,state,district} = req.body
    const petImage = req.file.filename
    const userId = req.payload
    console.log(name,age,type,breed,gender,number,state,district,petImage);
    console.log(userId);

    try {
   

        
            const newPet = new pets( {name,age,type,breed,gender,number,state,district,petImage,userId})
            await newPet.save()
            res.status(200).json(newPet)
        

    } catch (err) {
        res.status(401).json({ error: err.message });
    }


}


//1 Get a particular user pets details
exports.getAPet = async (req, res) => {
    console.log("inside getapet");

    const userId = req.payload

    try {
        const APet = await pets.find({ userId })
        if (APet) {
            res.status(200).json(APet)
        } else {
            res.status(401).json("Can't find pet");
        }


    } catch (err) {
        res.status(401).json({ error: err.message });
    }

}




//2 Get first  3 pets details
exports.getHomePets = async (req, res) => {
    try {
        const HomePet = await pets.find().limit(3)
        if (HomePet) {
            res.status(200).json(HomePet)
        } else {
            res.status(401).json("Can't find pet");
        }


    } catch (err) {
        res.status(404).json({ error: err.message });
    }

}



//Get all pet details
exports.allPets = async (req, res) => {
    const searchKey = req.query.breed;
    const state = req.query.state;
    const district = req.query.district;

    console.log(searchKey, state, district);

    // Construct the query object
    let query = {};
    if (searchKey) {
        query.breed = { $regex: searchKey, $options: "i" };
    }
    if (state) {
        query.state = { $regex: state, $options: "i" };
    }
    if (district) {
        query.district= { $regex: district, $options: "i" };
    }

    try {
        const allPet = await pets.find(query);
        if (allPet) {
            res.status(200).json(allPet);
        } else {
            res.status(404).json("Can't find pet");
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};





//4 delete user pet
exports.deleteUserPet = async (req, res) => {
    const { pid } = req.params //get project id 
    try {
        const deleteUserPet = await pets.findOneAndDelete({ _id: pid })
        //Creates a findOneAndDelete query: atomically finds the given document, deletes it, and returns the document as it was before deletion
        res.status(200).json(deleteUserPet)


    }
    catch (err) {
        res.status(401).json({ message: err.message })
    }
}


//5 update user project
exports.updateUserPet = async (req,res) => {
    const {name,age,type,breed,gender,number,state,district,petImage} = req.body
    userId = req.payload
    const {pid} = req.params
    const uploadImage = req.file?req.file.filename:petImage
try{
    //find particular project , upate the data and save the changes
    const updatePet =await pets.findByIdAndUpdate({_id:pid},{name,age,type,breed,gender,number,state,district,petImage,userId})
    await updatePet.save()
    res.status(200).json(updatePet)
}catch(err){
    res.status(401).json({message:err.message})
}


}
