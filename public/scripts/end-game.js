import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore, collection, addDoc, query, getDocs, orderBy, limit, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

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
    const finalScore = parseInt(localStorage.getItem('finalScore'), 10) || 0;
    const scoreSpace = document.getElementById('score-space');
    
    if (scoreSpace) {
        scoreSpace.innerHTML = "Your score is " + finalScore;
    }

    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const highestScore = await getHighestScore(user.uid);
            const highestScoreSpace = document.getElementById('highest-score-space');
            
            console.log('Highest score:', highestScore); // Log highest score
            
            if (highestScoreSpace) {
                highestScoreSpace.innerHTML = "Highest score: " + highestScore;
            }

            if (finalScore > highestScore) {
                await saveUserScore(finalScore, user.uid);
                localStorage.setItem('highestScore', finalScore);
            } else {
                localStorage.setItem('highestScore', highestScore);
            }

            const qualifies = await doesScoreQualify();
            if (qualifies) {
                showPrompt();
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
        await addDoc(scoreColRef, { score: scoreParameter });
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
            console.log("Highest score retrieved:", highestScore); // Log highest score
            return highestScore;
        } else {
            console.log("No scores found for user.");
            return 0;
        }
    } catch (error) {
        console.error("Error fetching highest score:", error);
        return 0;
    }
}

async function doesScoreQualify() {
    const score = parseInt(localStorage.getItem('finalScore'), 10) || 0;
    const leaderboardRef = collection(db, 'Leaderboard');

    try {
        const querySnapshot = await getDocs(query(leaderboardRef, orderBy('score', 'desc'), limit(10)));

        if (querySnapshot.empty) {
            return true;
        }

        const lowestTopScore = querySnapshot.docs[querySnapshot.docs.length - 1].data().score;
        return score > lowestTopScore;
    } catch (error) {
        console.error('Error checking score qualification: ', error);
        return false;
    }
}

function showPrompt() {
    document.getElementById('namePrompt').style.display = 'block';
}

document.getElementById('submitName').addEventListener('submit', async (event) => {
    event.preventDefault();
    const enterName = document.getElementById('playerName').value.trim();
    const score = parseInt(localStorage.getItem('finalScore'), 10) || 0;

    console.log('Entered name:', enterName); // Log entered name
    console.log('Final score:', score); // Log final score

    if (enterName) {
        try {
            const leaderboardRef = collection(db, 'Leaderboard');
            const userRef = collection(db, 'Users');
            const leaderboardSnapshot = await getDocs(query(leaderboardRef, orderBy('score', 'desc'), limit(10)));

            let userScoreDoc = null;
            let lowestScoreDocId = null;

            // Check if the user already has an entry in the leaderboard
            const userQuerySnapshot = await getDocs(query(leaderboardRef, where('userId', '==', auth.currentUser.uid)));
            if (!userQuerySnapshot.empty) {
                userScoreDoc = userQuerySnapshot.docs[0];
            }

            // If user has an existing score in the leaderboard
            if (userScoreDoc) {
                const existingScore = userScoreDoc.data().score;
                if (score <= existingScore) {
                    console.log('Existing score is higher or equal, not updating');
                    return;
                }

                // Update the existing score if the new score is higher
                await updateDoc(userScoreDoc.ref, { score: score, name: enterName });
                console.log('Score updated successfully');
                return;
            }

            // Check if leaderboard needs updating
            if (leaderboardSnapshot.size >= 10) {
                const lowestScoreDoc = leaderboardSnapshot.docs[leaderboardSnapshot.docs.length - 1];
                lowestScoreDocId = lowestScoreDoc.id;
                const lowestScore = lowestScoreDoc.data().score;

                if (score <= lowestScore) {
                    console.log('Score does not qualify for the leaderboard');
                    return;
                }

                // Remove the lowest score from the leaderboard
                await deleteDoc(doc(db, 'Leaderboard', lowestScoreDocId));
            }

            // Add the new score to the leaderboard
            await addDoc(leaderboardRef, {
                name: enterName,
                score: score,
                userId: auth.currentUser.uid // Track the userId to ensure unique leaderboard entry
            });
            console.log('Score added successfully');

            window.location.href = 'home.html';
        } catch (error) {
            console.error('Error saving score:', error);
            window.location.href = 'home.html';
        }
    } else {
        alert('Please enter a valid name.');
    }
});