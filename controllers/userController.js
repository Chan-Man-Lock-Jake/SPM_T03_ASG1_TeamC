const User = require("../models/user");

// Create Account
const createUser = async (req, res) => {
    const newUserData = req.body;
    try {
        console.log("Received create data:", newUserData);

        // Validate User Data
        if (!newUserData || Object.keys(newUserData).length === 0) {
            return res.status(400).send({ error: "Invalid data" });
        }

        // Create User 
        const newUser = await User.createUser(newUserData);
        res.status(201).json(newUser);

    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).send("Error creating user: " + error.message);
    }
};

// Email-Password Login
const userLogin = async (req, res) => {
    const userData = req.body;
    try {
        console.log("Received Login Data:", userData);

        // Validate User Data
        if (!userData || Object.keys(userData).length === 0) {
            return res.status(400).send({ error: "Invalid data" });
        }

        // Perform User Login
        const loggedInUser = await User.userLogin(userData.email, userData.password);
        res.status(200).json(loggedInUser);
        
    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).send("Error logging in user: " + error.message);
    }
};

// Google Login
// const googleLogin = async (req, res) => {
//     try {
//         const loggedInUser = await User.googleLogin();
//         res.status(200).json(loggedInUser);
//     } catch (error) {
//         console.error("Error logging in with Google:", error);
//         res.status(500).send("Error logging in with Google: " + error.message);
//     }
// };

module.exports = {
    createUser,
    userLogin,
};
