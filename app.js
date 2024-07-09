const express = require("express");
const cors = require('cors'); // For Front-end Framework Bootstrap 
const userController = require("./controllers/userController");
const { checkAuth } = require("./middleware/userAuth");

const app = express();
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.static("public")); // Serving static files from the 'public' directory
const PORT = process.env.PORT || 3000; // Defaulting to PORT 4000 if not specified in environment variables

// Route for handling user registration
app.post("/register", userController.createUser);

//Route for handling user login
app.post("/login", userController.userLogin);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});
