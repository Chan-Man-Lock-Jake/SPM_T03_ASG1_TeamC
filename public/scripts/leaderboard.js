import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, query, orderBy, limit, getDocs } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

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
const db = getFirestore(app);

async function updateUserScore(userId, score) {
    const userDocRef = doc(db, 'Leaderboard', userId);
    try {
        await setDoc(userDocRef, { score: score }, { merge: true });
        console.log("User score updated successfully!");
    } catch (error) {
        console.error("Error updating user score: ", error);
    }
}

async function loadLeaderboard() {
    const leaderboardRef = collection(db, 'Leaderboard');

    try {
        const querySnapshot = await getDocs(query(leaderboardRef, orderBy('score', 'desc'), limit(10)));
        const tbody = document.getElementById('fpLeaderboard-body');
        tbody.innerHTML = '';
        let rank = 1;
        let topScore = 0;
        let topScoreName = '';

        if (querySnapshot.empty) {
            console.log("No leaderboard data found.");
            tbody.innerHTML = '<tr><td colspan="3">No data available</td></tr>';
            return;
        }

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            console.log("Leaderboard Entry:", data); // Debug log

            if (data.name && data.score) {
                const row = document.createElement('tr');

                const rankCell = document.createElement('td');
                rankCell.textContent = rank++;
                rankCell.className = 'number';
                row.appendChild(rankCell);

                const nameCell = document.createElement('td');
                nameCell.textContent = data.name;
                nameCell.className = 'name';
                row.appendChild(nameCell);

                const scoreCell = document.createElement('td');
                scoreCell.textContent = data.score;
                scoreCell.className = 'points';


                row.appendChild(scoreCell);
                tbody.appendChild(row);

                // Track the top score and its owner
                if (data.score > topScore) {
                    topScore = data.score;
                    topScoreName = data.name;
                }
            } else {
                console.error("Invalid data:", data);
            }
        });

        // Display the highest score in the ribbon
        const highestScoreDiv = document.getElementById('highest-score');
        highestScoreDiv.innerHTML = `
            <div id="highest-score" class="highest-score">
                <div class="rank-num">1</div>
                <div class="rank-name">${topScoreName}</div>
                <div class="score-and-img">
                    <div class="rank-score">${topScore}</div>
                    <img src="https://github.com/malunaridev/Challenges-iCodeThis/blob/master/4-leaderboard/assets/gold-medal.png?raw=true" 
                        alt="gold medal" class="gold-medal"/>
                </div>
            </div>
        `;
    } catch (error) {
        console.error("Error getting leaderboard documents: ", error);
    }
}

async function handleGameCompletion(userId, score) {
    await updateUserScore(userId, score);
    loadLeaderboard(); // Reload the leaderboard to reflect the updated score
}
// Initialize page
window.onload = () => {
    loadLeaderboard();
};
