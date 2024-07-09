import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
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

document.addEventListener("DOMContentLoaded", () => {
    const logoutButton = document.getElementById("logout");

    const userLogout = async () => {
        try {
            await signOut(auth);
            console.log("User signed out successfully.");
            alert("Logout Successful!");

            // Redirect to index page after successful logout
            window.location.href = "index.html";
        } catch (error) {
            console.error("Error signing out:", error);
            alert("Logout failed: " + error.message);
        }
    };

    logoutButton.addEventListener("click", userLogout);
});
