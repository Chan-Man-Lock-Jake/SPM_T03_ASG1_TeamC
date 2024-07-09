const User = require("../models/user");

// Middleware to check if user is authenticated
const checkAuth = async (req, res, next) => {
    try {
        if (!User.isAuthenticated()) {
            return res.status(401).send({ error: "User is not authenticated" });
        }
        next(); // Continue to the next middleware or route handler
    } catch (error) {
        console.error("Error checking authentication:", error);
        res.status(500).send("Error checking authentication");
    }
};

module.exports = {
    checkAuth,
};
