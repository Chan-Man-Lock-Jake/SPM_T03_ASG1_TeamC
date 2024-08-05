import { User } from '../../models/user.js';

const userEmail = document.getElementById("emailInput");
const userPassword = document.getElementById("passwordInput");
const loginForm = document.getElementById("loginForm");
const googleLoginButton = document.getElementById("googleLoginButton");

const userLogin = async () => {
    const signInEmail = userEmail.value;
    const signInPassword = userPassword.value;

    try {
        const loggedInUser = await User.userLogin(signInEmail, signInPassword);
        console.log("User login successful:", loggedInUser);
        alert("Login successful!");

        // Store user details in local storage
        localStorage.setItem("user", JSON.stringify(loggedInUser));

        // Redirect to home page after successful login
        window.location.href = "home.html";
    } catch (error) {
        console.error("Error logging in user:", error.message);
        alert("Login failed: " + error.message);
    }
};

const googleLogin = async () => {
    try {
        // Implement Google login if required
    } catch (error) {
        console.error("Error logging in with Google:", error);
        alert("Google Login failed: " + error.message);
    }
};

loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    userLogin();
});
googleLoginButton.addEventListener("click", googleLogin);
