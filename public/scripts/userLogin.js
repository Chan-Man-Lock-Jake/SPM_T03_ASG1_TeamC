import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCvsupITjCXYnyJ5taUTfgKaTr4ICuZmI4",
    authDomain: "auth-e1f14.firebaseapp.com",
    databaseURL: "https://auth-e1f14-default-rtdb.firebaseio.com",
    projectId: "auth-e1f14",
    storageBucket: "auth-e1f14.appspot.com",
    messagingSenderId: "744589697016",
    appId: "1:744589697016:web:47a44ec6954e8bfd2bc800d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const googleLoginButton = document.getElementById("googleLoginButton");

    const userLogin = async (event) => {
        event.preventDefault();

        const emailInput = document.getElementById("emailInput").value;
        const passwordInput = document.getElementById("passwordInput").value;

        const userData = {
            email: emailInput,
            password: passwordInput,
        };

        try {
            const response = await fetch("http://localhost:4000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                throw new Error("Failed to Log in user");
            }

            const result = await response.json();
            console.log("User login successful:", result);
            alert("Login Successful!");

            // Redirect to index page after successful login
            window.location.href = "index.html";
        } catch (error) {
            console.error("Error Logging in user:", error);
            alert("Login failed: " + error.message);
        }
    };

    const googleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            console.log("User signed in with UID:", user.uid); // User's uid in Firebase

            alert("Google Login Successful!");

            // Redirect to index page after successful login
            window.location.href = "index.html";
        } catch (error) {
            console.error("Error logging in with Google:", error);
            alert("Google Login failed: " + error.message);
        }
    };

    loginForm.addEventListener("submit", userLogin);
    googleLoginButton.addEventListener("click", googleLogin);
});
