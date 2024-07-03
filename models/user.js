// Import Firebase functions 
const { getFirestore, addDoc, collection } = require('firebase/firestore');
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, sendEmailVerification } = require('firebase/auth');
const { initializeApp } = require('firebase/app');

// Firebase configuration 
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

// Initialize Firestore database
const db = getFirestore(app);
const auth = getAuth(app);

class User {
    constructor(id, username, email, password) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
    }

    // Create Account
    static async createUser(newUser) {
        try {
            // Create user in Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, newUser.email, newUser.password);
            const user = userCredential.user;

            // Send email verification
            // await sendEmailVerification(user);

            // Add user data to Firestore database in "Users" collection
            await addDoc(collection(db, "Users"), {
                username: newUser.username,
                email: newUser.email,
                userId: user.uid 
            });

            // Store created user data
            const createdUser = {
                id: user.uid,
                username: newUser.username,
                email: newUser.email,
            };

            return createdUser;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    // Email-Password Login
    static async userLogin(email, password) {
        try {
            // Sign in user with email and password
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Return logged in user data
            const loggedInUser = {
                id: user.uid,
                email: user.email,
            };

            return loggedInUser;
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

module.exports = User;
