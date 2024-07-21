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
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Get form element
const form = document.getElementById('registerForm');

// Add form submit event listener
form.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form from submitting normally

    // Get form values
    const username = document.getElementById('usernameInput').value;
    const email = document.getElementById('emailInput').value;
    const password = document.getElementById('passwordInput').value;

    // Check if user already exists
    db.collection('User').where('email', '==', email).get()
    .then((querySnapshot) => {
        if (!querySnapshot.empty) {
            // User already exists
            alert('User with this email already exists.');
        } else {
            // Hash the password

            // Add user to Firestore
            db.collection('User').add({
                username: username,
                email: email,
                password: password
            })
            .then((docRef) => {
                console.log('Document written with ID: ', docRef.id);
                alert('Registration successful!');
                form.reset(); // Reset form after successful submission

                // Redirect to login page after successful registration
                window.location.href = "index.html";
            })
            .catch((error) => {
                console.error('Error adding document: ', error);
                alert('Error during registration. Please try again.');
            });
        }
    })
    .catch((error) => {
        console.error('Error checking user existence: ', error);
        alert('Error during registration. Please try again.');
    });
});