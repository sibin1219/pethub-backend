// Import userSchema or model
const users = require('../Models/userSchema');
// Import jwt token
const jwt = require('jsonwebtoken');
// Import validator and bcrypt
const validator = require('validator');
const bcrypt = require('bcrypt');

exports.register = async (req, res) => {
    // 1 accept data from client 
    const { username, email, password } = req.body;
    console.log(username, email, password);
    
    try {
        // Validate email
        if (!validator.isEmail(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        const existingUser = await users.findOne({ email });
        console.log(existingUser);
        
        if (existingUser) {
            // If email exists, return an error
            return res.status(406).json({ error: 'User already exists' });
        } else {
            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new users({
                username,
                email,
                password: hashedPassword
            });
            await newUser.save();
            res.status(200).json(newUser);
        }
    } catch (err) {
        res.status(500).json('Register failed....');
    }
}

// Login logic
exports.login = async (req, res) => {
    // Accept data from client
    const { email, password } = req.body;
    
    // Allow admin login bypass
    if (email === 'admin@gmail.com' && password === 'admin') {
        const adminUser = { username: 'admin', email: 'admin@gmail.com', password: 'admin' };
        const token = jwt.sign({ userId: 'admin' }, 'super2024');
        return res.status(200).json({ existingUser: adminUser, token });
    }
    
    try {
        // Check if email and password in db
        const existingUser = await users.findOne({ email });
        if (existingUser) {
            // Compare hashed password
            const isMatch = await bcrypt.compare(password, existingUser.password);
            if (isMatch) {
                const token = jwt.sign({ userId: existingUser._id }, "super2024"); // Create token using jwt secret key -super2024
                console.log(token);
                res.status(200).json({ existingUser, token });
            } else {
                res.status(404).json("Invalid email and password");
            }
        } else {
            res.status(404).json("Invalid email and password");
        }
    } catch (err) {
        res.status(500).json("Login failed..." + err);
    }
}
// Get all usernames
exports.allUsers = async (req, res) => {
    const searchKey = req.query.search;
    console.log(searchKey);
    // Case insensitive search by username
    let query = {};
    if (searchKey) {
        query.username = { $regex: searchKey, $options: "i" };
    }

    try {
        // Find users with only the username field
        const allUsers = await users.find(query, 'username');
        if (allUsers.length > 0) {
            res.status(200).json(allUsers);
        } else {
            res.status(401).json("No users found");
        }
    } catch (err) {
        res.status(401).json({ error: err.message });
    }
}



exports.updateUser = async (req, res) => {
    const { username, email, password } = req.body;
    const userId = req.params.id;

    try {
        const updatedData = { username, email };
        if (password) {
            updatedData.password = await bcrypt.hash(password, 10);
        }
        const updateUser = await users.findByIdAndUpdate(userId, updatedData, { new: true });
        res.status(200).json(updateUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};