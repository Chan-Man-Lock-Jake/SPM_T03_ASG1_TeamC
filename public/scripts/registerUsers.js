// Import the User class
import { User } from '../../models/user.js'; 

const form = document.getElementById('registerForm');

form.addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent form from submitting normally

    // Get form values
    const username = document.getElementById('usernameInput').value;
    const email = document.getElementById('emailInput').value;
    const password = document.getElementById('passwordInput').value;

    try {
        const newUser = {
            username: username,
            email: email,
            password: password
        };

        // Create user
        const createdUser = await User.createUser(newUser);
        console.log('User created successfully:', createdUser);
        alert('Registration successful!');

        // Redirect to login page after successful registration
        window.location.href = "index.html";
    } catch (error) {
        console.error('Error during registration:', error.message);
        alert('Error during registration. Please try again.');
    }
});
