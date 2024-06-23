// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
apiKey: "AIzaSyCvsupITjCXYnyJ5taUTfgKaTr4ICuZmI4",
authDomain: "auth-e1f14.firebaseapp.com",
projectId: "auth-e1f14",
storageBucket: "auth-e1f14.appspot.com",
messagingSenderId: "744589697016",
appId: "1:744589697016:web:4744ec6954e8bfd2bc800d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const provider = new GoogleAuthProvider();

// Buttons
const signInButton = document.getElementById("signInButton");
const signOutButton = document.getElementById("signOutButton");
const message = document.getElementById("message");

// User Sign In
const userSignIn = async () => {
    signInWithPopup(auth, provider)
    .then((result) => {
        const user = result.user;
        console.log("User signed in with UID:", user.uid); //user's uid in firebase
    }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
    });
};

// User Sign Out 
const userSignOut = async () => {
    signOut(auth).then(() => {
    alert("You have signed out successfully!");
    }).catch((error) => {});

};

// Checks if user has signed in
const handleAuthStateChanged = (user) => {
    if (user) {
        signInButton.style.display = "none";
        signOutButton.style.display = "block";
        message.style.display = "block";
        alert("You have signed in");
    } else {
        signInButton.style.display = "block";
        signOutButton.style.display = "none";
        message.style.display = "none";
    }
};

onAuthStateChanged(auth, handleAuthStateChanged);


signInButton.addEventListener('click', userSignIn);
signOutButton.addEventListener('click', userSignOut);