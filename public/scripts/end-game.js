import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore, collection, addDoc, query, getDocs, orderBy, limit, updateDoc, doc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

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

document.addEventListener('DOMContentLoaded', () => {
    // Retrieve the score from localStorage 
    const finalScore = parseInt(localStorage.getItem('finalScore'), 10) || 0;
    console.log('Score retrieved from localStorage:', finalScore);

    // Display the score in the score-space element
    const scoreSpace = document.getElementById('score-space');
    if (scoreSpace) {
        scoreSpace.innerHTML = "Your score is " + finalScore;
    }

    // Call saveUserScore only after confirming authentication state
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            // User is signed in
            const highestScore = await getHighestScore(user.uid);
            
            // Display the highest score
            const highestScoreSpace = document.getElementById('highest-score-space');
            if (highestScoreSpace && highestScore !== null) {
                highestScoreSpace.innerHTML = "Highest score: " + highestScore;
            }

            if (finalScore > highestScore) {
                await saveUserScore(finalScore, user.uid);
                localStorage.setItem('highestScore', finalScore);
            } else {
                localStorage.setItem('highestScore', highestScore);
            }

            // Check if the score qualifies for the leaderboard
            const qualifies = await doesScoreQualify();
            if (qualifies) {
                showPrompt(); // Function to show prompt for enterName
            } else {
                alert('Your score does not qualify for the leaderboard.');
                window.location.href = 'home.html';
            }
        } else {
            console.log("No user is signed in.");
        }
    });
});

async function saveUserScore(scoreParameter, userId) {
    const scoreColRef = collection(db, "Users", userId, "scores");
    try {
        await addDoc(scoreColRef, {
            score: scoreParameter
        });
        console.log("Score saved successfully");
    } catch (error) {
        console.error("Error saving the score: ", error);
    }
}

async function getHighestScore(userId) {
    const scoreRef = collection(db, "Users", userId, "scores");
    const q = query(scoreRef, orderBy("score", "desc"), limit(1));

    try {
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            const highestScore = querySnapshot.docs[0].data().score;
            console.log("Highest score retrieved:", highestScore);
            return highestScore;
        } else {
            console.log("No scores found for user.");
            return 0; // Assuming 0 if no scores found
        }
    } catch (error) {
        console.error("Error fetching highest score:", error);
        return 0;
    }
}

// Check if the score qualifies for the leaderboard
async function doesScoreQualify() {
    const score = parseInt(localStorage.getItem('finalScore'), 10) || 0; // Fetch the total score from localStorage

    // Reference to the Firestore collection
    const leaderboardRef = collection(db, 'leaderboard');

    try {
        // Fetch the top 10 scores
        const querySnapshot = await getDocs(query(leaderboardRef, orderBy('score', 'desc'), limit(10)));

        if (querySnapshot.empty) {
            // If there are no scores in the leaderboard, any score qualifies
            return true;
        }

        // Get the lowest score in the top 10
        const lowestTopScore = querySnapshot.docs[querySnapshot.docs.length - 1].data().score;

        // Check if the new score qualifies
        return score > lowestTopScore;
    } catch (error) {
        console.error('Error checking score qualification: ', error);
        return false;
    }
}

// Show prompt for enterName if score qualifies
function showPrompt() {
    document.getElementById('namePrompt').style.display = 'block';
}

// Function to save the score
async function saveScore(enterName) {
    const score = parseInt(localStorage.getItem('finalScore'), 10) || 0;
    const leaderboardRef = collection(db, 'leaderboard'); // Ensure the collection name matches

    try {
        const querySnapshot = await getDocs(query(leaderboardRef, orderBy('score', 'desc'), limit(10)));
        let updateScore = true;

        if (!querySnapshot.empty) {
            const highestScore = querySnapshot.docs[0].data().score;
            if (score <= highestScore) {
                updateScore = false;
            }
        }

        if (updateScore) {
            await addDoc(leaderboardRef, {
                name: enterName,
                score: score
            });
            console.log('Score saved successfully');
            localStorage.setItem('enterName', enterName);
        }
        window.location.href = 'home.html'; 
    } catch (error) {
        console.error('Error saving score:', error);
        window.location.href = 'home.html'; 
    }
}

// Event listener for the submit button
document.getElementById('submitName').addEventListener('click', () => {
    const enterName = document.getElementById('playerName').value;
    if (enterName.trim()) {
        saveScore(enterName);
        window.location.href = 'leaderboard.html';
    } else {
        alert('Please enter a valid name.');
    }
});
