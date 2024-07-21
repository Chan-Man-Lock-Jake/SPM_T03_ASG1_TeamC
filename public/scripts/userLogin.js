import { getAuth, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

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
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

const loginForm = document.getElementById("loginForm");
const googleLoginButton = document.getElementById("googleLoginButton");

const userLogin = async (event) => {
    event.preventDefault();

    const emailInput = document.getElementById("emailInput").value;
    const passwordInput = document.getElementById("passwordInput").value;

    try {
        const userCredential = signInWithEmailAndPassword(auth, emailInput, passwordInput);
        const user = userCredential.user;
        
        console.log("User login successful:", user);
        alert("Login Successful!");
        await displayUsername(user);
        console.log(user);

        // Redirect to index page after successful login
        window.location.href = "home.html";
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
        window.location.href = "home.html";
    } catch (error) {
        console.error("Error logging in with Google:", error);
        alert("Google Login failed: " + error.message);
    }
};

loginForm.addEventListener("submit", userLogin);
googleLoginButton.addEventListener("click", googleLogin);

const displayUsername = async (user) => {
    try {
        const userDocRef = doc(db, 'User', user.uid);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
            const userData = docSnap.data();
            const username = userData.username;
            // Store username in localStorage for use in home.html
            localStorage.setItem('username', username);
        } else {
            console.error('No such document!');
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
};